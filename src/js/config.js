// ===== CONFIG =====

export const STORAGE_KEYS = {
  API_KEY: 'nano_banana_api_key',
  SETTINGS: 'nano_banana_settings',
  HISTORY: 'nano_banana_history',
  PROMPT_HISTORY: 'nano_banana_prompt_history',
  CUSTOM_TEMPLATES: 'nano_banana_custom_templates'
};

export const API_ENDPOINTS = {
  TEXT: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
  IMAGE: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent'
};

export const API_ERRORS = {
  400: '잘못된 요청입니다. 프롬프트를 확인해주세요.',
  401: 'API 키가 유효하지 않습니다.',
  403: '접근이 거부되었습니다. API 키 권한을 확인해주세요.',
  429: '요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.',
  500: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  'NETWORK_ERROR': '네트워크 연결을 확인해주세요.',
  'IMAGE_SAFETY': '안전 필터에 의해 이미지 생성이 차단되었습니다.'
};

// Thinking 모드 프리픽스 템플릿
export const THINKING_PREFIX = `Before generating this image:
1. Analyze the core objective of my request
2. Verify logical consistency of physics, lighting, and composition
3. Establish relationships and priorities between elements
4. Review potential error points (e.g., text spelling, proportions)

Then generate:
`;

// 빠른 수정 프리셋 데이터
export const QUICK_PRESETS = {
  lighting: {
    id: 'lighting',
    name: '💡 조명',
    presets: [
      { id: 'warmer', label: '더 따뜻하게', prompt: 'Make the lighting warmer with golden tones' },
      { id: 'cooler', label: '더 차갑게', prompt: 'Make the lighting cooler with blue tones' },
      { id: 'shadow_strong', label: '그림자 강화', prompt: 'Enhance shadows for more dramatic contrast' },
      { id: 'shadow_soft', label: '그림자 부드럽게', prompt: 'Soften shadows for a more gentle look' },
      { id: 'backlight', label: '역광 추가', prompt: 'Add backlighting/rim light behind the subject' }
    ]
  },
  color: {
    id: 'color',
    name: '🎨 색상',
    presets: [
      { id: 'saturation_up', label: '채도 +15%', prompt: 'Increase color saturation by 15%' },
      { id: 'saturation_down', label: '채도 -15%', prompt: 'Decrease color saturation by 15%' },
      { id: 'contrast_up', label: '대비 높이기', prompt: 'Increase contrast for more vivid colors' },
      { id: 'vintage', label: '빈티지 톤', prompt: 'Apply vintage/retro color grading' },
      { id: 'monochrome', label: '모노크롬', prompt: 'Convert to monochrome/black and white' }
    ]
  },
  elements: {
    id: 'elements',
    name: '🧩 요소',
    presets: [
      { id: 'add_logo', label: '로고 추가', prompt: 'Add a subtle logo placeholder in the corner' },
      { id: 'add_text', label: '텍스트 추가', prompt: 'Add text overlay space' },
      { id: 'change_bg', label: '배경 변경', prompt: 'Change the background to a neutral/clean background' },
      { id: 'add_props', label: '소품 추가', prompt: 'Add complementary props/accessories to the scene' }
    ]
  },
  style: {
    id: 'style',
    name: '🖌️ 스타일',
    presets: [
      { id: 'more_realistic', label: '더 사실적으로', prompt: 'Make it more photorealistic with natural details' },
      { id: 'more_illustration', label: '더 일러스트풍으로', prompt: 'Make it more illustrated/artistic style' },
      { id: 'film_grain', label: '필름 그레인 추가', prompt: 'Add subtle film grain texture' },
      { id: 'cinematic', label: '시네마틱', prompt: 'Apply cinematic look with letterbox aspect ratio feel' }
    ]
  }
};

// 작업 모드 설정
export const WORK_MODES = {
  explore: {
    id: 'explore',
    name: '탐색',
    icon: '🔍',
    maxSize: 512,
    quality: 0.6,
    description: '빠른 변형 생성용 (512px, 60% 품질)'
  },
  refine: {
    id: 'refine',
    name: '정제',
    icon: '✨',
    maxSize: 1024,
    quality: 0.8,
    description: '세부 조정용 (1024px, 80% 품질)'
  },
  final: {
    id: 'final',
    name: '최종',
    icon: '📸',
    maxSize: null,
    quality: 1.0,
    description: '프로덕션 출력용 (원본 해상도)'
  }
};

// 종횡비 프리셋 (캔버스 생성기용)
export const ASPECT_RATIO_PRESETS = [
  { id: 'square', ratio: '1:1', width: 1, height: 1, label: '정사각형' },
  { id: 'landscape43', ratio: '4:3', width: 4, height: 3, label: '가로 4:3' },
  { id: 'landscape169', ratio: '16:9', width: 16, height: 9, label: '가로 16:9' },
  { id: 'portrait34', ratio: '3:4', width: 3, height: 4, label: '세로 3:4' },
  { id: 'portrait916', ratio: '9:16', width: 9, height: 16, label: '세로 9:16' }
];
