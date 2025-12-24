// ===== IMAGE HANDLERS =====

import { state } from '../state.js';
import { processImage } from '../image-processing.js';
import { renderAttachedImages } from '../ui/render-images.js';
import { showError } from '../utils.js';
import { IMAGE_MODELS, WORK_MODES } from '../config.js';

// 작업 모드 버튼 픽셀 표시 업데이트
export function updateWorkModeDisplay() {
  const selectedModelConfig = IMAGE_MODELS[state.selectedModel];
  const supportsImageConfig = selectedModelConfig?.supportsImageConfig || false;

  document.querySelectorAll('.work-mode-btn').forEach(btn => {
    const mode = btn.dataset.mode;
    const sizeEl = btn.querySelector('.mode-size');

    if (!sizeEl || !mode) return;

    if (supportsImageConfig) {
      // Gemini 3 Pro: 1K, 2K, 4K
      const modeConfig = WORK_MODES[mode];
      sizeEl.textContent = modeConfig?.imageSize || '';
    } else {
      // Gemini 2.5 Flash: 512px, 1024px, 원본
      switch (mode) {
        case 'explore':
          sizeEl.textContent = '512px';
          break;
        case 'refine':
          sizeEl.textContent = '1024px';
          break;
        case 'final':
          sizeEl.textContent = '원본';
          break;
      }
    }
  });
}

// 작업 모드 설정
export function setWorkMode(mode) {
  state.workMode = mode;

  // UI 업데이트
  document.querySelectorAll('.work-mode-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });

  // 모드 픽셀 표시 업데이트
  updateWorkModeDisplay();
}

// 파일 선택 핸들러
export async function handleFileSelect(event) {
  const files = Array.from(event.target.files);
  await addImages(files);
  event.target.value = ''; // 같은 파일 재선택 가능하도록
}

// 이미지 추가
export async function addImages(files) {
  const validTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/jpg'];
  const selectedModelConfig = IMAGE_MODELS[state.selectedModel];
  const maxImages = selectedModelConfig?.maxImages || 14;

  for (const file of files) {
    if (state.attachedImages.length >= maxImages) {
      showError(`최대 ${maxImages}개의 이미지만 첨부할 수 있습니다.`);
      break;
    }

    if (!validTypes.includes(file.type)) {
      showError(`지원하지 않는 형식: ${file.name}`);
      continue;
    }

    try {
      const processed = await processImage(file);
      state.attachedImages.push(processed);
    } catch (e) {
      showError(`이미지 처리 실패: ${file.name}`);
    }
  }

  if (state.attachedImages.length > 0 && !state.selectedImageId) {
    state.selectedImageId = state.attachedImages[0].id;
  }

  renderAttachedImages();
}

// 첨부 이미지 선택
export function selectAttachedImage(imageId) {
  state.selectedImageId = imageId;
  renderAttachedImages();
}

// 첨부 이미지 삭제
export function deleteAttachedImage(imageId) {
  state.attachedImages = state.attachedImages.filter(img => img.id !== imageId);

  if (state.selectedImageId === imageId) {
    state.selectedImageId = state.attachedImages.length > 0 ? state.attachedImages[0].id : null;
  }

  renderAttachedImages();
}

// 선택된 이미지 삭제
export function deleteSelectedImage() {
  if (state.selectedImageId) {
    deleteAttachedImage(state.selectedImageId);
  }
}

// 원본 이미지 보기
export function viewOriginalImage() {
  if (!state.selectedImageId) return;

  const img = state.attachedImages.find(i => i.id === state.selectedImageId);
  if (img) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const modal = document.getElementById('imageModal');
      const modalImg = document.getElementById('imageModalImg');
      const modalInfo = document.getElementById('imageModalInfo');

      if (modalImg) modalImg.src = e.target.result;
      if (modalInfo) modalInfo.textContent = `원본: ${img.originalWidth}×${img.originalHeight}`;
      if (modal) modal.classList.add('active');
      state.imageModalIndex = -1; // 첨부 이미지 모드
    };
    reader.readAsDataURL(img.file);
  }
}

// 이미지 다운로드
export function downloadImage() {
  if (!state.generatedImage) return;

  const link = document.createElement('a');
  link.href = `data:${state.generatedImage.mimeType};base64,${state.generatedImage.data}`;
  link.download = `nano-banana-${Date.now()}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 결과 히스토리 선택
export function selectResultHistory(historyId) {
  const item = state.resultHistory.find(h => h.id === historyId);
  if (item) {
    state.selectedResultId = historyId;
    state.generatedImage = item.image;
    // renderResult는 main.js에서 호출
  }
}

// ===== 이미지 드래그 앤 드롭 순서 변경 =====

let draggedImageId = null;

// 드래그 시작
export function handleImageDragStart(event, imageId) {
  draggedImageId = imageId;
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', imageId);

  // 드래그 중인 요소에 스타일 적용
  const element = event.target.closest('.attached-thumb');
  if (element) {
    element.classList.add('dragging');
  }
}

// 드래그 중
export function handleImageDragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';

  // 드롭 위치 표시
  const thumbContainer = event.target.closest('.attached-thumb');
  if (thumbContainer && !thumbContainer.classList.contains('dragging')) {
    // 기존 드롭 인디케이터 제거
    document.querySelectorAll('.attached-thumb.drag-over').forEach(el => {
      el.classList.remove('drag-over');
    });
    thumbContainer.classList.add('drag-over');
  }
}

// 드래그 영역 벗어남
export function handleImageDragLeave(event) {
  const thumbContainer = event.target.closest('.attached-thumb');
  if (thumbContainer) {
    thumbContainer.classList.remove('drag-over');
  }
}

// 드롭
export function handleImageDrop(event, targetImageId) {
  event.preventDefault();

  // 드롭 인디케이터 제거
  document.querySelectorAll('.attached-thumb.drag-over').forEach(el => {
    el.classList.remove('drag-over');
  });

  if (!draggedImageId || draggedImageId === targetImageId) {
    return;
  }

  // 이미지 순서 변경
  const draggedIndex = state.attachedImages.findIndex(img => img.id === draggedImageId);
  const targetIndex = state.attachedImages.findIndex(img => img.id === targetImageId);

  if (draggedIndex === -1 || targetIndex === -1) {
    return;
  }

  // 배열에서 드래그된 이미지 제거 후 새 위치에 삽입
  const [draggedImage] = state.attachedImages.splice(draggedIndex, 1);
  state.attachedImages.splice(targetIndex, 0, draggedImage);

  renderAttachedImages();
}

// 드래그 종료
export function handleImageDragEnd(event) {
  draggedImageId = null;

  // 모든 드래그 관련 스타일 제거
  document.querySelectorAll('.attached-thumb.dragging').forEach(el => {
    el.classList.remove('dragging');
  });
  document.querySelectorAll('.attached-thumb.drag-over').forEach(el => {
    el.classList.remove('drag-over');
  });
}
