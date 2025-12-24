// ===== Korean Locale =====

export default {
  // 일반
  app: {
    title: '나노 바나나 프롬프트 어시스턴트',
    description: 'Google Gemini AI를 활용한 이미지 생성 도구'
  },

  // 헤더
  header: {
    apiConnected: 'API 연결됨',
    apiDisconnected: 'API 미연결',
    apiError: 'API 오류',
    settings: '설정',
    help: '도움말',
    theme: '테마 변경'
  },

  // 템플릿
  templates: {
    basic: '기본',
    photo: '포토',
    typography: '타이포',
    logoGrid: '로고 그리드',
    chiaroscuro: '명암법',
    productLifestyle: '제품',
    addNew: '새 템플릿'
  },

  // 빌더
  builder: {
    title: '프롬프트 빌더',
    preview: '미리보기',
    original: '원문',
    translated: '번역',
    autoTranslate: '자동 번역',
    generate: '이미지 생성',
    generating: '생성 중...',
    copy: '복사',
    reset: '초기화',
    required: '필수'
  },

  // 작업 모드
  workMode: {
    title: '작업 모드',
    explore: '탐색',
    refine: '정제',
    final: '최종',
    exploreDesc: '빠른 아이디어 테스트용 (512px)',
    refineDesc: '세부 조정용 (1024px)',
    finalDesc: '프로덕션 출력용 (원본 해상도)'
  },

  // 첨부 이미지
  attachments: {
    title: '이미지 첨부',
    upload: '이미지 업로드',
    dragDrop: '드래그 앤 드롭 또는 클릭',
    maxFiles: '최대 14개',
    delete: '삭제',
    viewOriginal: '원본 보기',
    createCanvas: '캔버스 생성'
  },

  // 결과
  result: {
    title: '결과',
    empty: '생성된 이미지가 여기에 표시됩니다',
    download: '다운로드',
    edit: '편집',
    newSession: '새 세션',
    promptHistory: '프롬프트 히스토리'
  },

  // 편집 모드
  edit: {
    title: '대화식 편집',
    placeholder: '수정 요청을 입력하세요...',
    apply: '적용',
    presets: '프리셋',
    categories: {
      color: '색상',
      style: '스타일',
      composition: '구도',
      detail: '디테일'
    }
  },

  // 설정 모달
  settings: {
    title: '설정',
    apiKey: 'API 키',
    apiKeyPlaceholder: 'Gemini API 키를 입력하세요',
    save: '저장',
    testConnection: '연결 테스트',
    getApiKey: 'API 키 발급받기',
    thinkingMode: 'Thinking 모드',
    thinkingModeDesc: 'AI가 이미지 생성 전 논리적 검토 수행'
  },

  // 도움말
  help: {
    title: '도움말',
    tabs: {
      overview: '개요',
      templates: '템플릿',
      shortcuts: '단축키',
      tips: '팁',
      faq: 'FAQ'
    }
  },

  // 팁
  tips: {
    disable: '모든 팁 끄기',
    complexScene: {
      title: 'Thinking 모드 권장',
      message: '복잡한 장면이나 여러 요소가 포함된 이미지는 Thinking 모드를 활성화하면 더 정확한 결과를 얻을 수 있습니다.'
    },
    textRendering: {
      title: '텍스트 렌더링 팁',
      message: '텍스트 렌더링은 25자 이하가 권장됩니다. 긴 텍스트는 여러 이미지로 나누어 생성하세요.'
    }
  },

  // 오류
  errors: {
    apiKeyRequired: 'API 키를 먼저 설정해주세요',
    generationFailed: '이미지 생성에 실패했습니다',
    safetyFilter: '안전 필터에 의해 차단되었습니다',
    networkError: '네트워크 오류가 발생했습니다',
    invalidApiKey: 'API 키가 올바르지 않습니다'
  },

  // 공통
  common: {
    close: '닫기',
    cancel: '취소',
    confirm: '확인',
    delete: '삭제',
    save: '저장',
    copy: '복사',
    copied: '복사됨!'
  }
};
