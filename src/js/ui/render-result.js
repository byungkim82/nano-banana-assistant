// ===== RENDER RESULT =====

import { state } from '../state.js';

// 결과 이미지 렌더링
export function renderResult() {
  const container = document.getElementById('resultContainer');
  const historyContainer = document.getElementById('resultHistory');

  if (!container) return;

  // 히스토리 렌더링
  if (historyContainer) {
    if (state.resultHistory.length > 0) {
      historyContainer.classList.remove('hidden');
      historyContainer.innerHTML = state.resultHistory.map((item, index) => `
        <div class="result-history-item ${state.selectedResultId === item.id ? 'selected' : ''}"
             onclick="selectResultHistory('${item.id}')"
             ondblclick="openImageModal(${index})">
          <img src="data:${item.image.mimeType};base64,${item.image.data}" alt="히스토리 ${index + 1}">
        </div>
      `).join('');
    } else {
      historyContainer.classList.add('hidden');
    }
  }

  if (state.isLoading) {
    container.innerHTML = `
      <div class="loading">
        <div class="loading-spinner"></div>
        <div class="loading-text">이미지 생성 중...</div>
      </div>
    `;
    return;
  }

  if (state.generatedImage) {
    container.innerHTML = `
      <img
        src="data:${state.generatedImage.mimeType};base64,${state.generatedImage.data}"
        alt="생성된 이미지"
        class="result-image"
        style="cursor: pointer;"
        onclick="openImageModal(${state.resultHistory.length - 1})"
      >
      <div class="result-actions">
        <button class="btn btn-primary" onclick="downloadImage()">
          💾 다운로드
        </button>
        <button class="btn btn-outline" onclick="openImageModal(${state.resultHistory.length - 1})">
          🔍 확대
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="result-placeholder">
      <div class="result-placeholder-icon">🎨</div>
      <div>프롬프트를 입력하고<br>이미지를 생성하세요</div>
    </div>
  `;
}
