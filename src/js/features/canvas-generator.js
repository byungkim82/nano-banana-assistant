// ===== CANVAS GENERATOR =====

import { state } from '../state.js';
import { addImages } from '../handlers/image-handlers.js';
import { showError, hideError } from '../utils.js';

const ASPECT_RATIO_PRESETS = [
  { value: '1:1', label: '1:1', width: 1, height: 1 },
  { value: '3:4', label: '3:4', width: 3, height: 4 },
  { value: '4:3', label: '4:3', width: 4, height: 3 },
  { value: '9:16', label: '9:16', width: 9, height: 16 },
  { value: '16:9', label: '16:9', width: 16, height: 9 },
  { value: '21:9', label: '21:9', width: 21, height: 9 },
  { value: '2:3', label: '2:3', width: 2, height: 3 },
  { value: '3:2', label: '3:2', width: 3, height: 2 },
  { value: '4:5', label: '4:5', width: 4, height: 5 },
  { value: 'custom', label: '커스텀', width: null, height: null }
];

// 캔버스 생성기 모달 열기
export function openCanvasGenerator() {
  const modal = document.getElementById('canvasGeneratorModal');
  renderAspectRatioButtons();
  renderCanvasPreview();
  updateCanvasSizeInputs();
  if (modal) modal.classList.add('active');
}

// 캔버스 생성기 모달 닫기
export function closeCanvasGenerator() {
  const modal = document.getElementById('canvasGeneratorModal');
  if (modal) modal.classList.remove('active');
}

// 종횡비 설정
export function setCanvasAspectRatio(ratio) {
  state.canvasSettings.aspectRatio = ratio;

  // 커스텀이 아닌 경우 크기 자동 계산
  if (ratio !== 'custom') {
    const preset = ASPECT_RATIO_PRESETS.find(p => p.value === ratio);
    if (preset) {
      calculateCanvasSize(preset.width, preset.height);
    }
  }

  renderAspectRatioButtons();
  renderCanvasPreview();
  updateCanvasSizeInputs();
}

// 캔버스 크기 계산
function calculateCanvasSize(ratioW, ratioH) {
  const baseSize = state.canvasSettings.baseSize;

  if (ratioW > ratioH) {
    // 가로가 긴 경우
    state.canvasSettings.customWidth = baseSize;
    state.canvasSettings.customHeight = Math.round(baseSize * ratioH / ratioW);
  } else {
    // 세로가 길거나 같은 경우
    state.canvasSettings.customHeight = baseSize;
    state.canvasSettings.customWidth = Math.round(baseSize * ratioW / ratioH);
  }
}

// 기본 크기 설정
export function setCanvasBaseSize(size) {
  state.canvasSettings.baseSize = parseInt(size) || 1024;

  // 종횡비에 맞춰 재계산
  if (state.canvasSettings.aspectRatio !== 'custom') {
    const preset = ASPECT_RATIO_PRESETS.find(p => p.value === state.canvasSettings.aspectRatio);
    if (preset && preset.width) {
      calculateCanvasSize(preset.width, preset.height);
    }
  }

  renderCanvasPreview();
  updateCanvasSizeInputs();
}

// 커스텀 크기 설정
export function setCanvasCustomSize(width, height) {
  state.canvasSettings.customWidth = parseInt(width) || 1024;
  state.canvasSettings.customHeight = parseInt(height) || 1024;
  state.canvasSettings.aspectRatio = 'custom';

  renderAspectRatioButtons();
  renderCanvasPreview();
}

// 배경 타입 설정
export function setCanvasBackgroundType(type) {
  state.canvasSettings.backgroundType = type;

  if (type === 'white') {
    state.canvasSettings.backgroundColor = '#FFFFFF';
  } else if (type === 'transparent') {
    state.canvasSettings.backgroundColor = 'transparent';
  }

  renderCanvasPreview();
}

// 배경색 설정
export function setCanvasBackgroundColor(color) {
  state.canvasSettings.backgroundColor = color;
  state.canvasSettings.backgroundType = 'custom';
  renderCanvasPreview();
}

// 종횡비 버튼 렌더링
export function renderAspectRatioButtons() {
  const container = document.getElementById('aspectRatioButtons');
  if (!container) return;

  container.innerHTML = ASPECT_RATIO_PRESETS.map(preset => `
    <button class="aspect-ratio-btn ${state.canvasSettings.aspectRatio === preset.value ? 'active' : ''}"
            onclick="setCanvasAspectRatio('${preset.value}')">
      <span class="ratio-preview" style="${getRatioPreviewStyle(preset)}"></span>
      <span class="ratio-label">${preset.label}</span>
    </button>
  `).join('');
}

// 종횡비 프리뷰 스타일 계산
function getRatioPreviewStyle(preset) {
  if (preset.value === 'custom') {
    return 'width: 20px; height: 20px; border: 1px dashed var(--color-text-muted);';
  }

  const maxSize = 30;
  let w, h;

  if (preset.width > preset.height) {
    w = maxSize;
    h = Math.round(maxSize * preset.height / preset.width);
  } else {
    h = maxSize;
    w = Math.round(maxSize * preset.width / preset.height);
  }

  return `width: ${w}px; height: ${h}px; background: var(--color-border);`;
}

// 크기 입력 필드 업데이트
export function updateCanvasSizeInputs() {
  const widthInput = document.getElementById('canvasWidth');
  const heightInput = document.getElementById('canvasHeight');
  if (widthInput) widthInput.value = state.canvasSettings.customWidth;
  if (heightInput) heightInput.value = state.canvasSettings.customHeight;
}

// 캔버스 프리뷰 렌더링
export function renderCanvasPreview() {
  const canvas = document.getElementById('canvasPreview');
  const infoEl = document.getElementById('canvasInfo');
  if (!canvas || !infoEl) return;

  const ctx = canvas.getContext('2d');
  const width = state.canvasSettings.customWidth;
  const height = state.canvasSettings.customHeight;

  // 프리뷰 캔버스 크기 (비율 유지하며 컨테이너에 맞춤)
  const maxPreviewSize = 200;
  let previewWidth, previewHeight;

  if (width > height) {
    previewWidth = maxPreviewSize;
    previewHeight = Math.round(maxPreviewSize * height / width);
  } else {
    previewHeight = maxPreviewSize;
    previewWidth = Math.round(maxPreviewSize * width / height);
  }

  canvas.width = previewWidth;
  canvas.height = previewHeight;

  // 배경 그리기
  if (state.canvasSettings.backgroundType === 'transparent') {
    // 체커보드 패턴 (투명 표시)
    const tileSize = 10;
    for (let y = 0; y < previewHeight; y += tileSize) {
      for (let x = 0; x < previewWidth; x += tileSize) {
        ctx.fillStyle = ((x + y) / tileSize) % 2 === 0 ? '#FFFFFF' : '#CCCCCC';
        ctx.fillRect(x, y, tileSize, tileSize);
      }
    }
  } else {
    ctx.fillStyle = state.canvasSettings.backgroundColor;
    ctx.fillRect(0, 0, previewWidth, previewHeight);
  }

  // 테두리
  ctx.strokeStyle = '#CCCCCC';
  ctx.strokeRect(0, 0, previewWidth, previewHeight);

  // 정보 표시
  infoEl.textContent = `${width} × ${height}px`;
}

// 캔버스 생성 및 첨부
export async function generateAndAttachCanvas() {
  const width = state.canvasSettings.customWidth;
  const height = state.canvasSettings.customHeight;

  // 실제 크기 캔버스 생성
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (state.canvasSettings.backgroundType === 'transparent') {
    // 투명 배경
    ctx.clearRect(0, 0, width, height);
  } else {
    ctx.fillStyle = state.canvasSettings.backgroundColor;
    ctx.fillRect(0, 0, width, height);
  }

  // Blob으로 변환
  const blob = await new Promise(resolve => {
    canvas.toBlob(resolve, 'image/png');
  });

  // File 객체 생성
  const file = new File([blob], `canvas-${width}x${height}.png`, { type: 'image/png' });

  // 첨부 이미지에 추가
  await addImages([file]);

  // 모달 닫기
  closeCanvasGenerator();

  // 안내 메시지
  showError(`${width}×${height} 캔버스가 첨부되었습니다.`);
  setTimeout(hideError, 2000);
}
