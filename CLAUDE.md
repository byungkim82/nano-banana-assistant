# CLAUDE.md

이 파일은 Claude Code (claude.ai/code)가 이 저장소의 코드 작업 시 참고하는 가이드입니다.

## 프로젝트 개요

나노 바나나 프롬프트 어시스턴트는 그래픽 디자이너가 Google Gemini 이미지 생성 모델을 효율적으로 활용할 수 있도록 돕는 단일 HTML 파일 애플리케이션입니다. 템플릿 기반 프롬프트 빌더와 Gemini API 연동 기능을 제공합니다.

## 기술 스택

- 순수 HTML5, CSS3, Vanilla JavaScript (ES6 Modules)
- **개발**: 모듈화된 소스 코드 (src/css, src/js)
- **빌드**: esbuild 기반 번들러
- **배포**: 단일 HTML 파일 (런타임 외부 의존성 없음)
- Google Gemini API (이미지 생성)
- 브라우저 LocalStorage (데이터 저장)

## 아키텍처

애플리케이션은 **모듈화된 ES6+ 구조**로 개발되며, 빌드 시 **단일 HTML 파일**로 번들링됩니다.

### 개발 구조 (src/)

```
nano-banana-assistant/
├── src/
│   ├── css/ (9개 CSS 파일)
│   │   ├── variables.css      # 디자인 시스템 변수
│   │   ├── reset.css           # CSS 리셋
│   │   ├── layout.css          # 레이아웃 (3열 구조)
│   │   ├── components.css      # 버튼, 폼, 패널 컴포넌트
│   │   ├── panels.css          # 첨부/빌더/결과 패널
│   │   ├── modals.css          # 모달 다이얼로그
│   │   ├── editing.css         # 편집 세션 UI
│   │   ├── responsive.css      # 반응형 (데스크톱/태블릿/모바일)
│   │   └── utilities.css       # 유틸리티 클래스
│   │
│   └── js/ (29개 JS 모듈)
│       ├── main.js                          # 엔트리 포인트
│       ├── config.js                        # 설정 (IMAGE_MODELS, WORK_MODES 등)
│       ├── state.js                         # 상태 관리
│       ├── storage.js                       # LocalStorage 인터페이스
│       ├── api.js                           # Gemini API 호출
│       ├── templates.js                     # 12개 템플릿 정의
│       ├── prompt-builder.js                # 템플릿→프롬프트 변환
│       ├── translation.js                   # 한영 자동 번역
│       ├── image-processing.js              # 이미지 압축/리사이즈
│       ├── utils.js                         # 유틸리티 함수
│       ├── handlers/                        # 이벤트 핸들러
│       │   ├── template-handlers.js
│       │   ├── generation-handlers.js
│       │   ├── image-handlers.js
│       │   ├── modal-handlers.js
│       │   └── edit-handlers.js
│       ├── ui/                              # UI 렌더링
│       │   ├── render-templates.js
│       │   ├── render-result.js
│       │   ├── render-images.js
│       │   └── render-edit-session.js
│       ├── features/                        # 기능 모듈
│       │   ├── prompt-history.js            # 프롬프트 히스토리
│       │   ├── canvas-generator.js          # 빈 캔버스 생성
│       │   ├── custom-templates.js          # 사용자 정의 템플릿
│       │   ├── performance.js               # 성능 최적화
│       │   ├── responsive.js                # 반응형 동작
│       │   ├── keyboard-shortcuts.js        # 키보드 단축키
│       │   ├── help-system.js               # 도움말 시스템
│       │   ├── tips-system.js               # 팁 표시
│       │   └── i18n.js                      # 국제화 (다국어)
│       └── data/locales/                    # 언어 데이터
│           ├── ko.js                        # 한국어
│           └── en.js                        # 영어
│
├── index.html            # 개발용 HTML (ES Module 로드)
├── build.mjs             # esbuild 빌드 스크립트
└── dist/
    └── nano-banana-assistant.html    # 빌드 결과물 (~245KB)
```

### 빌드 프로세스 (build.mjs)

1. **CSS 수집**: 9개 CSS 파일을 의존성 순서대로 병합
2. **JS 번들링**: esbuild로 29개 모듈을 IIFE 포맷으로 번들링
3. **HTML 생성**: CSS와 JS를 index.html에 임베드하여 단일 파일 생성

결과물: `dist/nano-banana-assistant.html` - 브라우저에서 직접 실행 가능한 자기완결형 파일

### 주요 모듈 설명

- **config.js**: IMAGE_MODELS (gemini-3-pro, gemini-2.5-flash), WORK_MODES, API_ENDPOINTS 등 전역 설정
- **state.js**: apiKey, currentTemplate, fieldValues, generatedImage, editSession 등 애플리케이션 상태
- **templates.js**: 12개 프롬프트 템플릿 (기본 6개 + 고급 6개)
- **api.js**: Gemini API 호출 (이미지 생성, 번역)
- **handlers/**: 템플릿 전환, 이미지 생성, 업로드, 편집 등 사용자 인터랙션 처리
- **features/**: 고급 기능 (다국어, 다크모드, 키보드 단축키, 접근성 등)

## 주요 구현 상세

### 템플릿 시스템
템플릿은 `templates.js`에 정의됩니다. 각 템플릿 구조:
- `id`, `name`, `icon`, `category`, `description`
- `fields[]` - 폼 필드 정의 배열 (text, textarea, select, checkbox 등)
- `promptTemplate` - `{fieldId}` 자리표시자가 포함된 문자열

**현재 제공 템플릿 (12개)**:
- **기본 (6개)**: `basic`, `photo`, `typography`, `logoGrid`, `chiaroscuro`, `productLifestyle`
- **고급 (6개)**: `composite` (다중 이미지 합성), `magazine` (매거진 커버), `quilling` (페이퍼 퀼링), `material` (재료/텍스처), `cityLettering` (도시 레터링), `lightingPro` (조명 정밀 제어)

### 상태 관리
`state.js`의 단순한 상태 객체. 주요 속성:
- `apiKey`, `apiStatus`: API 인증 상태
- `currentTemplate`, `fieldValues`: 템플릿 및 입력값
- `generatedImage`, `isLoading`, `error`: 생성 상태
- `editSession`: 대화식 편집 세션 (sessionId, basePrompt, editHistory)
- `settings`: 다국어, 다크모드, Thinking 모드 등

### API 연동
`api.js`에서 Gemini API를 호출합니다.

- **텍스트 엔드포인트** (번역용): `gemini-2.0-flash:generateContent`
- **이미지 생성 모델 (2개 지원)**:
  - `gemini-3-pro-image-preview` (기본 모델, **권장**)
    - `imageConfig` 지원 (해상도 제어)
    - 작업 모드별 출력 해상도: **Explore=1K**, **Refine=2K**, **Final=4K**
    - 향상된 텍스트 렌더링
    - aspectRatio: 1:1 고정
    - 최대 14개 이미지 첨부
  - `gemini-2.5-flash-image` (기존 모델)
    - 안정적인 성능
    - `imageConfig` 미지원
    - 최대 14개 이미지 첨부
- 설정 모달에서 모델 선택 가능 (`config.js`의 `IMAGE_MODELS` 참조)
- 선택한 모델은 LocalStorage에 저장

### 작업 모드 시스템
`config.js`의 `WORK_MODES`에 정의된 3가지 작업 모드:
- **🔍 Explore (탐색)**: 빠른 변형 생성용 (1K 출력) - 아이디어 탐색
- **✨ Refine (정제)**: 세부 조정용 (2K 출력) - 디테일 수정
- **📸 Final (최종)**: 프로덕션 출력용 (4K 출력) - 최종 결과물

모드에 따라 `imageConfig.imageSize` 값이 자동 설정됩니다 (gemini-3-pro 전용).

### Thinking 모드
`config.js`의 `THINKING_PREFIX` 템플릿을 프롬프트 앞에 추가하여 모델이 생성 전 추론하도록 유도:
```
Before generating this image:
1. Analyze the core objective of my request
2. Verify logical consistency of physics, lighting, and composition
3. Establish relationships and priorities between elements
4. Review potential error points (e.g., text spelling, proportions)

Then generate:
```
복잡한 장면, 정확한 텍스트 렌더링, 물리적 정확성이 중요한 경우 권장됩니다.

### 이미지 처리
`image-processing.js`에서 입력 이미지 자동 압축 처리:
- 최대 해상도: 2048px (긴 쪽 기준)
- WebP 포맷 우선 (85% 품질), 실패 시 JPEG (90% 품질)
- API 토큰 사용량 절감 목적

### 대화식 편집 세션
`edit-handlers.js`에서 반복 수정 워크플로우 구현:
- 이전 결과를 기반으로 수정 요청 입력
- 편집 히스토리 추적 (sessionId, basePrompt, editHistory)
- 빠른 수정 프리셋 (조명/색상/요소/스타일 카테고리별)
- 단계별 이미지 비교 및 이동 기능

### 추가 기능
- **프롬프트 히스토리** (`prompt-history.js`): 이전 프롬프트 저장/복원/검색
- **사용자 정의 템플릿** (`custom-templates.js`): 템플릿 생성/편집/삭제/내보내기/가져오기
- **빈 캔버스 생성기** (`canvas-generator.js`): 10가지 종횡비 프리셋, 배경색 선택
- **자동 번역** (`translation.js`): 한글→영어 번역 (Gemini Flash API 사용)
- **다국어** (`i18n.js`, `data/locales/`): 한국어/영어 지원
- **다크 모드**: 자동 감지 (prefers-color-scheme) 또는 수동 전환
- **키보드 단축키** (`keyboard-shortcuts.js`): Ctrl+Enter (생성), Ctrl+C (복사), Ctrl+1~6 (템플릿 전환) 등
- **접근성**: ARIA 레이블, 키보드 네비게이션, 스크린 리더 지원, 고대비 모드
- **반응형 디자인** (`responsive.js`, `responsive.css`): 데스크톱(3열)/태블릿(2열)/모바일(1열) 레이아웃
- **성능 최적화** (`performance.js`): 이미지 지연 로딩, 디바운싱, 번역 캐싱, LocalStorage 용량 관리
- **도움말 & 팁 시스템** (`help-system.js`, `tips-system.js`): 상황별 팁, 온보딩 투어

### CSS 디자인 시스템
`variables.css`에 정의된 CSS 변수:
- Primary: `#FFE135` (바나나 옐로우)
- Secondary: `#2D3436`
- Accent: `#6C5CE7`
- 타이포그래피, 스페이싱, Border radius, Shadow 등

## 개발 현황

현재 **Phase 5 완료** (4.4 마킹 에디터 제외). 상세 진행 상황은 `IMPLEMENTATION_CHECKLIST.md` 참조.

| Phase | 이름 | 상태 | 진행률 |
|-------|------|------|--------|
| Phase 1 | 핵심 MVP | ✅ 완료 | 100% |
| Phase 2 | 이미지 관리 & 번역 | ✅ 완료 | 100% |
| Phase 3 | 대화식 편집 & Thinking 모드 | ✅ 완료 | 100% |
| Phase 4 | 고급 기능 | ✅ 완료 | 80% (4.4 제외) |
| Phase 5 | 폴리싱 | ✅ 완료 | 100% |

**구현 완료 주요 기능**:
- 12개 템플릿 (기본 6개 + 고급 6개)
- 사용자 정의 템플릿 (생성/편집/삭제/내보내기/가져오기)
- 프롬프트 히스토리 (저장/복원/검색)
- 이미지 업로드/첨부 (최대 14개, 드래그 정렬)
- 작업 모드 (Explore 1K / Refine 2K / Final 4K)
- 자동 번역 (한글→영어, Gemini Flash)
- 대화식 편집 세션 (히스토리 추적, 빠른 수정 프리셋)
- Thinking 모드 (생성 전 추론)
- 빈 캔버스 생성기 (10가지 종횡비)
- 다크 모드
- 다국어 (한국어/영어)
- 반응형 디자인 (데스크톱/태블릿/모바일)
- 키보드 단축키 (Ctrl+Enter, Ctrl+C, Ctrl+1~6 등)
- 접근성 (ARIA, 키보드 네비게이션, 스크린 리더)
- 도움말 & 팁 시스템
- 성능 최적화 (이미지 지연 로딩, 디바운싱, 캐싱)

## 개발 워크플로우

### 개발 환경 설정
```bash
# 의존성 설치
npm install

# 개발 서버 시작 (로컬 서버)
npm run dev
# → http://localhost:3000 접속
# → src/ 디렉토리의 모듈을 ES Module로 직접 로드
# → 소스 수정 시 브라우저 새로고침으로 즉시 반영
```

### 프로덕션 빌드
```bash
# 단일 HTML 파일로 번들링
npm run build

# 빌드 결과:
# → dist/nano-banana-assistant.html (~245KB)
# → CSS 9개 파일 병합 + JS 29개 모듈 번들링
# → 브라우저에서 직접 실행 가능 (런타임 의존성 없음)
```

### 테스트
- **개발 테스트**: `npm run dev` 실행 후 브라우저에서 `http://localhost:3000` 접속
- **프로덕션 테스트**: `npm run build` 실행 후 `dist/nano-banana-assistant.html` 파일을 브라우저에서 직접 열기
- **API 기능 테스트**: Gemini API 키 필요 → https://aistudio.google.com/app/apikey

### 파일 구조 참고
- `src/css/`: CSS 모듈 (9개)
- `src/js/`: JavaScript 모듈 (29개)
  - 핵심 모듈: `main.js`, `config.js`, `state.js`, `api.js`, `templates.js`
  - 핸들러: `handlers/*.js`
  - UI 렌더링: `ui/*.js`
  - 기능 모듈: `features/*.js`
- `index.html`: 개발용 HTML (ES Module 로드)
- `build.mjs`: esbuild 빌드 스크립트
- `dist/nano-banana-assistant.html`: 빌드 결과물
