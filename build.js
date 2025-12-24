#!/usr/bin/env node
/**
 * 나노 바나나 어시스턴트 빌드 스크립트
 * 순수 Node.js - 외부 의존성 없음
 *
 * 사용법: node build.js
 */

const fs = require('fs');
const path = require('path');

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

// ===== JS 모듈 처리 =====

/**
 * import 문을 파싱하여 의존 파일 경로 추출
 */
function parseImports(filePath, content) {
  const imports = [];
  // import ... from '...'
  const importRegex = /import\s+(?:(?:\*\s+as\s+\w+)|(?:\{[^}]*\})|(?:\w+))\s+from\s+['"]([^'"]+)['"]/g;
  let match;

  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    if (importPath.startsWith('.')) {
      let absolutePath = path.resolve(path.dirname(filePath), importPath);
      if (!absolutePath.endsWith('.js')) {
        absolutePath += '.js';
      }
      imports.push(absolutePath);
    }
  }

  return imports;
}

/**
 * 의존성 그래프 구축
 */
function buildDependencyGraph(entryFile) {
  const graph = new Map();
  const visited = new Set();

  function visit(filePath) {
    if (visited.has(filePath)) return;
    if (!fs.existsSync(filePath)) {
      console.warn(`  Warning: JS file not found: ${filePath}`);
      return;
    }
    visited.add(filePath);

    const content = fs.readFileSync(filePath, 'utf8');
    const imports = parseImports(filePath, content);
    graph.set(filePath, { content, imports });

    for (const importPath of imports) {
      visit(importPath);
    }
  }

  visit(entryFile);
  return graph;
}

/**
 * 토폴로지 정렬 (의존성 순서대로 정렬)
 */
function topologicalSort(graph) {
  const sorted = [];
  const visited = new Set();
  const temp = new Set();

  function visit(file) {
    if (temp.has(file)) {
      console.error(`Circular dependency detected: ${file}`);
      return;
    }
    if (visited.has(file)) return;

    temp.add(file);
    const node = graph.get(file);
    if (node) {
      for (const dep of node.imports) {
        visit(dep);
      }
    }
    temp.delete(file);
    visited.add(file);
    sorted.push(file);
  }

  for (const file of graph.keys()) {
    visit(file);
  }

  return sorted;
}

/**
 * ES Module 코드를 IIFE 호환 코드로 변환
 */
function transformModule(filePath, content) {
  let transformed = content;

  // import 문 제거
  transformed = transformed.replace(
    /import\s+(?:(?:\*\s+as\s+\w+)|(?:\{[^}]*\})|(?:\w+))\s+from\s+['"][^'"]+['"];?\n?/g,
    ''
  );

  // export const/let/var 변환
  transformed = transformed.replace(
    /export\s+(const|let|var)\s+/g,
    '$1 '
  );

  // export function 변환
  transformed = transformed.replace(
    /export\s+(async\s+)?function\s+/g,
    '$1function '
  );

  // export class 변환
  transformed = transformed.replace(
    /export\s+class\s+/g,
    'class '
  );

  // export { ... } 제거
  transformed = transformed.replace(
    /export\s+\{[^}]*\};?\n?/g,
    ''
  );

  // export default 변환
  transformed = transformed.replace(
    /export\s+default\s+/g,
    ''
  );

  const fileName = path.basename(filePath);
  return `// ===== ${fileName} =====\n${transformed}`;
}

/**
 * JS 모듈 수집 및 번들링
 */
function collectJS() {
  const entryFile = path.join(SRC_DIR, 'js', 'main.js');

  if (!fs.existsSync(entryFile)) {
    console.warn('  Warning: main.js not found, skipping JS bundling');
    return '';
  }

  // 의존성 그래프 구축
  const graph = buildDependencyGraph(entryFile);
  console.log(`  Found ${graph.size} JS modules`);

  // 토폴로지 정렬
  const sortedFiles = topologicalSort(graph);
  console.log('  Dependencies resolved');

  // 모듈 변환 및 병합
  const jsModules = sortedFiles.map(file => {
    const { content } = graph.get(file);
    return transformModule(file, content);
  });

  return jsModules.join('\n\n');
}

// ===== HTML 처리 =====

/**
 * 개발용 HTML에서 body 내용 추출
 */
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
function build() {
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

  // JS 수집
  console.log('📦 Collecting JS...');
  const js = collectJS();
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
(function() {
  'use strict';

${js}

})();
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
  build();
} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  process.exit(1);
}
