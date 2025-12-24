#!/usr/bin/env node
/**
 * 나노 바나나 어시스턴트 빌드 스크립트
 * esbuild 기반 - AST 파싱으로 안정적인 번들링
 *
 * 사용법: node build.mjs
 */

import * as esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 경로 설정
const ROOT_DIR = __dirname;
const SRC_DIR = path.join(ROOT_DIR, 'src');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const OUTPUT_FILE = path.join(DIST_DIR, 'nano-banana-assistant.html');
const DEV_HTML = path.join(ROOT_DIR, 'index.html');

// CSS 파일 순서 (의존성 순)
const CSS_FILES = [
  'variables.css',
  'reset.css',
  'layout.css',
  'components.css',
  'panels.css',
  'modals.css',
  'editing.css',
  'responsive.css',
  'utilities.css'
];

// ===== CSS 처리 =====
function collectCSS() {
  const cssDir = path.join(SRC_DIR, 'css');
  const cssContents = [];

  for (const file of CSS_FILES) {
    const filePath = path.join(cssDir, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      cssContents.push(`/* ===== ${file} ===== */\n${content}`);
    } else {
      console.warn(`  Warning: CSS file not found: ${file}`);
    }
  }

  return cssContents.join('\n\n');
}

// ===== HTML 처리 =====
function extractHTMLBody() {
  const htmlContent = fs.readFileSync(DEV_HTML, 'utf8');

  // <body> 태그 내용 추출 (script 태그 제외)
  const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (!bodyMatch) {
    throw new Error('Could not extract body from index.html');
  }

  let bodyContent = bodyMatch[1];

  // <script type="module" ...> 태그 제거
  bodyContent = bodyContent.replace(
    /<script[^>]*type\s*=\s*["']module["'][^>]*>[\s\S]*?<\/script>/gi,
    ''
  );

  return bodyContent.trim();
}

// ===== 빌드 실행 =====
async function build() {
  console.log('🍌 Building nano-banana-assistant...\n');

  const startTime = Date.now();

  // dist 디렉토리 생성
  if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR, { recursive: true });
  }

  // CSS 수집
  console.log('📦 Collecting CSS...');
  const css = collectCSS();
  console.log('  CSS collected\n');

  // JS 번들링 (esbuild)
  console.log('📦 Bundling JS with esbuild...');
  const entryFile = path.join(SRC_DIR, 'js', 'main.js');

  const result = await esbuild.build({
    entryPoints: [entryFile],
    bundle: true,
    format: 'iife',
    write: false,
    minify: false,
    sourcemap: false,
    target: ['es2020'],
    logLevel: 'warning',
  });

  const js = result.outputFiles[0].text;
  console.log('  JS bundled\n');

  // HTML 생성
  console.log('📦 Generating HTML...');
  const bodyContent = extractHTMLBody();

  const finalHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>나노 바나나 프롬프트 어시스턴트</title>
  <style>
${css}
  </style>
</head>
<body>
${bodyContent}

  <script>
// ===== 나노 바나나 프롬프트 어시스턴트 =====
// 빌드: ${new Date().toISOString()}
${js}
  </script>
</body>
</html>`;

  // 파일 출력
  fs.writeFileSync(OUTPUT_FILE, finalHtml, 'utf8');

  const endTime = Date.now();
  const stats = fs.statSync(OUTPUT_FILE);
  const sizeKB = (stats.size / 1024).toFixed(1);

  console.log('  HTML generated\n');
  console.log('✅ Build complete!');
  console.log(`   Output: ${OUTPUT_FILE}`);
  console.log(`   Size: ${sizeKB} KB`);
  console.log(`   Time: ${endTime - startTime}ms`);
}

// 실행
try {
  await build();
} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  process.exit(1);
}
