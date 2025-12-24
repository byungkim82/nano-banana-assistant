// ===== EDIT HANDLERS =====

import { state } from '../state.js';
import { QUICK_PRESETS, THINKING_PREFIX } from '../config.js';
import { callImageApi } from '../api.js';
import { translateToEnglish, containsKorean } from '../translation.js';
import { renderEditSession, renderPresets } from '../ui/render-edit-session.js';
import { renderResult } from '../ui/render-result.js';
import { showError, hideError, generateSessionId, generateResultId } from '../utils.js';
import { applyThinkingPrefix, updateTranslateStatus } from './generation-handlers.js';

// 새 세션 시작
export function startNewSession() {
  state.editSession = {
    sessionId: generateSessionId(),
    basePrompt: '',
    editHistory: [],
    currentEditIndex: -1
  };

  const requestInput = document.getElementById('editRequestInput');
  if (requestInput) requestInput.value = '';

  renderEditSession();
}

// 편집 세션 초기화
export function initEditSession(prompt, image) {
  if (!state.editSession.sessionId) {
    state.editSession.sessionId = generateSessionId();
  }

  state.editSession.basePrompt = prompt;

  const historyItem = {
    id: 'edit_' + Date.now(),
    step: 1,
    request: '원본 생성',
    prompt: prompt,
    image: image,
    timestamp: new Date().toISOString()
  };

  state.editSession.editHistory = [historyItem];
  state.editSession.currentEditIndex = 0;

  renderEditSession();
}

// 편집 히스토리 추가
export function addEditHistory(request, prompt, image) {
  const step = state.editSession.editHistory.length + 1;

  const historyItem = {
    id: 'edit_' + Date.now(),
    step: step,
    request: request,
    prompt: prompt,
    image: image,
    timestamp: new Date().toISOString()
  };

  state.editSession.editHistory.push(historyItem);
  state.editSession.currentEditIndex = state.editSession.editHistory.length - 1;

  renderEditSession();
}

// 편집 히스토리 항목 선택
export function selectEditHistoryItem(index) {
  if (index >= 0 && index < state.editSession.editHistory.length) {
    state.editSession.currentEditIndex = index;

    const item = state.editSession.editHistory[index];
    state.generatedImage = item.image;

    renderEditSession();
    renderResult();
  }
}

// 편집 요청 입력 클리어
export function clearEditRequest() {
  const requestInput = document.getElementById('editRequestInput');
  if (requestInput) requestInput.value = '';
}

// 편집 요청 적용
export async function applyEditRequest() {
  const requestInput = document.getElementById('editRequestInput');
  const editRequest = requestInput ? requestInput.value.trim() : '';

  if (!editRequest) {
    showError('수정 요청을 입력해주세요.');
    return;
  }

  if (!state.apiKey) {
    showError('API 키를 먼저 설정해주세요.');
    window.openSettingsModal();
    return;
  }

  if (state.editSession.editHistory.length === 0) {
    showError('먼저 이미지를 생성해주세요.');
    return;
  }

  // 현재 편집 단계의 이미지와 프롬프트 가져오기
  const currentItem = state.editSession.editHistory[state.editSession.currentEditIndex];

  // 수정 프롬프트 생성
  const editPrompt = `Based on the previous image, please modify it according to this request: ${editRequest}

Previous prompt for context: ${currentItem.prompt}`;

  // 로딩 시작
  state.isLoading = true;
  state.error = null;
  hideError();
  renderResult();

  const applyBtn = document.getElementById('applyEditBtn');
  if (applyBtn) applyBtn.disabled = true;

  try {
    // Thinking 모드 적용
    let finalPrompt = applyThinkingPrefix(editPrompt);

    // 번역 적용
    if (state.autoTranslate && containsKorean(finalPrompt)) {
      updateTranslateStatus('translating', '번역 중...');
      try {
        const translated = await translateToEnglish(finalPrompt, state.apiKey);
        finalPrompt = translated;
        updateTranslateStatus('translated', '번역 완료');
      } catch (e) {
        console.error('Translation failed, using original:', e);
        updateTranslateStatus('error', '번역 실패, 원본 사용');
      }
    }

    // 이전 이미지를 첨부하여 API 호출
    const attachments = [{
      base64: currentItem.image.data
    }];

    const image = await callImageApi(finalPrompt, state.apiKey, attachments);
    state.generatedImage = image;

    // 편집 히스토리에 추가
    addEditHistory(editRequest, finalPrompt, image);

    // 결과 히스토리에도 추가
    const historyItem = {
      id: generateResultId(),
      prompt: finalPrompt,
      translatedPrompt: '',
      image: image,
      timestamp: new Date().toISOString()
    };
    state.resultHistory.push(historyItem);
    state.selectedResultId = historyItem.id;

    // 입력 필드 초기화
    if (requestInput) requestInput.value = '';

  } catch (e) {
    showError(e.message);
  } finally {
    state.isLoading = false;
    renderResult();
    if (applyBtn) applyBtn.disabled = false;
  }
}

// 프리셋 카테고리 설정
export function setPresetCategory(categoryId) {
  state.presetCategory = categoryId;
  renderPresets();
}

// 프리셋 적용
export async function applyPreset(presetId) {
  const category = QUICK_PRESETS[state.presetCategory];
  if (!category) return;

  const preset = category.presets.find(p => p.id === presetId);
  if (!preset) return;

  // 프리셋 프롬프트를 편집 요청으로 적용
  const requestInput = document.getElementById('editRequestInput');
  if (requestInput) {
    requestInput.value = preset.prompt;
  }

  // 자동으로 적용
  await applyEditRequest();
}

// Thinking 모드 토글
export function toggleThinkingMode() {
  state.thinkingMode = !state.thinkingMode;

  const toggle = document.getElementById('thinkingToggle');
  const checkbox = document.getElementById('thinkingCheckbox');

  if (state.thinkingMode) {
    if (toggle) toggle.classList.add('active');
    if (checkbox) checkbox.checked = true;
  } else {
    if (toggle) toggle.classList.remove('active');
    if (checkbox) checkbox.checked = false;
  }

  // LocalStorage에 저장
  try {
    localStorage.setItem('nano_banana_thinking_mode', state.thinkingMode ? 'true' : 'false');
  } catch (e) {
    console.error('Failed to save thinking mode:', e);
  }
}

// Thinking 모드 로드
export function loadThinkingMode() {
  try {
    const saved = localStorage.getItem('nano_banana_thinking_mode');
    if (saved === 'true') {
      state.thinkingMode = true;
      const toggle = document.getElementById('thinkingToggle');
      const checkbox = document.getElementById('thinkingCheckbox');
      if (toggle) toggle.classList.add('active');
      if (checkbox) checkbox.checked = true;
    }
  } catch (e) {
    console.error('Failed to load thinking mode:', e);
  }
}
