# CLAUDE.md

이 파일은 Claude Code (claude.ai/code)가 이 저장소의 코드 작업 시 참고하는 가이드입니다.

## 프로젝트 개요

나노 바나나 프롬프트 어시스턴트는 그래픽 디자이너가 Google Gemini 이미지 생성 모델을 효율적으로 활용할 수 있도록 돕는 단일 HTML 파일 애플리케이션입니다. 템플릿 기반 프롬프트 빌더와 Gemini API 연동 기능을 제공합니다.

## 기술 스택

- 순수 HTML5, CSS3, Vanilla JavaScript (ES6+)
- 외부 의존성 없음 - 단일 HTML 파일 (`nano-banana-assistant.html`)
- Google Gemini API (이미지 생성)
- 브라우저 LocalStorage (데이터 저장)

## 아키텍처

애플리케이션은 단일 HTML 파일(약 1700줄)에 CSS와 JavaScript가 임베드된 구조입니다:

```
nano-banana-assistant.html
├── <style> - CSS 디자인 시스템 변수
├── <div id="app"> - HTML 구조
└── <script> - JavaScript 모듈:
    ├── CONFIG (STORAGE_KEYS, API_ENDPOINTS, API_ERRORS)
    ├── TEMPLATES (6개 템플릿 정의)
    ├── STATE (애플리케이션 상태 관리)
    ├── STORAGE (LocalStorage 함수)
    ├── API MODULE (Gemini API 호출)
    ├── PROMPT BUILDER (템플릿→프롬프트 변환)
    ├── UI RENDERING (템플릿 탭, 폼 필드, 결과)
    ├── EVENT HANDLERS (사용자 인터랙션)
    ├── MODAL HANDLERS (설정 모달)
    └── INIT (앱 초기화)
```

## 주요 구현 상세

### 템플릿 시스템
템플릿은 `TEMPLATES` 객체(약 783줄)에 정의됩니다. 각 템플릿 구조:
- `id`, `name`, `icon`, `category`, `description`
- `fields[]` - 폼 필드 정의 배열
- `promptTemplate` - `{fieldId}` 자리표시자가 포함된 문자열

현재 템플릿: `basic`, `photo`, `typography`, `logoGrid`, `chiaroscuro`, `productLifestyle`

### 상태 관리
약 1208줄의 단순한 상태 객체. 속성: `apiKey`, `apiStatus`, `currentTemplate`, `fieldValues`, `generatedImage`, `isLoading`, `error`

### API 연동
- 텍스트 엔드포인트 (API 키 테스트용): `gemini-2.5-flash:generateContent`
- 이미지 엔드포인트: `gemini-2.0-flash-exp:generateContent` (`responseModalities: ['TEXT', 'IMAGE']`)

### CSS 디자인 시스템
`:root`에 정의된 CSS 변수 (약 9줄):
- Primary: `#FFE135` (바나나 옐로우)
- Secondary: `#2D3436`
- Accent: `#6C5CE7`

## 개발 현황

현재 **Phase 1 MVP** 완료. 상세 진행 상황은 `IMPLEMENTATION_CHECKLIST.md` 참조.

PRD(`nano-banana-assistant-prd.md`)에 따른 남은 단계:
- Phase 2: 이미지 관리, 작업 모드, 번역
- Phase 3: 대화식 편집, Thinking 모드
- Phase 4: 추가 템플릿, 캔버스 도구, 마킹 에디터
- Phase 5: 폴리싱 (반응형, 다크 모드, 접근성)

## 테스트

`nano-banana-assistant.html`을 브라우저에서 직접 열면 됩니다. 빌드 과정 없음.

API 기능 테스트에는 Gemini API 키가 필요합니다: https://aistudio.google.com/app/apikey
