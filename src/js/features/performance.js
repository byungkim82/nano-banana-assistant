// ===== PERFORMANCE MODULE =====

import { STORAGE_KEYS } from '../config.js';

// ===== 번역 캐시 =====
const translationCache = new Map();
const MAX_CACHE_SIZE = 100;

export function getCachedTranslation(text) {
  return translationCache.get(text);
}

export function setCachedTranslation(text, translation) {
  // 캐시 크기 제한
  if (translationCache.size >= MAX_CACHE_SIZE) {
    // 가장 오래된 항목 삭제 (FIFO)
    const firstKey = translationCache.keys().next().value;
    translationCache.delete(firstKey);
  }
  translationCache.set(text, translation);
}

export function clearTranslationCache() {
  translationCache.clear();
}

// ===== LocalStorage 용량 관리 =====
const MAX_STORAGE_SIZE = 5 * 1024 * 1024; // 5MB
const WARNING_THRESHOLD = 0.8; // 80%

export function getStorageUsage() {
  let total = 0;
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage.getItem(key).length * 2; // UTF-16 characters = 2 bytes
    }
  }
  return total;
}

export function checkStorageQuota() {
  const used = getStorageUsage();
  const usagePercent = used / MAX_STORAGE_SIZE;

  if (usagePercent > WARNING_THRESHOLD) {
    console.warn(`LocalStorage usage: ${(usagePercent * 100).toFixed(1)}%`);
    return true; // 정리 필요
  }
  return false;
}

export function cleanupOldData() {
  // 프롬프트 히스토리 정리 (오래된 항목 삭제)
  try {
    const historyKey = STORAGE_KEYS.PROMPT_HISTORY;
    const history = JSON.parse(localStorage.getItem(historyKey) || '[]');

    if (history.length > 50) {
      const trimmedHistory = history.slice(-50); // 최근 50개만 유지
      localStorage.setItem(historyKey, JSON.stringify(trimmedHistory));
      console.log(`Prompt history trimmed: ${history.length} → ${trimmedHistory.length}`);
    }
  } catch (e) {
    console.error('Failed to cleanup prompt history:', e);
  }

  // 결과 히스토리 정리
  try {
    const resultKey = STORAGE_KEYS.RESULT_HISTORY;
    const results = JSON.parse(localStorage.getItem(resultKey) || '[]');

    if (results.length > 20) {
      const trimmedResults = results.slice(-20); // 최근 20개만 유지
      localStorage.setItem(resultKey, JSON.stringify(trimmedResults));
      console.log(`Result history trimmed: ${results.length} → ${trimmedResults.length}`);
    }
  } catch (e) {
    console.error('Failed to cleanup result history:', e);
  }
}

// ===== 이미지 지연 로딩 =====
let lazyLoadObserver = null;

export function setupLazyLoading() {
  if ('IntersectionObserver' in window) {
    lazyLoadObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            lazyLoadObserver.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '50px',
      threshold: 0.01
    });
  }
}

export function observeLazyImage(imgElement) {
  if (lazyLoadObserver && imgElement.dataset.src) {
    lazyLoadObserver.observe(imgElement);
  }
}

export function unobserveLazyImage(imgElement) {
  if (lazyLoadObserver) {
    lazyLoadObserver.unobserve(imgElement);
  }
}

// ===== 메모리 관리 =====
const MAX_RESULT_HISTORY_IN_MEMORY = 10;

export function releaseOldImageData(resultHistory) {
  // 메모리에서 오래된 이미지 데이터 해제
  if (resultHistory.length > MAX_RESULT_HISTORY_IN_MEMORY) {
    for (let i = 0; i < resultHistory.length - MAX_RESULT_HISTORY_IN_MEMORY; i++) {
      if (resultHistory[i].image && resultHistory[i].image.data) {
        // 썸네일만 유지하고 원본 데이터 해제
        resultHistory[i].dataReleased = true;
      }
    }
  }
}

// ===== 초기화 =====
export function initPerformance() {
  setupLazyLoading();

  // 앱 시작 시 용량 체크
  if (checkStorageQuota()) {
    cleanupOldData();
  }
}
