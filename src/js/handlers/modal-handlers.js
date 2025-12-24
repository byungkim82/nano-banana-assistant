// ===== MODAL HANDLERS =====

import { state } from '../state.js';
import { testApiKey } from '../api.js';
import { saveToStorage, saveSettings } from '../storage.js';
import { showError, hideError } from '../utils.js';
import { IMAGE_MODELS } from '../config.js';
import { updateWorkModeDisplay } from './image-handlers.js';

// 설정 모달 열기
export function openSettingsModal() {
  const modal = document.getElementById('settingsModal');
  const apiKeyInput = document.getElementById('apiKeyInput');
  const modelSelect = document.getElementById('modelSelect');

  if (modal) modal.classList.add('active');
  if (apiKeyInput) apiKeyInput.value = state.apiKey;
  if (modelSelect) modelSelect.value = state.selectedModel;
}

// 설정 모달 닫기
export function closeSettingsModal() {
  const modal = document.getElementById('settingsModal');
  if (modal) modal.classList.remove('active');
}

// API 키 표시/숨김 토글
export function toggleApiKeyVisibility() {
  const input = document.getElementById('apiKeyInput');
  if (input) {
    input.type = input.type === 'password' ? 'text' : 'password';
  }
}

// API 연결 테스트
export async function testApiConnection(silent = false) {
  const apiKeyInput = document.getElementById('apiKeyInput');
  const apiKey = apiKeyInput ? apiKeyInput.value.trim() : '';

  if (!apiKey) {
    if (!silent) {
      const resultEl = document.getElementById('apiTestResult');
      if (resultEl) {
        resultEl.innerHTML = `
          <div class="error-message">API 키를 입력해주세요.</div>
        `;
      }
    }
    return;
  }

  // 테스트 중 상태
  updateApiStatus('testing');
  const testBtn = document.getElementById('testApiBtn');
  if (testBtn) testBtn.disabled = true;

  if (!silent) {
    const resultEl = document.getElementById('apiTestResult');
    if (resultEl) {
      resultEl.innerHTML = `
        <div class="api-status testing">
          <span class="status-dot"></span>
          <span>연결 테스트 중...</span>
        </div>
      `;
    }
  }

  const isValid = await testApiKey(apiKey);

  if (testBtn) testBtn.disabled = false;

  if (isValid) {
    state.apiKey = apiKey;
    updateApiStatus('connected');
    if (!silent) {
      const resultEl = document.getElementById('apiTestResult');
      if (resultEl) {
        resultEl.innerHTML = `
          <div class="success-message">API 연결 성공!</div>
        `;
      }
    }
  } else {
    updateApiStatus('disconnected');
    if (!silent) {
      const resultEl = document.getElementById('apiTestResult');
      if (resultEl) {
        resultEl.innerHTML = `
          <div class="error-message">API 연결 실패. 키를 확인해주세요.</div>
        `;
      }
    }
  }
}

// API 키 저장
export function saveApiKey() {
  const apiKeyInput = document.getElementById('apiKeyInput');
  const apiKey = apiKeyInput ? apiKeyInput.value.trim() : '';

  state.apiKey = apiKey;
  saveToStorage();

  if (apiKey) {
    testApiConnection(true);
  } else {
    updateApiStatus('disconnected');
  }

  closeSettingsModal();
}

// 모델 선택 핸들러
export function handleModelSelect(modelId) {
  if (IMAGE_MODELS[modelId]) {
    state.selectedModel = modelId;
    saveSettings();
    updateWorkModeDisplay(); // 작업 모드 픽셀 표시 업데이트
    console.log(`Model changed to: ${modelId}`);
  } else {
    console.error(`Unknown model: ${modelId}`);
  }
}

// API 상태 업데이트
export function updateApiStatus(status) {
  state.apiStatus = status;
  const statusEl = document.getElementById('apiStatus');
  const textEl = document.getElementById('apiStatusText');

  if (!statusEl || !textEl) return;

  statusEl.className = 'api-status ' + status;

  switch (status) {
    case 'connected':
      textEl.textContent = 'API 연결됨';
      break;
    case 'testing':
      textEl.textContent = '테스트 중...';
      break;
    default:
      textEl.textContent = 'API 미연결';
  }
}

// 이미지 모달 열기
export function openImageModal(index) {
  if (index < 0 || index >= state.resultHistory.length) return;

  state.imageModalIndex = index;
  const item = state.resultHistory[index];

  const modalImg = document.getElementById('imageModalImg');
  const modalInfo = document.getElementById('imageModalInfo');
  const modal = document.getElementById('imageModal');

  if (modalImg) {
    modalImg.src = `data:${item.image.mimeType};base64,${item.image.data}`;
  }

  if (modalInfo) {
    let info = '';
    if (item.prompt) {
      info = item.prompt.substring(0, 200);
      if (item.prompt.length > 200) info += '...';
    }
    modalInfo.textContent = info;
  }

  if (modal) modal.classList.add('active');
}

// 이미지 모달 닫기
export function closeImageModal() {
  const modal = document.getElementById('imageModal');
  if (modal) modal.classList.remove('active');
  state.imageModalIndex = -1;
}

// 이미지 모달 네비게이션
export function navigateImageModal(direction) {
  if (state.imageModalIndex < 0) return;

  const newIndex = state.imageModalIndex + direction;
  if (newIndex >= 0 && newIndex < state.resultHistory.length) {
    openImageModal(newIndex);
  }
}

// 모달 이미지 다운로드
export function downloadModalImage() {
  if (state.imageModalIndex < 0 || state.imageModalIndex >= state.resultHistory.length) return;

  const item = state.resultHistory[state.imageModalIndex];
  const link = document.createElement('a');
  link.href = `data:${item.image.mimeType};base64,${item.image.data}`;
  link.download = `nano-banana-${Date.now()}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 프롬프트 재사용
export function reusePrompt() {
  if (state.imageModalIndex < 0 || state.imageModalIndex >= state.resultHistory.length) return;

  const item = state.resultHistory[state.imageModalIndex];

  closeImageModal();

  // 프롬프트를 클립보드에 복사
  navigator.clipboard.writeText(item.prompt).then(() => {
    showError('프롬프트가 클립보드에 복사되었습니다. 필드에 붙여넣기 하세요.');
    setTimeout(hideError, 3000);
  });
}
