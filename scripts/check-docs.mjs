import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync, realpathSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const requiredDocuments = [
  'AGENTS.md',
  'README.md',
  'PROJECT-MAINTENANCE-GUIDE.md',
  'DESIGN.md',
  'CHANGELOG.md',
  'docs/content-and-data.md',
  'docs/push-operations.md',
  'docs/deployment-troubleshooting.md',
]

function isInside(root, target) {
  const relative = path.relative(root, target)
  return relative === '' || (!path.isAbsolute(relative) && relative !== '..' && !relative.startsWith(`..${path.sep}`))
}

function listMarkdown(directory) {
  if (!existsSync(directory)) return []
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name)
    if (entry.isDirectory()) return listMarkdown(target)
    return entry.isFile() && entry.name.endsWith('.md') ? [target] : []
  })
}

// Keep newline offsets, so diagnostics refer to the original source lines.
function withoutCode(source) {
  let fence = null
  const lines = source.split('\n').map((line) => {
    const match = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/)
    if (fence) {
      if (match && match[1][0] === fence.character && match[1].length >= fence.length && match[2].trim() === '') fence = null
      return ''
    }
    if (match) {
      fence = { character: match[1][0], length: match[1].length }
      return ''
    }
    return /^(?: {4}|\t)/.test(line) ? '' : line
  })
  return lines.join('\n').replace(/(`+)([\s\S]*?)\1/g, (match) => match.replace(/[^\n]/g, ' '))
}

function readDestination(source, offset) {
  let index = offset
  while (/\s/.test(source[index] ?? '') && index < source.length) index += 1
  if (source[index] === '<') {
    const end = source.indexOf('>', index + 1)
    return end === -1 ? '' : source.slice(index + 1, end)
  }
  const start = index
  let depth = 0
  while (index < source.length) {
    const character = source[index]
    if (character === '\\' && index + 1 < source.length) {
      index += 2
      continue
    }
    if (character === '(') depth += 1
    if (character === ')') {
      if (depth === 0) break
      depth -= 1
    }
    if (/\s/.test(character) && depth === 0) break
    index += 1
  }
  return source.slice(start, index)
}

function markdownLinks(source) {
  const text = withoutCode(source)
  const matches = []
  for (const match of text.matchAll(/(?<!\\)\]\(/g)) {
    matches.push({ destination: readDestination(text, match.index + 2), index: match.index })
  }
  for (const match of text.matchAll(/^ {0,3}\[[^\]\n]+\]:\s*/gm)) {
    matches.push({ destination: readDestination(text, match.index + match[0].length), index: match.index })
  }
  return matches.map(({ destination, index }) => ({ destination, line: text.slice(0, index).split('\n').length }))
}

function inspectLocalLink(root, file, destination) {
  if (!destination || destination.startsWith('#') || destination.startsWith('//')) return null
  const windowsAbsolute = path.win32.isAbsolute(destination)
  const scheme = destination.match(/^([a-z][a-z\d+.-]*):/i)?.[1]?.toLowerCase()
  if (scheme && scheme !== 'file' && !windowsAbsolute) return null

  let target
  try {
    if (scheme === 'file') {
      target = fileURLToPath(destination)
    } else {
      const decoded = decodeURIComponent(destination.split(/[?#]/, 1)[0]).replace(/\\([\\()[\]<> ])/g, '$1')
      // A Windows drive/UNC path is still an absolute local path on other OSes.
      if (windowsAbsolute && !path.isAbsolute(decoded)) return '本地绝对路径位于项目外'
      target = path.resolve(path.dirname(file), decoded)
    }
  } catch {
    return '本地链接地址无法解析'
  }
  if (!isInside(root, target)) return '本地链接指向项目外部'
  if (!existsSync(target)) return '链接目标不存在'
  if (!isInside(root, realpathSync(target))) return '链接目标通过符号链接指向项目外部'
  return null
}

export function checkDocs({ root = process.cwd(), skipGit = false } = {}) {
  const errors = []
  const resolvedRoot = path.resolve(root)
  if (!existsSync(resolvedRoot) || !statSync(resolvedRoot).isDirectory()) {
    return { errors: ['项目根目录不存在或不是目录'], documentCount: 0, linkCount: 0, gitChecked: false }
  }
  const canonicalRoot = realpathSync(resolvedRoot)
  for (const relative of requiredDocuments) {
    const target = path.join(canonicalRoot, relative)
    if (!existsSync(target) || !statSync(target).isFile()) errors.push(`${relative}: 必需文档缺失`)
  }

  const documents = [...new Set([
    ...requiredDocuments.map((relative) => path.join(canonicalRoot, relative)),
    ...readdirSync(canonicalRoot, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
      .map((entry) => path.join(canonicalRoot, entry.name)),
    ...listMarkdown(path.join(canonicalRoot, 'docs')),
  ])].filter((file) => existsSync(file) && statSync(file).isFile())
  let linkCount = 0
  for (const file of documents) {
    for (const { destination, line } of markdownLinks(readFileSync(file, 'utf8'))) {
      const failure = inspectLocalLink(canonicalRoot, file, destination)
      linkCount += 1
      if (failure) errors.push(`${path.relative(canonicalRoot, file).split(path.sep).join('/')}:${line}: ${failure} → ${destination}`)
    }
  }

  let gitChecked = false
  if (!skipGit) {
    try {
      const ignored = execFileSync('git', ['-C', canonicalRoot, 'check-ignore', '--no-index', '--stdin'], {
        input: `${requiredDocuments.join('\n')}\n`, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'],
      }).trim()
      gitChecked = true
      if (ignored) for (const file of ignored.split(/\r?\n/)) errors.push(`${file}: 必需文档被 Git 忽略`)
    } catch (error) {
      if (error.status === 1) gitChecked = true // check-ignore: no matching ignore rules.
      else if (error.code === 'ENOENT') errors.push('无法执行 Git：请安装 Git 后重新运行（--skip-git 仅用于离线 fixture 检查）')
      else errors.push(`Git 忽略规则检查失败：${String(error.stderr || error.message).trim()}`)
    }
  }
  return { errors, documentCount: documents.length, linkCount, gitChecked }
}

function main() {
  const options = { root: process.cwd(), skipGit: false }
  for (let index = 2; index < process.argv.length; index += 1) {
    const argument = process.argv[index]
    if (argument === '--skip-git') options.skipGit = true
    else if (argument === '--root' && process.argv[index + 1] && !process.argv[index + 1].startsWith('--')) options.root = process.argv[++index]
    else {
      console.error(`未知或不完整参数：${argument}\n用法：node scripts/check-docs.mjs [--root <目录>] [--skip-git]`)
      process.exitCode = 1
      return
    }
  }
  const result = checkDocs(options)
  if (result.errors.length) {
    console.error(`文档检查失败（${result.errors.length} 项）：`)
    for (const error of result.errors) console.error(`- ${error}`)
    process.exitCode = 1
  } else console.log(`文档检查通过：${result.documentCount} 份文档，${result.linkCount} 个 Markdown 链接；${result.gitChecked ? '必需文档未被 Git 忽略（不代表已提交）' : '已跳过 Git 检查'}。`)
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main()
