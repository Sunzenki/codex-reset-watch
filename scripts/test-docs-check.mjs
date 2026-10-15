import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import { checkDocs, requiredDocuments } from './check-docs.mjs'

function fixture(run) {
  const temporaryRoot = path.resolve(os.tmpdir())
  const root = mkdtempSync(path.join(temporaryRoot, 'crw-docs-check-'))
  try {
    for (const relative of requiredDocuments) {
      const file = path.join(root, relative)
      mkdirSync(path.dirname(file), { recursive: true })
      writeFileSync(file, '# Fixture\n')
    }
    run(root)
  } finally {
    const verified = path.resolve(root)
    assert.equal(path.dirname(verified), temporaryRoot)
    assert.ok(path.basename(verified).startsWith('crw-docs-check-'))
    rmSync(verified, { recursive: true, force: true })
  }
}

test('valid relative destinations, spaces, images, nested paths and reference definitions', () => fixture((root) => {
  writeFileSync(path.join(root, 'with space.md'), '# With space')
  writeFileSync(path.join(root, 'image(1).svg'), '<svg/>')
  writeFileSync(path.join(root, 'README.md'), '[guide](./PROJECT-MAINTENANCE-GUIDE.md#workflow)\n[space](<with space.md>)\n![image](image(1).svg)\n[ref][design]\n[design]: DESIGN.md "Design"\n')
  writeFileSync(path.join(root, 'docs/content-and-data.md'), '[home](../README.md)\n')
  assert.deepEqual(checkDocs({ root, skipGit: true }).errors, [])
}))

test('broken destinations and missing required files fail with useful source lines', () => fixture((root) => {
  writeFileSync(path.join(root, 'README.md'), '# Title\n[missing](docs/missing.md)\n')
  rmSync(path.join(root, 'AGENTS.md'))
  const result = checkDocs({ root, skipGit: true })
  assert.ok(result.errors.some((error) => error.includes('README.md:2: 链接目标不存在')))
  assert.ok(result.errors.some((error) => error.includes('AGENTS.md: 必需文档缺失')))
}))

test('external links, anchors and code examples are skipped without network access', () => fixture((root) => {
  writeFileSync(path.join(root, 'README.md'), [
    '[web](https://example.invalid/missing)', '[email](mailto:nobody@example.invalid)', '[anchor](#heading)',
    '```md', '[example](absent.md)', '```', '~~~md', '[example](also-absent.md)', '~~~',
    '    [example](indented-absent.md)', '`[example](inline-absent.md)`',
    '普通正文 C:/Users/example/screenshot.png，不是 Markdown 链接。',
  ].join('\n'))
  assert.deepEqual(checkDocs({ root, skipGit: true }).errors, [])
}))

test('absolute external and relative escaping local paths fail', () => fixture((root) => {
  writeFileSync(path.join(root, 'README.md'), '[local](C:/Users/example/screenshot.png)\n[escape](../outside.md)\n[uri](file:///C:/Users/example/screenshot.png)\n')
  const result = checkDocs({ root, skipGit: true })
  assert.equal(result.errors.length, 3)
  assert.ok(result.errors.every((error) => error.includes('项目外')))
}))

test('nested docs are checked and CLI supports fixture roots without Git', () => fixture((root) => {
  const nested = path.join(root, 'docs/history')
  mkdirSync(nested)
  writeFileSync(path.join(nested, 'record.md'), '[home](../../README.md)\n')
  const output = execFileSync(process.execPath, [fileURLToPath(new URL('./check-docs.mjs', import.meta.url)), '--root', root, '--skip-git'], { encoding: 'utf8' })
  assert.match(output, /文档检查通过：9 份文档/)
  assert.match(output, /已跳过 Git 检查/)
}))

test('optional root Markdown files are checked without scanning unrelated directories', () => fixture((root) => {
  writeFileSync(path.join(root, 'design-qa.md'), '[missing evidence](missing-evidence.png)\n')
  mkdirSync(path.join(root, 'experiments'))
  writeFileSync(path.join(root, 'experiments/draft.md'), '[unrelated draft](also-missing.md)\n')
  const result = checkDocs({ root, skipGit: true })
  assert.equal(result.documentCount, 9)
  assert.equal(result.errors.length, 1)
  assert.match(result.errors[0], /^design-qa\.md:1: 链接目标不存在/)
}))

function initializeFixtureGit(root) {
  execFileSync('git', ['init', '--quiet', root], { stdio: 'pipe' })
  // Isolate fixtures from machine-wide ignore patterns without touching user config.
  const excludesFile = path.join(root, '.fixture-excludes')
  writeFileSync(excludesFile, '')
  execFileSync('git', ['-C', root, 'config', '--local', 'core.excludesFile', excludesFile], { stdio: 'pipe' })
}

test('required documents pass Git checks while still untracked', () => fixture((root) => {
  initializeFixtureGit(root)
  const result = checkDocs({ root })
  assert.equal(result.gitChecked, true)
  assert.deepEqual(result.errors, [])
  assert.equal(execFileSync('git', ['-C', root, 'ls-files'], { encoding: 'utf8' }), '')
}))

test('Git ignore rules report ignored required documents', () => fixture((root) => {
  initializeFixtureGit(root)
  writeFileSync(path.join(root, '.gitignore'), '/AGENTS.md\n')
  const result = checkDocs({ root })
  assert.equal(result.gitChecked, true)
  assert.deepEqual(result.errors, ['AGENTS.md: 必需文档被 Git 忽略'])
}))
