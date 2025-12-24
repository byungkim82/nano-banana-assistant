// ===== RENDER EDIT SESSION =====

import { state } from '../state.js';
import { QUICK_PRESETS } from '../config.js';

// 편집 세션 렌더링
export function renderEditSession() {
  const sessionEl = document.getElementById('editSession');
  const historyEl = document.getElementById('editHistory');

  if (!sessionEl) return;

  if (state.editSession.editHistory.length === 0) {
    sessionEl.classList.add('hidden');
    return;
  }

  sessionEl.classList.remove('hidden');

  // 편집 히스토리 렌더링
  if (historyEl) {
    historyEl.innerHTML = state.editSession.editHistory.map((item, index) => `
      <div class="edit-history-item ${index === state.editSession.currentEditIndex ? 'active' : ''}"
           onclick="selectEditHistoryItem(${index})">
        <span class="step-number">${item.step}</span>
        <div class="step-content">
          <div class="step-label">단계 ${item.step}</div>
          <div class="step-text">${item.request}</div>
        </div>
        ${item.image ? `
          <div class="step-thumb">
            <img src="data:${item.image.mimeType};base64,${item.image.data}" alt="단계 ${item.step}">
          </div>
        ` : ''}
      </div>
    `).join('');
  }

  // 빠른 수정 프리셋 렌더링
  renderPresets();
}

// 빠른 수정 프리셋 렌더링
export function renderPresets() {
  const categoriesEl = document.getElementById('presetCategories');
  const itemsEl = document.getElementById('presetItems');

  if (!categoriesEl || !itemsEl) return;

  // 카테고리 버튼 렌더링
  categoriesEl.innerHTML = Object.values(QUICK_PRESETS).map(category => `
    <button class="preset-category-btn ${state.presetCategory === category.id ? 'active' : ''}"
            onclick="setPresetCategory('${category.id}')">
      ${category.name}
    </button>
  `).join('');

  // 현재 카테고리의 프리셋 아이템 렌더링
  const currentCategory = QUICK_PRESETS[state.presetCategory];
  if (currentCategory) {
    itemsEl.innerHTML = currentCategory.presets.map(preset => `
      <button class="preset-item" onclick="applyPreset('${preset.id}')">
        ${preset.label}
      </button>
    `).join('');
  }
}
