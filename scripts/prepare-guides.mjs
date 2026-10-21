import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, compileGuides } from './guides-content.mjs';

const manifest = compileGuides({ includePreview: process.argv.includes('--preview') });
mkdirSync(join(ROOT, 'src/generated'), { recursive: true });
writeFileSync(join(ROOT, 'src/generated/guides.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`资讯内容校验通过：${manifest.articles.length} 篇${manifest.previewMode ? '（本地预览稿，noindex）' : '正式文章（预览与草稿已排除）'}`);
