// ===== GENERATION HANDLERS =====

import { state } from '../state.js';
import { callImageApi } from '../api.js';
import { translateToEnglish, containsKorean } from '../translation.js';
import { buildPrompt, updatePromptPreview } from '../prompt-builder.js';
import { renderResult } from '../ui/render-result.js';
import { showError, hideError, generateResultId } from '../utils.js';
import { THINKING_PREFIX } from '../config.js';
import { addToResultHistory } from '../storage.js';

// Thinking 프리픽스 적용
export function applyThinkingPrefix(prompt) {
  if (state.thinkingMode) {
    return THINKING_PREFIX + prompt;
  }
  return prompt;
}

// 번역 상태 업데이트
export function updateTranslateStatus(status, message) {
  const statusEl = document.getElementById('translateStatus');
  const textEl = document.getElementById('translateStatusText');

  if (!statusEl || !textEl) return;

  if (status === 'hidden') {
    statusEl.classList.add('hidden');
    return;
  }

  statusEl.classList.remove('hidden');
  statusEl.className = 'translate-status ' + status;
  textEl.textContent = message;
}

// 이미지 생성
export async function generateImage() {
  // API 키 확인
  if (!state.apiKey) {
    showError('API 키를 먼저 설정해주세요.');
    window.openSettingsModal();
    return;
  }

  // 프롬프트 생성
  let prompt = buildPrompt(state.currentTemplate, state.fieldValues[state.currentTemplate]);
  if (!prompt || prompt.length < 10) {
    showError('프롬프트가 너무 짧습니다. 더 많은 필드를 입력해주세요.');
    return;
  }

  // 로딩 시작
  state.isLoading = true;
  state.error = null;
  hideError();
  renderResult();

  const generateBtn = document.getElementById('generateBtn');
  if (generateBtn) generateBtn.disabled = true;

  try {
    // 자동 번역이 활성화된 경우
    let finalPrompt = prompt;
    let translatedPrompt = '';

    if (state.autoTranslate && containsKorean(prompt)) {
      updateTranslateStatus('translating', '번역 중...');
      try {
        translatedPrompt = await translateToEnglish(prompt, state.apiKey);
        finalPrompt = translatedPrompt;
        state.translatedPrompt = translatedPrompt;
        updateTranslateStatus('translated', '번역 완료');
        updatePromptPreview();
      } catch (e) {
        console.error('Translation failed, using original:', e);
        updateTranslateStatus('error', '번역 실패, 원본 사용');
      }
    }

    // Thinking 모드 적용
    finalPrompt = applyThinkingPrefix(finalPrompt);

    // 이미지 생성 API 호출 (첨부 이미지 포함)
    const image = await callImageApi(finalPrompt, state.apiKey, state.attachedImages);
    state.generatedImage = image;

    // 히스토리에 추가 (LocalStorage에도 저장)
    const historyItem = {
      id: generateResultId(),
      prompt: prompt,
      translatedPrompt: translatedPrompt,
      image: image,
      timestamp: new Date().toISOString()
    };
    addToResultHistory(historyItem);
    state.selectedResultId = historyItem.id;

    // 편집 세션 초기화 (새 이미지 생성 시 새 세션 시작)
    if (window.initEditSession) {
      window.initEditSession(finalPrompt, image);
    }

    // 프롬프트 히스토리에 저장
    if (window.savePromptToHistory) {
      window.savePromptToHistory(prompt, translatedPrompt, state.currentTemplate);
    }

  } catch (e) {
    showError(e.message);
  } finally {
    state.isLoading = false;
    renderResult();
    if (generateBtn) generateBtn.disabled = false;
  }
}

// 프롬프트 복사
export function copyPrompt() {
  let textToCopy;
  if (state.promptTab === 'translated' && state.translatedPrompt) {
    textToCopy = state.translatedPrompt;
  } else {
    textToCopy = buildPrompt(state.currentTemplate, state.fieldValues[state.currentTemplate]);
  }

  if (!textToCopy) {
    showError('복사할 프롬프트가 없습니다.');
    return;
  }

  navigator.clipboard.writeText(textToCopy).then(() => {
    // 복사 성공 피드백
    const btn = document.querySelector('.prompt-preview-header .btn-icon');
    if (btn) {
      const originalText = btn.textContent;
      btn.textContent = '✅';
      setTimeout(() => {
        btn.textContent = originalText;
      }, 1500);
    }
  }).catch(e => {
    showError('클립보드 복사에 실패했습니다.');
  });
}

// 번역 토글 핸들러
export function handleTranslateToggle(checked) {
  state.autoTranslate = checked;
  state.translatedPrompt = '';

  // 번역 탭 표시/숨김
  const promptTabs = document.getElementById('promptTabs');
  if (promptTabs) {
    if (checked) {
      promptTabs.style.display = 'flex';
    } else {
      promptTabs.style.display = 'none';
      state.promptTab = 'original';
      updateTranslateStatus('hidden', '');
    }
  }

  updatePromptPreview();
}

// 프롬프트 탭 설정
export function setPromptTab(tab) {
  state.promptTab = tab;

  document.querySelectorAll('.prompt-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });

  updatePromptPreview();
}
