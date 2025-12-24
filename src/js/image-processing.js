// ===== IMAGE PROCESSING MODULE =====

import { INPUT_COMPRESSION } from './config.js';
import { generateImageId } from './utils.js';

// 이미지 처리 (리사이즈, 압축, 썸네일 생성)
export async function processImage(file) {
  const config = INPUT_COMPRESSION;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const originalWidth = img.width;
        const originalHeight = img.height;
        const originalSize = file.size;

        // 리사이즈 판단 (maxDimension 초과 시 리사이즈)
        const maxDim = config.maxDimension;
        let newWidth, newHeight;
        let needsResize = false;

        if (img.width > maxDim || img.height > maxDim) {
          needsResize = true;
          const scale = maxDim / Math.max(img.width, img.height);
          newWidth = Math.round(img.width * scale);
          newHeight = Math.round(img.height * scale);
        } else {
          newWidth = img.width;
          newHeight = img.height;
        }

        // 캔버스에 이미지 그리기
        const canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;
        const ctx = canvas.getContext('2d');

        if (needsResize) {
          ctx.drawImage(img, 0, 0, newWidth, newHeight);
        } else {
          ctx.drawImage(img, 0, 0);
        }

        // WebP 압축 시도, 실패 시 JPEG 폴백
        let base64Full, mimeType;
        try {
          base64Full = canvas.toDataURL('image/webp', config.webpQuality);

          // Verify WebP encoding succeeded
          if (!base64Full.startsWith('data:image/webp')) {
            throw new Error('WebP encoding failed');
          }
          mimeType = 'image/webp';
        } catch (e) {
          console.warn('WebP compression failed, using JPEG:', e);
          base64Full = canvas.toDataURL('image/jpeg', config.jpegQuality);
          mimeType = 'image/jpeg';
        }

        const base64Data = base64Full.split(',')[1];

        // 썸네일 생성
        const thumbnail = needsResize ?
          createThumbnailFromCanvas(canvas, newWidth, newHeight) :
          createThumbnail(img, img.width, img.height);

        resolve({
          id: generateImageId(),
          file: file,
          originalSize: originalSize,
          processedSize: Math.round(base64Data.length * 0.75),
          base64: base64Data,
          mimeType: mimeType,
          thumbnail: thumbnail,
          width: newWidth,
          height: newHeight,
          originalWidth: originalWidth,
          originalHeight: originalHeight
        });
      };
      img.onerror = () => reject(new Error('이미지 로드 실패'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('파일 읽기 실패'));
    reader.readAsDataURL(file);
  });
}

// 썸네일 생성 헬퍼 (Image 요소에서)
function createThumbnail(img, width, height) {
  const thumbCanvas = document.createElement('canvas');
  const thumbSize = 100;
  thumbCanvas.width = thumbSize;
  thumbCanvas.height = thumbSize;
  const thumbCtx = thumbCanvas.getContext('2d');

  // 정사각형 크롭
  const minDim = Math.min(width, height);
  const sx = (width - minDim) / 2;
  const sy = (height - minDim) / 2;
  thumbCtx.drawImage(img, sx, sy, minDim, minDim, 0, 0, thumbSize, thumbSize);

  return thumbCanvas.toDataURL('image/jpeg', 0.7);
}

// 썸네일 생성 헬퍼 (Canvas 요소에서)
function createThumbnailFromCanvas(canvas, width, height) {
  const thumbCanvas = document.createElement('canvas');
  const thumbSize = 100;
  thumbCanvas.width = thumbSize;
  thumbCanvas.height = thumbSize;
  const thumbCtx = thumbCanvas.getContext('2d');

  const minDim = Math.min(width, height);
  const sx = (width - minDim) / 2;
  const sy = (height - minDim) / 2;
  thumbCtx.drawImage(canvas, sx, sy, minDim, minDim, 0, 0, thumbSize, thumbSize);

  return thumbCanvas.toDataURL('image/jpeg', 0.7);
}

// 이미지 다운로드
export function downloadImage(base64Data, mimeType, filename = 'generated-image') {
  const link = document.createElement('a');
  link.href = `data:${mimeType};base64,${base64Data}`;
  link.download = `${filename}.${mimeType.split('/')[1] || 'png'}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// base64 이미지를 Blob으로 변환
export function base64ToBlob(base64Data, mimeType = 'image/png') {
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

// 클립보드에 이미지 복사
export async function copyImageToClipboard(base64Data, mimeType) {
  try {
    const blob = base64ToBlob(base64Data, mimeType);
    await navigator.clipboard.write([
      new ClipboardItem({ [mimeType]: blob })
    ]);
    return true;
  } catch (e) {
    console.error('Failed to copy image:', e);
    return false;
  }
}
