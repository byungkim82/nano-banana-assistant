// ===== STORAGE =====

import { STORAGE_KEYS, IMAGE_MODELS } from './config.js';
import { state } from './state.js';

export function loadFromStorage() {
  try {
    const savedApiKey = localStorage.getItem(STORAGE_KEYS.API_KEY);
    if (savedApiKey) {
      state.apiKey = savedApiKey;
      const apiKeyInput = document.getElementById('apiKeyInput');
      if (apiKeyInput) {
        apiKeyInput.value = savedApiKey;
      }
      return savedApiKey; // API 키를 반환하여 테스트 가능하게 함
    }
  } catch (e) {
    console.error('Failed to load from storage:', e);
  }
  return null;
}

export function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEYS.API_KEY, state.apiKey);
  } catch (e) {
    console.error('Failed to save to storage:', e);
  }
}

// 설정 저장
export function saveSettings() {
  try {
    const settings = {
      workMode: state.workMode,
      autoTranslate: state.autoTranslate,
      thinkingMode: state.thinkingMode,
      selectedModel: state.selectedModel
    };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

// 설정 로드
export function loadSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (saved) {
      const settings = JSON.parse(saved);
      if (settings.workMode) state.workMode = settings.workMode;
      if (settings.autoTranslate !== undefined) state.autoTranslate = settings.autoTranslate;
      if (settings.thinkingMode !== undefined) state.thinkingMode = settings.thinkingMode;
      if (settings.selectedModel && IMAGE_MODELS[settings.selectedModel]) {
        state.selectedModel = settings.selectedModel;
      }
    }
  } catch (e) {
    console.error('Failed to load settings:', e);
  }
}

// ===== 결과 히스토리 저장 =====

const MAX_HISTORY_ITEMS = 20;
const MAX_STORAGE_SIZE = 4 * 1024 * 1024; // 4MB

// 결과 히스토리 저장
export function saveResultHistory() {
  try {
    // 최대 개수 제한
    const historyToSave = state.resultHistory.slice(0, MAX_HISTORY_ITEMS);

    // JSON 문자열 생성
    let jsonString = JSON.stringify(historyToSave);

    // 용량 초과 시 오래된 항목부터 삭제
    while (jsonString.length > MAX_STORAGE_SIZE && historyToSave.length > 0) {
      historyToSave.pop(); // 가장 오래된 항목 삭제
      jsonString = JSON.stringify(historyToSave);
    }

    localStorage.setItem(STORAGE_KEYS.RESULT_HISTORY, jsonString);
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      // 용량 초과 시 히스토리를 절반으로 줄이고 다시 시도
      console.warn('Storage quota exceeded, reducing history size...');
      state.resultHistory = state.resultHistory.slice(0, Math.floor(state.resultHistory.length / 2));
      saveResultHistory();
    } else {
      console.error('Failed to save result history:', e);
    }
  }
}

// 결과 히스토리 로드
export function loadResultHistory() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.RESULT_HISTORY);
    if (saved) {
      state.resultHistory = JSON.parse(saved);

      // 첫 번째 항목을 현재 이미지로 설정
      if (state.resultHistory.length > 0) {
        state.selectedResultId = state.resultHistory[0].id;
        state.generatedImage = state.resultHistory[0].image;
      }
    }
  } catch (e) {
    console.error('Failed to load result history:', e);
    state.resultHistory = [];
  }
}

// 결과 히스토리에 추가
export function addToResultHistory(item) {
  // 맨 앞에 추가
  state.resultHistory.unshift(item);

  // 최대 개수 제한
  if (state.resultHistory.length > MAX_HISTORY_ITEMS) {
    state.resultHistory = state.resultHistory.slice(0, MAX_HISTORY_ITEMS);
  }

  // 저장
  saveResultHistory();
}

// 결과 히스토리 삭제
export function deleteFromResultHistory(itemId) {
  state.resultHistory = state.resultHistory.filter(item => item.id !== itemId);
  saveResultHistory();
}

// 결과 히스토리 전체 삭제
export function clearResultHistory() {
  state.resultHistory = [];
  state.generatedImage = null;
  state.selectedResultId = null;
  localStorage.removeItem(STORAGE_KEYS.RESULT_HISTORY);
}

// ===== 일반 LocalStorage 헬퍼 =====

// 일반 저장
export function saveToLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to save ${key}:`, e);
  }
}

// 일반 로드
export function loadFromLocalStorage(key) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    console.error(`Failed to load ${key}:`, e);
    return null;
  }
}
