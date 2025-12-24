// ===== PROMPT BUILDER =====

import { TEMPLATES } from './templates.js';
import { state } from './state.js';
import { debounce } from './utils.js';

// 프롬프트 빌드
export function buildPrompt(templateId, values) {
  const template = TEMPLATES[templateId] || state.customTemplates[templateId];
  if (!template) return '';

  let prompt = template.promptTemplate;

  // 각 필드 값을 템플릿에 대입
  template.fields.forEach(field => {
    const value = values[field.id];
    let replacement = '';

    if (field.type === 'checkbox-group' && Array.isArray(value)) {
      replacement = value.join(', ');
    } else if (field.type === 'checkbox') {
      replacement = value ? 'yes' : '';
    } else {
      replacement = value || '';
    }

    // 액션과 위치 필드는 앞에 공백이나 접속사 추가
    if (field.id === 'action' && replacement) {
      replacement = ', ' + replacement;
    }
    if (field.id === 'location' && replacement) {
      replacement = ' in ' + replacement;
    }

    prompt = prompt.replace(new RegExp(`\\{${field.id}\\}`, 'g'), replacement);
  });

  // 빈 자리표시자와 불필요한 문장부호 정리
  prompt = prompt
    .replace(/\{[^}]+\}/g, '') // 남은 자리표시자 제거
    .replace(/\s+/g, ' ') // 다중 공백 제거
    .replace(/\s*,\s*,/g, ',') // 중복 쉼표 제거
    .replace(/,\s*\./g, '.') // 쉼표 후 마침표 정리
    .replace(/\.\s*\./g, '.') // 중복 마침표 제거
    .replace(/\s+\./g, '.') // 마침표 전 공백 제거
    .replace(/^\s*,\s*/g, '') // 시작 쉼표 제거
    .replace(/,\s*$/g, '') // 끝 쉼표 제거
    .trim();

  return prompt;
}

// 프롬프트 미리보기 업데이트 (내부 함수)
function _updatePromptPreview() {
  const prompt = buildPrompt(state.currentTemplate, state.fieldValues[state.currentTemplate]);
  const previewEl = document.getElementById('promptPreview');

  if (!previewEl) return;

  if (prompt && prompt.length > 10) {
    previewEl.textContent = prompt;
    previewEl.classList.remove('empty');
  } else {
    previewEl.textContent = '필드를 입력하면 프롬프트가 생성됩니다.';
    previewEl.classList.add('empty');
  }
}

// 디바운싱된 프롬프트 미리보기 업데이트 (300ms)
export const updatePromptPreview = debounce(_updatePromptPreview, 300);

// 즉시 업데이트가 필요한 경우 (템플릿 전환 등)
export function updatePromptPreviewImmediate() {
  _updatePromptPreview();
}

// 프롬프트 복사
export async function copyPromptToClipboard() {
  const prompt = buildPrompt(state.currentTemplate, state.fieldValues[state.currentTemplate]);
  if (!prompt) return false;

  try {
    await navigator.clipboard.writeText(prompt);
    return true;
  } catch (e) {
    console.error('Failed to copy prompt:', e);
    return false;
  }
}

// 현재 프롬프트 가져오기
export function getCurrentPrompt() {
  return buildPrompt(state.currentTemplate, state.fieldValues[state.currentTemplate]);
}
