// ===== API MODULE =====

import { API_ENDPOINTS, API_ERRORS, IMAGE_MODELS, WORK_MODES } from './config.js';

// API 키 테스트
export async function testApiKey(apiKey) {
  try {
    const response = await fetch(
      `${API_ENDPOINTS.TEXT}?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Hello' }] }]
        })
      }
    );
    return response.ok;
  } catch (e) {
    console.error('API test failed:', e);
    return false;
  }
}

// 이미지 생성 API 호출
export async function callImageApi(prompt, apiKey, attachedImages = [], workMode = 'refine', selectedModel = 'gemini-3-pro-image-preview') {
  // 요청 파츠 구성
  const parts = [{ text: prompt }];

  // 첨부 이미지가 있으면 추가
  for (const img of attachedImages) {
    if (img.base64) {
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: img.base64
        }
      });
    }
  }

  // 선택된 모델 정보 가져오기
  const modelConfig = IMAGE_MODELS[selectedModel];
  if (!modelConfig) {
    throw new Error(`Unknown model: ${selectedModel}`);
  }

  // 요청 바디 기본 구조
  const requestBody = {
    contents: [{
      parts: parts
    }],
    generationConfig: {
      responseModalities: ['TEXT', 'IMAGE']
    }
  };

  // gemini-3-pro-image-preview인 경우에만 imageConfig 추가
  // gemini-2.5-flash-image는 imageConfig를 지원하지 않으므로 생략
  if (modelConfig.supportsImageConfig) {
    const modeConfig = WORK_MODES[workMode];
    requestBody.generationConfig.imageConfig = {
      aspectRatio: modeConfig.aspectRatio,
      imageSize: modeConfig.imageSize
    };
  }

  const response = await fetch(
    `${modelConfig.endpoint}?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    }
  );

  if (!response.ok) {
    const errorText = API_ERRORS[response.status] || `오류가 발생했습니다 (${response.status})`;
    throw new Error(errorText);
  }

  const data = await response.json();

  // 응답에서 이미지 추출 (두 모델 모두 동일한 형식)
  if (data.candidates && data.candidates[0] && data.candidates[0].content) {
    const parts = data.candidates[0].content.parts;
    for (const part of parts) {
      if (part.inlineData) {
        return {
          mimeType: part.inlineData.mimeType,
          data: part.inlineData.data
        };
      }
    }
  }

  throw new Error('이미지를 생성하지 못했습니다. 다른 프롬프트를 시도해보세요.');
}
