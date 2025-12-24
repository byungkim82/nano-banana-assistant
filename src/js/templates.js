// ===== TEMPLATES =====

export const TEMPLATES = {
  basic: {
    id: 'basic',
    name: '기본 프롬프트',
    icon: '🎨',
    category: 'basic',
    description: 'Google 공식 6요소 공식 기반',
    fields: [
      {
        id: 'subject',
        label: '주제 (Subject)',
        type: 'textarea',
        placeholder: '예: 파란색 발광 광학기를 가진 금욕적인 로봇 바리스타',
        required: true,
        helpText: '구체적으로 작성하세요. "로봇"보다 "파란 발광 광학기를 가진 로봇 바리스타"가 좋습니다.'
      },
      {
        id: 'composition',
        label: '구성 (Composition)',
        type: 'select',
        options: [
          { value: '', label: '선택하세요' },
          { value: 'extreme close-up', label: '익스트림 클로즈업' },
          { value: 'close-up', label: '클로즈업' },
          { value: 'medium shot', label: '미디엄 샷' },
          { value: 'wide shot', label: '와이드 샷' },
          { value: 'establishing shot', label: '전체 샷' },
          { value: 'birds eye view', label: '버드 아이 뷰' },
          { value: 'worms eye view', label: '웜즈 아이 뷰' }
        ]
      },
      {
        id: 'action',
        label: '액션 (Action)',
        type: 'text',
        placeholder: '예: 커피를 내리고 있는, 달리는 중인'
      },
      {
        id: 'location',
        label: '위치 (Location)',
        type: 'text',
        placeholder: '예: 화성의 미래형 카페에서'
      },
      {
        id: 'style',
        label: '스타일 (Style)',
        type: 'select',
        options: [
          { value: '', label: '선택하세요' },
          { value: 'photorealistic', label: '포토리얼리스틱' },
          { value: '3D animation', label: '3D 애니메이션' },
          { value: 'watercolor painting', label: '수채화' },
          { value: 'oil painting', label: '유화' },
          { value: 'pencil sketch', label: '연필 스케치' },
          { value: 'digital art', label: '디지털 아트' },
          { value: 'vintage photograph', label: '빈티지 사진' }
        ]
      },
      {
        id: 'lighting',
        label: '조명',
        type: 'select',
        options: [
          { value: '', label: '선택하세요' },
          { value: 'golden hour sunlight', label: '골든아워' },
          { value: 'soft diffused light', label: '소프트 디퓨즈드' },
          { value: 'dramatic chiaroscuro', label: '명암법 (Chiaroscuro)' },
          { value: 'neon lighting', label: '네온 조명' },
          { value: 'studio three-point lighting', label: '스튜디오 3점 조명' },
          { value: 'Rembrandt lighting', label: '렘브란트 조명' }
        ]
      },
      {
        id: 'additional',
        label: '추가 지시사항',
        type: 'textarea',
        placeholder: '색상 팔레트, 분위기, 기타 세부사항...'
      }
    ],
    promptTemplate: 'Create a {style} image of {subject}{action}{location}. {composition}. {lighting}. {additional}'
  },

  photo: {
    id: 'photo',
    name: '포토리얼리스틱',
    icon: '📷',
    category: 'basic',
    description: '사진 스타일 이미지 생성',
    fields: [
      {
        id: 'subject',
        label: '피사체',
        type: 'textarea',
        placeholder: '예: 석양을 바라보는 젊은 여성',
        required: true
      },
      {
        id: 'camera',
        label: '카메라',
        type: 'select',
        options: [
          { value: '', label: '선택하세요' },
          { value: 'Canon EOS R5', label: 'Canon EOS R5' },
          { value: 'Sony A7R V', label: 'Sony A7R V' },
          { value: 'Nikon Z9', label: 'Nikon Z9' },
          { value: 'Hasselblad H6D', label: 'Hasselblad H6D' }
        ]
      },
      {
        id: 'lens',
        label: '렌즈',
        type: 'select',
        options: [
          { value: '', label: '선택하세요' },
          { value: '85mm f/1.4', label: '85mm f/1.4 (인물)' },
          { value: '35mm f/1.4', label: '35mm f/1.4 (환경 인물)' },
          { value: '24-70mm f/2.8', label: '24-70mm f/2.8 (범용)' },
          { value: '70-200mm f/2.8', label: '70-200mm f/2.8 (망원)' },
          { value: '100mm macro', label: '100mm 매크로' }
        ]
      },
      {
        id: 'aperture',
        label: '조리개',
        type: 'select',
        options: [
          { value: '', label: '선택하세요' },
          { value: 'f/1.4', label: 'f/1.4 (극얕은 심도)' },
          { value: 'f/2.8', label: 'f/2.8 (얕은 심도)' },
          { value: 'f/5.6', label: 'f/5.6 (중간)' },
          { value: 'f/8', label: 'f/8 (선명)' },
          { value: 'f/11', label: 'f/11 (풍경)' }
        ]
      },
      {
        id: 'lighting',
        label: '조명',
        type: 'select',
        options: [
          { value: '', label: '선택하세요' },
          { value: 'golden hour sunlight', label: '골든아워' },
          { value: 'soft window light', label: '창문 자연광' },
          { value: 'overcast diffused', label: '흐린 날 확산광' },
          { value: 'Rembrandt lighting', label: '렘브란트 조명' },
          { value: 'rim light', label: '림 라이트' },
          { value: 'three-point studio', label: '3점 스튜디오 조명' }
        ]
      },
      {
        id: 'filmStock',
        label: '필름/색감',
        type: 'select',
        options: [
          { value: '', label: '기본 디지털' },
          { value: 'Kodachrome 64 color science', label: 'Kodachrome 64' },
          { value: 'Fujifilm Velvia saturated', label: 'Fujifilm Velvia' },
          { value: 'Cinestill 800T', label: 'Cinestill 800T' },
          { value: 'vintage Polaroid', label: '빈티지 폴라로이드' }
        ]
      },
      {
        id: 'depthOfField',
        label: '피사계 심도',
        type: 'select',
        options: [
          { value: '', label: '선택하세요' },
          { value: 'shallow depth of field with creamy bokeh', label: '얕은 심도, 크리미 보케' },
          { value: 'sharp focus throughout', label: '전체 선명' },
          { value: 'selective focus on subject', label: '피사체만 선명' }
        ]
      },
      {
        id: 'additional',
        label: '추가 지시사항',
        type: 'textarea',
        placeholder: '분위기, 색조, 기타 세부사항...'
      }
    ],
    promptTemplate: 'A photorealistic photograph of {subject}. Captured with {camera}, {lens} lens at {aperture}. {lighting}. {filmStock}. {depthOfField}. {additional}'
  },

  typography: {
    id: 'typography',
    name: '타이포그래피',
    icon: '✏️',
    category: 'typography',
    description: '텍스트가 포함된 이미지 생성',
    fields: [
      {
        id: 'text',
        label: '표시할 텍스트',
        type: 'text',
        placeholder: '예: HELLO WORLD',
        required: true,
        helpText: '25자 이하 권장, 2-3개 문구로 제한하면 좋습니다.'
      },
      {
        id: 'fontStyle',
        label: '폰트 스타일',
        type: 'select',
        options: [
          { value: '', label: '선택하세요' },
          { value: 'bold sans-serif', label: '굵은 산세리프' },
          { value: 'elegant serif', label: '우아한 세리프' },
          { value: 'hand-written script', label: '손글씨 필기체' },
          { value: 'retro vintage', label: '레트로 빈티지' },
          { value: 'modern minimalist', label: '모던 미니멀리스트' },
          { value: 'graffiti style', label: '그래피티 스타일' },
          { value: 'neon sign', label: '네온 사인' }
        ]
      },
      {
        id: 'textColor',
        label: '텍스트 색상',
        type: 'text',
        placeholder: '예: 흰색, 금색, 그라데이션 파랑-보라'
      },
      {
        id: 'placement',
        label: '텍스트 위치',
        type: 'select',
        options: [
          { value: '', label: '선택하세요' },
          { value: 'centered in the image', label: '중앙' },
          { value: 'at the top', label: '상단' },
          { value: 'at the bottom', label: '하단' },
          { value: 'diagonal across', label: '대각선' },
          { value: 'curved around subject', label: '곡선으로 배치' }
        ]
      },
      {
        id: 'background',
        label: '배경',
        type: 'text',
        placeholder: '예: 어두운 우주 배경, 흰색 대리석, 네온 도시'
      },
      {
        id: 'effects',
        label: '효과',
        type: 'text',
        placeholder: '예: 그림자, 빛 발산, 3D 입체감'
      },
      {
        id: 'additional',
        label: '추가 지시사항',
        type: 'textarea',
        placeholder: '기타 세부사항...'
      }
    ],
    promptTemplate: 'Create an image with the text "{text}" displayed prominently. Font style: {fontStyle}. Text color: {textColor}. Text placement: {placement}. Background: {background}. Effects: {effects}. {additional}'
  },

  logoGrid: {
    id: 'logoGrid',
    name: '8개 로고 그리드',
    icon: '🔤',
    category: 'typography',
    description: '한 번에 여러 로고 변형 생성',
    fields: [
      {
        id: 'theme',
        label: '테마',
        type: 'text',
        placeholder: '예: 음식, 감정, 동물',
        required: true
      },
      {
        id: 'expressionStyle',
        label: '표현 방식',
        type: 'select',
        options: [
          { value: '', label: '선택하세요' },
          { value: 'letters visually express meaning', label: '글자가 의미를 시각적으로 표현' },
          { value: 'letters made of actual objects', label: '글자를 실제 물체로 제작' },
          { value: 'letters with dramatic shadows', label: '극적인 그림자가 있는 글자' }
        ]
      },
      {
        id: 'backgroundColor',
        label: '배경색',
        type: 'select',
        options: [
          { value: 'white', label: '흰색' },
          { value: 'black', label: '검은색' },
          { value: 'gradient gray', label: '그라데이션 회색' }
        ]
      },
      {
        id: 'renderStyle',
        label: '렌더링 스타일',
        type: 'select',
        options: [
          { value: '', label: '선택하세요' },
          { value: 'flat vector black', label: '플랫 벡터 검은색' },
          { value: 'colorful 3D', label: '컬러풀 3D' },
          { value: 'minimalist line art', label: '미니멀 라인 아트' }
        ]
      }
    ],
    promptTemplate: 'Create 8 minimalist logos. Each is a word related to {theme}, where {expressionStyle}. Composition: all logos on a single {backgroundColor} background, rendered in {renderStyle} style.'
  },

  chiaroscuro: {
    id: 'chiaroscuro',
    name: '명암법 (Chiaroscuro)',
    icon: '🌓',
    category: 'artwork',
    description: '드라마틱한 명암 대비 효과',
    fields: [
      {
        id: 'subject',
        label: '피사체',
        type: 'textarea',
        placeholder: '예: 중년 남성의 측면 초상화',
        required: true
      },
      {
        id: 'lightDirection',
        label: '조명 방향',
        type: 'select',
        options: [
          { value: '', label: '선택하세요' },
          { value: 'from above and slightly left', label: '위와 약간 왼쪽에서' },
          { value: 'from above and slightly right', label: '위와 약간 오른쪽에서' },
          { value: 'from direct side left', label: '왼쪽 측면에서' },
          { value: 'from below (horror style)', label: '아래에서 (호러 스타일)' }
        ]
      },
      {
        id: 'highlightAreas',
        label: '하이라이트 영역',
        type: 'text',
        placeholder: '예: 눈과 광대뼈만',
        helpText: '빛이 닿는 부분을 지정'
      },
      {
        id: 'shadowIntensity',
        label: '그림자 강도',
        type: 'select',
        options: [
          { value: '', label: '선택하세요' },
          { value: 'deep and sharp', label: '깊고 선명한' },
          { value: 'soft and gradual', label: '부드럽고 점진적' },
          { value: 'extreme contrast', label: '극단적 대비' }
        ]
      },
      {
        id: 'mood',
        label: '분위기',
        type: 'text',
        placeholder: '예: 신비로운, 극적인, 고전적인'
      }
    ],
    promptTemplate: 'Generate intense chiaroscuro effect. Harsh, directional lighting coming {lightDirection}. Cast {shadowIntensity} shadows. Only {highlightAreas} are illuminated by thin lines of light, rest in deep shadow. Subject: {subject}. Mood: {mood}.'
  },

  productLifestyle: {
    id: 'productLifestyle',
    name: '제품 라이프스타일',
    icon: '📦',
    category: 'professional',
    description: '제품을 여러 환경에 배치',
    fields: [
      {
        id: 'productDescription',
        label: '제품 설명',
        type: 'textarea',
        placeholder: '예: 미니멀한 디자인의 스테인리스 스틸 텀블러',
        required: true,
        helpText: '제품의 형태, 색상, 재질을 상세히 설명하세요'
      },
      {
        id: 'scene1',
        label: '장면 1',
        type: 'text',
        placeholder: '예: 맥북과 커피가 있는 미니멀한 홈 오피스 책상 위'
      },
      {
        id: 'scene2',
        label: '장면 2',
        type: 'text',
        placeholder: '예: 타월과 물병이 있는 헬스장 가방 안'
      },
      {
        id: 'scene3',
        label: '장면 3',
        type: 'text',
        placeholder: '예: 와인 잔과 촛불이 있는 레스토랑 테이블 위'
      },
      {
        id: 'scene4',
        label: '장면 4',
        type: 'text',
        placeholder: '예: 숲 등산로의 열린 백팩 안'
      },
      {
        id: 'consistency',
        label: '일관성 유지 항목',
        type: 'checkbox-group',
        options: [
          { value: 'same angle', label: '같은 각도' },
          { value: 'same material reflection', label: '같은 재질 반사' },
          { value: 'same color', label: '같은 색상' },
          { value: 'same logo position', label: '같은 로고 위치' }
        ],
        defaultValue: ['same angle', 'same material reflection', 'same color', 'same logo position']
      },
      {
        id: 'lightingStyle',
        label: '조명 스타일',
        type: 'select',
        options: [
          { value: '', label: '선택하세요' },
          { value: 'natural daylight', label: '자연 주광' },
          { value: 'soft studio lighting', label: '소프트 스튜디오 조명' },
          { value: 'dramatic side lighting', label: '드라마틱 사이드 조명' },
          { value: 'warm golden hour', label: '따뜻한 골든아워' }
        ]
      }
    ],
    promptTemplate: 'Show this product in 4 lifestyle scenes:\n1) {scene1}\n2) {scene2}\n3) {scene3}\n4) {scene4}\n\nProduct: {productDescription}\n\nProduct must remain identical across all images: {consistency}. Only environment, props, and lighting change. Lighting style: {lightingStyle}. Use natural depth of field. Output as 4 separate images optimized for e-commerce.'
  },

  // ===== Phase 4 추가 템플릿 =====

  composite: {
    id: 'composite',
    name: '다중 이미지 합성',
    icon: '🧩',
    category: 'professional',
    description: '여러 이미지를 하나로 합성',
    fields: [
      {
        id: 'aspectRatio',
        label: '최종 종횡비',
        type: 'select',
        options: [
          { value: '16:9', label: '16:9 와이드' },
          { value: '1:1', label: '1:1 정사각형' },
          { value: '4:3', label: '4:3 가로' },
          { value: '9:16', label: '9:16 세로' },
          { value: '3:4', label: '3:4 세로' }
        ],
        required: true
      },
      {
        id: 'compositeInstructions',
        label: '합성 지시사항',
        type: 'textarea',
        placeholder: '각 이미지의 배치 위치와 크기를 설명하세요.\n예: 이미지 1을 왼쪽에, 이미지 2를 중앙 크게, 이미지 3을 오른쪽 상단에 작게',
        required: true,
        helpText: '첨부 패널에서 이미지를 먼저 업로드하세요 (최대 14개)'
      },
      {
        id: 'lightingUnity',
        label: '조명 통일',
        type: 'select',
        options: [
          { value: '', label: '선택하세요' },
          { value: 'unified studio lighting from left', label: '왼쪽 스튜디오 조명' },
          { value: 'unified natural daylight', label: '자연 주광' },
          { value: 'unified soft box at 45 degrees', label: '소프트박스 45도' },
          { value: 'unified golden hour warm lighting', label: '골든아워 따뜻한 조명' }
        ]
      },
      {
        id: 'shadowDirection',
        label: '그림자 방향',
        type: 'select',
        options: [
          { value: '', label: '선택하세요' },
          { value: 'consistent shadows to the right', label: '오른쪽으로 통일' },
          { value: 'consistent shadows to the left', label: '왼쪽으로 통일' },
          { value: 'consistent shadows below', label: '아래로 통일' },
          { value: 'soft diffused shadows', label: '부드럽게 확산' }
        ]
      },
      {
        id: 'background',
        label: '배경',
        type: 'text',
        placeholder: '예: 그라데이션 회색, 흰색 스튜디오, 도시 야경'
      },
      {
        id: 'additional',
        label: '추가 지시사항',
        type: 'textarea',
        placeholder: '색감 통일, 블렌딩 방식 등...'
      }
    ],
    promptTemplate: 'Composite the uploaded images into a single {aspectRatio} image. {compositeInstructions}. Apply {lightingUnity} with {shadowDirection}. Background: {background}. {additional}'
  },

  magazine: {
    id: 'magazine',
    name: '매거진 커버',
    icon: '📰',
    category: 'typography',
    description: '광택 매거진 커버 스타일',
    fields: [
      {
        id: 'title',
        label: '매거진 제목',
        type: 'text',
        placeholder: '예: VOGUE, TIME, ELLE',
        required: true,
        helpText: '25자 이하 권장'
      },
      {
        id: 'personDescription',
        label: '인물 설명',
        type: 'textarea',
        placeholder: '예: 녹색과 골드 고급 패션을 입은 다이나믹한 인물'
      },
      {
        id: 'fontStyle',
        label: '폰트 스타일',
        type: 'select',
        options: [
          { value: '', label: '선택하세요' },
          { value: 'bold serif black-white', label: '굵은 세리프 흑백' },
          { value: 'elegant script gold', label: '우아한 필기체 골드' },
          { value: 'modern sans-serif white', label: '모던 산세리프 흰색' },
          { value: 'vintage art deco', label: '빈티지 아트데코' }
        ]
      },
      {
        id: 'issueInfo',
        label: '발행 정보',
        type: 'text',
        placeholder: '예: 2025년 12월호, $15.99'
      },
      {
        id: 'extras',
        label: '추가 요소',
        type: 'checkbox-group',
        options: [
          { value: 'barcode in corner', label: '바코드' },
          { value: 'issue number displayed', label: '발행 호수' },
          { value: 'price tag visible', label: '가격표' }
        ]
      }
    ],
    promptTemplate: 'Glossy magazine cover photo. Cover displays "{title}" in large {fontStyle} font filling the top. In front of the text, {personDescription}. Corner includes {issueInfo}. {extras}. Magazine resting on white shelf leaning against wall.'
  },

  quilling: {
    id: 'quilling',
    name: '페이퍼 퀼링',
    icon: '🎀',
    category: 'artwork',
    description: '종이 띠로 만든 입체 아트워크',
    fields: [
      {
        id: 'text',
        label: '표현할 텍스트',
        type: 'text',
        placeholder: '예: MAGIC, LOVE, DREAM',
        required: true,
        helpText: '짧은 단어 권장 (1-2단어)'
      },
      {
        id: 'colors',
        label: '종이 띠 색상',
        type: 'text',
        placeholder: '예: 보라색, 핑크, 마젠타, 흰색',
        helpText: '콤마로 여러 색상 구분'
      },
      {
        id: 'backgroundColor',
        label: '배경색',
        type: 'text',
        placeholder: '예: 진회색, 크림색, 검은색'
      },
      {
        id: 'scriptStyle',
        label: '글씨 스타일',
        type: 'select',
        options: [
          { value: '', label: '선택하세요' },
          { value: 'elaborate calligraphy script', label: '정교한 캘리그래피' },
          { value: 'bold block letters', label: '굵은 블록 글자' },
          { value: 'flowing cursive', label: '흐르는 필기체' },
          { value: 'decorative ornamental', label: '장식적 오너멘탈' }
        ]
      },
      {
        id: 'depth',
        label: '입체감 수준',
        type: 'select',
        options: [
          { value: '', label: '선택하세요' },
          { value: 'subtle 3D depth', label: '은은한 입체감' },
          { value: 'pronounced layered depth', label: '뚜렷한 레이어 깊이' },
          { value: 'extreme sculptural depth', label: '극적인 조각적 깊이' }
        ]
      }
    ],
    promptTemplate: 'Paper quilling artwork, rendered with {colors} paper strips. The word "{text}" expressed in {scriptStyle}. Paper strips create {depth} and natural shadows, placed on {backgroundColor} textured background.'
  },

  material: {
    id: 'material',
    name: '재료/텍스처',
    icon: '🪨',
    category: 'artwork',
    description: '오브젝트를 특정 재료로 표현',
    fields: [
      {
        id: 'targetObject',
        label: '대상 오브젝트',
        type: 'textarea',
        placeholder: '예: 사과, 자동차, 인간 얼굴',
        required: true
      },
      {
        id: 'material',
        label: '재료',
        type: 'select',
        options: [
          { value: '', label: '선택하세요' },
          { value: 'polished marble', label: '광택 대리석' },
          { value: 'rough granite', label: '거친 화강암' },
          { value: 'liquid mercury', label: '액체 수은' },
          { value: 'cracked porcelain', label: '금간 도자기' },
          { value: 'weathered bronze', label: '풍화된 청동' },
          { value: 'ice crystal', label: '얼음 결정' },
          { value: 'molten lava', label: '녹은 용암' },
          { value: 'woven fabric', label: '직조 천' },
          { value: 'transparent glass', label: '투명 유리' }
        ]
      },
      {
        id: 'textureDetails',
        label: '텍스처 디테일',
        type: 'text',
        placeholder: '예: 균열, 반사, 질감, 표면 처리'
      },
      {
        id: 'lighting',
        label: '조명',
        type: 'select',
        options: [
          { value: '', label: '선택하세요' },
          { value: 'studio lighting for material showcase', label: '재질 쇼케이스용 스튜디오 조명' },
          { value: 'dramatic side lighting', label: '드라마틱 사이드 조명' },
          { value: 'soft ambient lighting', label: '부드러운 환경 조명' }
        ]
      },
      {
        id: 'background',
        label: '배경',
        type: 'text',
        placeholder: '예: 검은 배경, 그라데이션, 자연환경'
      }
    ],
    promptTemplate: 'Create {targetObject} made entirely of {material}. The surface shows {textureDetails}. Lighting: {lighting}. Background: {background}. Photorealistic render emphasizing the material properties.'
  },

  cityLettering: {
    id: 'cityLettering',
    name: '도시 레터링',
    icon: '🏙️',
    category: 'artwork',
    description: '건물로 글자 형태 표현',
    fields: [
      {
        id: 'city',
        label: '도시',
        type: 'text',
        placeholder: '예: 베를린, 서울, 도쿄, 뉴욕',
        required: true
      },
      {
        id: 'word',
        label: '표현할 단어',
        type: 'text',
        placeholder: '예: BERLIN, SEOUL',
        required: true,
        helpText: '도시 이름 또는 짧은 단어 권장'
      },
      {
        id: 'buildingColors',
        label: '건물 색상',
        type: 'text',
        placeholder: '예: 파란색, 빨간색, 흰색, 검은색'
      },
      {
        id: 'timeOfDay',
        label: '시간대',
        type: 'select',
        options: [
          { value: '', label: '선택하세요' },
          { value: 'bright sunny day', label: '밝은 햇살 낮' },
          { value: 'golden hour sunset', label: '골든아워 석양' },
          { value: 'blue hour twilight', label: '블루아워 황혼' },
          { value: 'night with city lights', label: '도시 불빛 밤' }
        ]
      },
      {
        id: 'perspective',
        label: '시점',
        type: 'select',
        options: [
          { value: '', label: '선택하세요' },
          { value: 'street level view', label: '거리 시점' },
          { value: 'aerial view', label: '공중 시점' },
          { value: 'wide panoramic', label: '와이드 파노라마' }
        ]
      }
    ],
    promptTemplate: '{timeOfDay} {city} street view. Old buildings arranged subtly in the shape of the letters "{word}". Buildings painted in {buildingColors}. Buildings still look like buildings, similarity to letters is subtle. {perspective}. Strong shadows, sharp details.'
  },

  lightingPro: {
    id: 'lightingPro',
    name: '조명 정밀 제어',
    icon: '💡',
    category: 'professional',
    description: '기술적 조명 언어로 정확한 조명 설정',
    fields: [
      {
        id: 'subject',
        label: '피사체/장면',
        type: 'textarea',
        placeholder: '예: 프리미엄 시계 제품 사진, 인물 초상화',
        required: true
      },
      {
        id: 'colorTemp',
        label: '색온도',
        type: 'select',
        options: [
          { value: '', label: '선택하세요' },
          { value: '5600K daylight balanced', label: '5600K 주광' },
          { value: '3200K tungsten warm', label: '3200K 텅스텐 따뜻함' },
          { value: '6500K cool daylight', label: '6500K 쿨 데이라이트' },
          { value: 'mixed warm key and cool fill', label: '혼합 (따뜻함 키 + 차가움 필)' }
        ]
      },
      {
        id: 'keyLight',
        label: '키 라이트',
        type: 'text',
        placeholder: '예: 왼쪽 상단에서 45도 각도, 소프트박스',
        helpText: '주요 조명의 위치, 각도, 수식어'
      },
      {
        id: 'fillLight',
        label: '필 라이트',
        type: 'text',
        placeholder: '예: 오른쪽에서 30% 강도의 반사판',
        helpText: '그림자를 채우는 보조 조명'
      },
      {
        id: 'rimLight',
        label: '림/백 라이트',
        type: 'text',
        placeholder: '예: 뒤에서 피사체 가장자리를 강조하는 얇은 빛',
        helpText: '피사체 윤곽을 분리하는 조명'
      },
      {
        id: 'surface',
        label: '배치 표면',
        type: 'text',
        placeholder: '예: 검은 아크릴 표면에 반사, 흰색 무광 테이블'
      }
    ],
    promptTemplate: '{subject}. Professional lighting setup: {colorTemp} color temperature. Key light: {keyLight}. Fill light: {fillLight}. Rim/back light: {rimLight}. Subject placed on {surface}. Studio photography quality.'
  }
};
