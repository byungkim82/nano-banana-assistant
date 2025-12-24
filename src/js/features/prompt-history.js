// ===== PROMPT HISTORY =====

import { STORAGE_KEYS } from '../config.js';
import { TEMPLATES } from '../templates.js';
import { state } from '../state.js';
import { showError, hideError, escapeHtml, formatRelativeTime } from '../utils.js';
import { handleTemplateChange } from '../handlers/template-handlers.js';

const MAX_PROMPT_HISTORY = 100;

// 프롬프트 히스토리에 저장
export function savePromptToHistory(prompt, translatedPrompt, templateId) {
  const historyItem = {
    id: 'ph_' + Date.now(),
    prompt: prompt,
    translatedPrompt: translatedPrompt || '',
    templateId: templateId,
    timestamp: new Date().toISOString()
  };

  // 중복 제거 (같은 프롬프트가 있으면 기존 것 삭제)
  state.promptHistory = state.promptHistory.filter(h => h.prompt !== prompt);

  // 맨 앞에 추가
  state.promptHistory.unshift(historyItem);

  // 최대 개수 제한
  if (state.promptHistory.length > MAX_PROMPT_HISTORY) {
    state.promptHistory = state.promptHistory.slice(0, MAX_PROMPT_HISTORY);
  }

  savePromptHistory();
}

// 프롬프트 히스토리 저장
export function savePromptHistory() {
  try {
    localStorage.setItem(STORAGE_KEYS.PROMPT_HISTORY, JSON.stringify(state.promptHistory));
  } catch (e) {
    console.error('Failed to save prompt history:', e);
    // 용량 초과 시 오래된 항목 삭제
    if (e.name === 'QuotaExceededError') {
      state.promptHistory = state.promptHistory.slice(0, 50);
      savePromptHistory();
    }
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

// 프롬프트 히스토리 모달 열기
export function openPromptHistory() {
  const modal = document.getElementById('promptHistoryModal');
  state.promptHistorySearch = '';
  renderPromptHistory();
  if (modal) modal.classList.add('active');
}

// 프롬프트 히스토리 모달 닫기
export function closePromptHistory() {
  const modal = document.getElementById('promptHistoryModal');
  if (modal) modal.classList.remove('active');
}

// 프롬프트 히스토리 렌더링
export function renderPromptHistory() {
  const container = document.getElementById('promptHistoryList');
  const searchInput = document.getElementById('promptHistorySearch');

  if (!container) return;

  if (searchInput) {
    searchInput.value = state.promptHistorySearch;
  }

  let filteredHistory = state.promptHistory;

  // 검색 필터링
  if (state.promptHistorySearch) {
    const searchLower = state.promptHistorySearch.toLowerCase();
    filteredHistory = state.promptHistory.filter(h =>
      h.prompt.toLowerCase().includes(searchLower) ||
      (h.translatedPrompt && h.translatedPrompt.toLowerCase().includes(searchLower))
    );
  }

  if (filteredHistory.length === 0) {
    container.innerHTML = `
      <div class="empty-history">
        ${state.promptHistory.length === 0 ?
          '저장된 프롬프트가 없습니다.' :
          '검색 결과가 없습니다.'}
      </div>
    `;
    return;
  }

  container.innerHTML = filteredHistory.map(item => `
    <div class="history-item">
      <div class="history-item-content">
        <div class="history-prompt">${escapeHtml(item.prompt.substring(0, 150))}${item.prompt.length > 150 ? '...' : ''}</div>
        ${item.translatedPrompt ? `
          <div class="history-translated">🌐 ${escapeHtml(item.translatedPrompt.substring(0, 100))}...</div>
        ` : ''}
        <div class="history-meta">
          <span class="history-template">${getTemplateName(item.templateId)}</span>
          <span class="history-time">${formatRelativeTime(item.timestamp)}</span>
        </div>
      </div>
      <div class="history-item-actions">
        <button class="btn btn-outline btn-sm" onclick="restorePromptFromHistory('${item.id}')" title="복원">
          ↩️
        </button>
        <button class="btn btn-outline btn-sm" onclick="copyPromptFromHistory('${item.id}')" title="복사">
          📋
        </button>
        <button class="btn btn-outline btn-sm" onclick="deletePromptFromHistory('${item.id}')" title="삭제">
          🗑️
        </button>
      </div>
    </div>
  `).join('');
}

// 프롬프트 히스토리 검색
export function searchPromptHistory(query) {
  state.promptHistorySearch = query;
  renderPromptHistory();
}

// 히스토리에서 프롬프트 복원
export function restorePromptFromHistory(historyId) {
  const item = state.promptHistory.find(h => h.id === historyId);
  if (!item) return;

  // 해당 템플릿으로 전환
  if (item.templateId && (TEMPLATES[item.templateId] || state.customTemplates[item.templateId])) {
    handleTemplateChange(item.templateId);
  }

  // 프롬프트를 클립보드에 복사
  navigator.clipboard.writeText(item.prompt).then(() => {
    closePromptHistory();
    showError('프롬프트가 클립보드에 복사되었습니다. 필드에 붙여넣기 하세요.');
    setTimeout(hideError, 3000);
  });
}

// 히스토리에서 프롬프트 복사
export function copyPromptFromHistory(historyId) {
  const item = state.promptHistory.find(h => h.id === historyId);
  if (!item) return;

  navigator.clipboard.writeText(item.prompt).then(() => {
    showError('프롬프트가 복사되었습니다.');
    setTimeout(hideError, 2000);
  });
}

// 히스토리에서 프롬프트 삭제
export function deletePromptFromHistory(historyId) {
  state.promptHistory = state.promptHistory.filter(h => h.id !== historyId);
  savePromptHistory();
  renderPromptHistory();
}

// 모든 프롬프트 히스토리 삭제
export function clearAllPromptHistory() {
  if (!confirm('모든 프롬프트 히스토리를 삭제하시겠습니까?')) return;

  state.promptHistory = [];
  savePromptHistory();
  renderPromptHistory();
}

// 템플릿 이름 가져오기
function getTemplateName(templateId) {
  if (TEMPLATES[templateId]) return TEMPLATES[templateId].name;
  if (state.customTemplates[templateId]) return state.customTemplates[templateId].name;
  return '알 수 없음';
}
