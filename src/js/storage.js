// ===== STORAGE =====

import { STORAGE_KEYS } from './config.js';
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

// 프롬프트 히스토리 저장
export function savePromptHistory() {
  try {
    localStorage.setItem(STORAGE_KEYS.PROMPT_HISTORY, JSON.stringify(state.promptHistory));
  } catch (e) {
    console.error('Failed to save prompt history:', e);
  }
}

// 프롬프트 히스토리 로드
export function loadPromptHistory() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.PROMPT_HISTORY);
    if (saved) {
      state.promptHistory = JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load prompt history:', e);
    state.promptHistory = [];
  }
}

// 커스텀 템플릿 저장
export function saveCustomTemplates() {
  try {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_TEMPLATES, JSON.stringify(state.customTemplates));
  } catch (e) {
    console.error('Failed to save custom templates:', e);
  }
}

// 커스텀 템플릿 로드
export function loadCustomTemplates() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_TEMPLATES);
    if (saved) {
      state.customTemplates = JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load custom templates:', e);
    state.customTemplates = {};
  }
}

// 설정 저장
export function saveSettings() {
  try {
    const settings = {
      workMode: state.workMode,
      autoTranslate: state.autoTranslate,
      thinkingMode: state.thinkingMode
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
    }
  } catch (e) {
    console.error('Failed to load settings:', e);
  }
}
