// ===== TRANSLATION MODULE =====

import { API_ENDPOINTS } from './config.js';
import { getCachedTranslation, setCachedTranslation } from './features/performance.js';

// 한국어 → 영어 번역 (캐싱 적용)
export async function translateToEnglish(koreanText, apiKey) {
  // 캐시 확인
  const cached = getCachedTranslation(koreanText);
  if (cached) {
    console.log('Translation cache hit');
    return cached;
  }

  try {
    const response = await fetch(
      `${API_ENDPOINTS.TEXT}?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Translate the following Korean text to English. This is a prompt for image generation, so preserve all descriptive details precisely. Only output the translated text, nothing else.\n\nKorean text:\n${koreanText}`
            }]
          }]
        })
      }
    );

    if (!response.ok) {
      throw new Error('번역 실패');
    }

    const data = await response.json();
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const text = data.candidates[0].content.parts[0].text.trim();
      // 캐시에 저장
      setCachedTranslation(koreanText, text);
      return text;
    }
    throw new Error('번역 결과 없음');
  } catch (e) {
    console.error('Translation failed:', e);
    throw e;
  }
}

// 한국어 포함 여부 확인
export function containsKorean(text) {
  const koreanRegex = /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/;
  return koreanRegex.test(text);
}
