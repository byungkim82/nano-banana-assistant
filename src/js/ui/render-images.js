// ===== RENDER IMAGES =====

import { state } from '../state.js';
import { formatFileSize } from '../utils.js';

// 첨부 이미지 렌더링
export function renderAttachedImages() {
  const grid = document.getElementById('thumbnailGrid');
  const countEl = document.getElementById('attachedCount');
  const infoEl = document.getElementById('selectedImageInfo');

  if (!grid || !countEl) return;

  countEl.textContent = state.attachedImages.length;

  if (state.attachedImages.length === 0) {
    grid.innerHTML = '';
    if (infoEl) infoEl.classList.add('hidden');
    return;
  }

  grid.innerHTML = state.attachedImages.map((img, index) => `
    <div class="thumbnail-item attached-thumb ${state.selectedImageId === img.id ? 'selected' : ''}"
         draggable="true"
         onclick="selectAttachedImage('${img.id}')"
         ondragstart="handleImageDragStart(event, '${img.id}')"
         ondragover="handleImageDragOver(event)"
         ondragleave="handleImageDragLeave(event)"
         ondrop="handleImageDrop(event, '${img.id}')"
         ondragend="handleImageDragEnd(event)">
      <img src="${img.thumbnail}" alt="첨부 ${index + 1}" draggable="false">
      <span class="thumbnail-index">${index + 1}</span>
      <button class="thumbnail-delete" onclick="event.stopPropagation(); deleteAttachedImage('${img.id}')">&times;</button>
    </div>
  `).join('');

  // 선택된 이미지 정보 표시
  if (state.selectedImageId && infoEl) {
    const selectedImg = state.attachedImages.find(img => img.id === state.selectedImageId);
    if (selectedImg) {
      infoEl.classList.remove('hidden');
      const previewEl = document.getElementById('selectedImagePreview');
      const metaEl = document.getElementById('selectedImageMeta');

      if (previewEl) {
        previewEl.src = `data:image/jpeg;base64,${selectedImg.base64}`;
      }
      if (metaEl) {
        metaEl.innerHTML = `
          <p>📄 ${selectedImg.file.name}</p>
          <p>📐 ${selectedImg.originalWidth}×${selectedImg.originalHeight} → ${selectedImg.width}×${selectedImg.height}</p>
          <p>💾 ${formatFileSize(selectedImg.originalSize)} → ${formatFileSize(selectedImg.processedSize)}</p>
        `;
      }
    }
  } else if (infoEl) {
    infoEl.classList.add('hidden');
  }
}

// 이미지 모달 렌더링
export function renderImageModal() {
  const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const modalPrompt = document.getElementById('modalPrompt');
  const prevBtn = document.getElementById('modalPrev');
  const nextBtn = document.getElementById('modalNext');
  const modalCounter = document.getElementById('modalCounter');

  if (!modal || state.imageModalIndex < 0) {
    if (modal) modal.classList.remove('active');
    return;
  }

  const item = state.resultHistory[state.imageModalIndex];
  if (!item) return;

  modal.classList.add('active');

  if (modalImage) {
    modalImage.src = `data:${item.image.mimeType};base64,${item.image.data}`;
  }

  if (modalPrompt) {
    modalPrompt.textContent = item.translatedPrompt || item.prompt;
  }

  if (prevBtn) {
    prevBtn.disabled = state.imageModalIndex <= 0;
  }

  if (nextBtn) {
    nextBtn.disabled = state.imageModalIndex >= state.resultHistory.length - 1;
  }

  if (modalCounter) {
    modalCounter.textContent = `${state.imageModalIndex + 1} / ${state.resultHistory.length}`;
  }
}
