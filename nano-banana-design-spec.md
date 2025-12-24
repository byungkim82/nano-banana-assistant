# 🍌 나노 바나나 프롬프트 어시스턴트 - 디자인 상세 명세서
## Design Specification for Claude Code Implementation

> **문서 버전**: 2.0  
> **최종 업데이트**: 2025-12-23  
> **대상**: Claude Code 및 개발 에이전트

---

## 1. 디자인 철학 및 테마

### 1.1 핵심 컨셉: **Cyberpunk Tech Dashboard**

- **다크 모드 기반**: 전문가용 그래픽 도구의 미학 (Figma, Leonardo.ai 참조)
- **고대비 인터페이스**: 장시간 작업에 적합한 눈의 피로 최소화
- **계층적 깊이감**: Glassmorphism을 활용한 레이어 구분

### 1.2 디자인 원칙

| 원칙 | 설명 |
|------|------|
| **명확성** | 각 요소의 기능이 시각적으로 즉시 이해되어야 함 |
| **일관성** | 동일한 기능은 동일한 스타일로 표현 |
| **피드백** | 모든 사용자 액션에 시각적 응답 제공 |
| **계층** | 중요도에 따른 시각적 위계 명확히 구분 |

---

## 2. 컬러 시스템

### 2.1 CSS 변수 정의

```css
:root {
  /* ========== 브랜드 컬러 ========== */
  --color-primary: #FFE135;           /* 바나나 옐로우 - 메인 강조 */
  --color-primary-hover: #FFD600;     /* 호버 시 더 진한 옐로우 */
  --color-primary-active: #E6C200;    /* 클릭 시 */
  --color-primary-glow: rgba(255, 225, 53, 0.4);  /* 글로우 효과 */
  --color-primary-soft: rgba(255, 225, 53, 0.15); /* 배경용 연한 버전 */

  /* ========== 배경 컬러 ========== */
  --color-bg-primary: #0D0D0D;        /* 최상위 배경 (거의 검정) */
  --color-bg-secondary: #141414;      /* 메인 컨텐츠 영역 */
  --color-bg-tertiary: #1A1A1A;       /* 카드/패널 배경 */
  --color-bg-elevated: #222222;       /* 떠있는 요소 (모달, 드롭다운) */
  --color-bg-hover: #2A2A2A;          /* 호버 상태 배경 */

  /* ========== 표면 컬러 (Glassmorphism) ========== */
  --color-surface: rgba(30, 30, 30, 0.8);
  --color-surface-light: rgba(45, 45, 45, 0.6);
  --color-surface-border: rgba(255, 255, 255, 0.08);

  /* ========== 텍스트 컬러 ========== */
  --color-text-primary: #FFFFFF;      /* 주요 텍스트 */
  --color-text-secondary: #A0A0A0;    /* 보조 텍스트 */
  --color-text-muted: #666666;        /* 비활성/힌트 텍스트 */
  --color-text-inverse: #0D0D0D;      /* 밝은 배경 위 텍스트 */

  /* ========== 상태 컬러 ========== */
  --color-success: #00D68F;           /* 성공/완료 */
  --color-success-bg: rgba(0, 214, 143, 0.15);
  --color-warning: #FFB800;           /* 경고/진행중 */
  --color-warning-bg: rgba(255, 184, 0, 0.15);
  --color-error: #FF4757;             /* 오류 */
  --color-error-bg: rgba(255, 71, 87, 0.15);
  --color-info: #3B82F6;              /* 정보 */
  --color-info-bg: rgba(59, 130, 246, 0.15);

  /* ========== 보더 컬러 ========== */
  --color-border: rgba(255, 255, 255, 0.1);
  --color-border-strong: rgba(255, 255, 255, 0.2);
  --color-border-focus: var(--color-primary);

  /* ========== 악센트 컬러 (보조 강조) ========== */
  --color-accent-purple: #8B5CF6;
  --color-accent-cyan: #06B6D4;
  --color-accent-pink: #EC4899;
}
```

### 2.2 컬러 사용 가이드

| 용도 | 컬러 변수 | 사용 예시 |
|------|----------|----------|
| **CTA 버튼** | `--color-primary` | 이미지 생성, 저장 버튼 |
| **활성 탭/선택** | `--color-primary` | 현재 선택된 템플릿 탭 |
| **링크/인터랙티브** | `--color-primary` | 클릭 가능한 텍스트 |
| **성공 상태** | `--color-success` | 생성 완료, 연결됨 |
| **진행 중** | `--color-warning` | 로딩, 처리 중 |
| **오류** | `--color-error` | 실패, 경고 |
| **비활성** | `--color-text-muted` | 사용 불가 버튼 |

---

## 3. 타이포그래피

### 3.1 폰트 스택

```css
:root {
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
               'Noto Sans KR', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
}
```

### 3.2 폰트 크기 체계

```css
:root {
  /* 폰트 크기 */
  --text-xs: 0.6875rem;    /* 11px - 캡션, 라벨 */
  --text-sm: 0.75rem;      /* 12px - 보조 텍스트 */
  --text-base: 0.875rem;   /* 14px - 기본 본문 */
  --text-md: 1rem;         /* 16px - 강조 본문 */
  --text-lg: 1.125rem;     /* 18px - 소제목 */
  --text-xl: 1.25rem;      /* 20px - 섹션 제목 */
  --text-2xl: 1.5rem;      /* 24px - 페이지 제목 */
  --text-3xl: 2rem;        /* 32px - 대형 헤딩 */

  /* 폰트 굵기 */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;

  /* 행간 */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;

  /* 자간 */
  --tracking-tight: -0.02em;
  --tracking-normal: 0;
  --tracking-wide: 0.02em;
}
```

### 3.3 텍스트 스타일 클래스

```css
/* 헤딩 */
.heading-1 {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
  color: var(--color-text-primary);
}

.heading-2 {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-tight);
  color: var(--color-text-primary);
}

.heading-3 {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
}

/* 본문 */
.body-text {
  font-size: var(--text-base);
  font-weight: var(--font-normal);
  line-height: var(--leading-normal);
  color: var(--color-text-secondary);
}

/* 라벨 */
.label-text {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
}

/* 캡션 */
.caption-text {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

/* 코드/모노스페이스 */
.mono-text {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
}
```

---

## 4. 간격 시스템 (Spacing)

### 4.1 기본 간격 단위

```css
:root {
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
}
```

### 4.2 컴포넌트별 간격 가이드

| 컴포넌트 | 내부 패딩 | 요소 간 간격 |
|----------|----------|-------------|
| 버튼 (소) | `8px 12px` | - |
| 버튼 (중) | `10px 16px` | - |
| 버튼 (대) | `12px 24px` | - |
| 카드 | `16px` | `12px` |
| 패널 | `16px 20px` | `16px` |
| 입력 필드 | `10px 12px` | - |
| 모달 | `24px` | `16px` |
| 섹션 간격 | - | `24px` |
| 그리드 갭 | - | `12px` |

---

## 5. 레이아웃 시스템

### 5.1 전체 레이아웃 구조

```
┌─────────────────────────────────────────────────────────────────────────┐
│  🍌 HEADER (높이: 56px, 고정)                                            │
│  로고 + 작업 모드 + Thinking 토글 + 설정/도움말                           │
├─────────────────────────────────────────────────────────────────────────┤
│  🎯 TOOLBAR (높이: 48px, 고정)                                           │
│  카테고리 탭 + 템플릿 탭                                                  │
├─────────────┬─────────────────────────────────┬─────────────────────────┤
│  PANEL-L    │        MAIN CONTENT             │       PANEL-R           │
│  (280px)    │        (flex: 1)                │       (320px)           │
│             │                                  │                         │
│  첨부 이미지  │      프롬프트 빌더               │      생성 결과           │
│  빈 캔버스    │      필드 입력                   │      갤러리             │
│  마킹 에디터  │      미리보기                    │      편집 히스토리       │
│             │      액션 버튼                   │                         │
│             │                                  │                         │
├─────────────┴─────────────────────────────────┴─────────────────────────┤
│  📊 FOOTER (높이: 32px, 고정)                                            │
│  상태 메시지 + API 사용량                                                │
└─────────────────────────────────────────────────────────────────────────┘
```

### 5.2 레이아웃 CSS

```css
/* 메인 컨테이너 */
.app-container {
  display: grid;
  grid-template-rows: 56px 48px 1fr 32px;
  height: 100vh;
  background: var(--color-bg-primary);
  overflow: hidden;
}

/* 3열 메인 영역 */
.main-content {
  display: grid;
  grid-template-columns: 280px 1fr 320px;
  gap: 0;
  overflow: hidden;
}

/* 패널 공통 */
.panel {
  background: var(--color-bg-secondary);
  border-right: 1px solid var(--color-border);
  overflow-y: auto;
  padding: var(--space-4);
}

.panel:last-child {
  border-right: none;
  border-left: 1px solid var(--color-border);
}

/* 중앙 메인 빌더 */
.builder-area {
  background: var(--color-bg-primary);
  padding: var(--space-6);
  overflow-y: auto;
}
```

### 5.3 반응형 브레이크포인트

```css
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}

/* 태블릿 (768px - 1279px) */
@media (max-width: 1279px) {
  .main-content {
    grid-template-columns: 1fr 320px;
  }
  .panel-left {
    display: none; /* 토글로 표시 */
  }
}

/* 모바일 (767px 이하) */
@media (max-width: 767px) {
  .main-content {
    grid-template-columns: 1fr;
  }
  .panel-left,
  .panel-right {
    display: none; /* 탭으로 전환 */
  }
}
```

---

## 6. 컴포넌트 스타일

### 6.1 버튼

```css
/* 버튼 베이스 */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: 10px 16px;
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

/* Primary 버튼 (CTA) */
.btn-primary {
  background: var(--color-primary);
  color: var(--color-text-inverse);
}
.btn-primary:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px var(--color-primary-glow);
}
.btn-primary:active {
  background: var(--color-primary-active);
  transform: scale(0.98);
}

/* Secondary 버튼 */
.btn-secondary {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}
.btn-secondary:hover {
  background: var(--color-bg-hover);
  border-color: var(--color-border-strong);
}

/* Ghost 버튼 */
.btn-ghost {
  background: transparent;
  color: var(--color-text-secondary);
}
.btn-ghost:hover {
  background: var(--color-bg-hover);
  color: var(--color-text-primary);
}

/* 아이콘 전용 버튼 */
.btn-icon {
  padding: 8px;
  border-radius: 6px;
}

/* 버튼 크기 */
.btn-sm { padding: 6px 12px; font-size: var(--text-sm); }
.btn-lg { padding: 14px 28px; font-size: var(--text-md); }

/* 비활성 상태 */
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}
```

### 6.2 입력 필드

```css
/* 텍스트 입력 */
.input {
  width: 100%;
  padding: 10px 12px;
  font-size: var(--text-base);
  color: var(--color-text-primary);
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  outline: none;
  transition: all 0.15s ease;
}

.input::placeholder {
  color: var(--color-text-muted);
}

.input:hover {
  border-color: var(--color-border-strong);
}

.input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-soft);
}

/* 텍스트영역 */
.textarea {
  min-height: 100px;
  resize: vertical;
  line-height: var(--leading-relaxed);
}

/* 셀렉트 */
.select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23A0A0A0' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
}

/* 체크박스 커스텀 */
.checkbox {
  appearance: none;
  width: 18px;
  height: 18px;
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  cursor: pointer;
}
.checkbox:checked {
  background: var(--color-primary);
  border-color: var(--color-primary);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%230D0D0D' viewBox='0 0 16 16'%3E%3Cpath d='M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
}

/* 필드 그룹 */
.field-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.field-label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
}

.field-label .required {
  color: var(--color-error);
  margin-left: 2px;
}

.field-hint {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}
```

### 6.3 카드

```css
/* 기본 카드 */
.card {
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: var(--space-4);
}

/* 호버 가능한 카드 */
.card-interactive {
  cursor: pointer;
  transition: all 0.15s ease;
}
.card-interactive:hover {
  background: var(--color-bg-hover);
  border-color: var(--color-border-strong);
  transform: translateY(-2px);
}

/* 선택된 카드 */
.card-selected {
  border-color: var(--color-primary);
  background: var(--color-primary-soft);
}

/* 글래스모피즘 카드 */
.card-glass {
  background: var(--color-surface);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--color-surface-border);
}

/* 이미지 카드 */
.card-image {
  padding: 0;
  overflow: hidden;
}
.card-image img {
  width: 100%;
  height: auto;
  display: block;
}
.card-image .card-content {
  padding: var(--space-3);
}
```

### 6.4 탭

```css
/* 탭 컨테이너 */
.tabs {
  display: flex;
  gap: var(--space-1);
  background: var(--color-bg-secondary);
  padding: var(--space-1);
  border-radius: 8px;
}

/* 탭 아이템 */
.tab {
  padding: 8px 16px;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.tab:hover {
  color: var(--color-text-primary);
  background: var(--color-bg-hover);
}

.tab.active {
  color: var(--color-text-inverse);
  background: var(--color-primary);
}

/* 아이콘 탭 */
.tab-icon {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

/* 언더라인 스타일 탭 */
.tabs-underline {
  background: transparent;
  border-bottom: 1px solid var(--color-border);
  padding: 0;
  gap: var(--space-4);
}
.tabs-underline .tab {
  border-radius: 0;
  padding: 12px 4px;
  margin-bottom: -1px;
}
.tabs-underline .tab.active {
  background: transparent;
  color: var(--color-primary);
  border-bottom: 2px solid var(--color-primary);
}
```

### 6.5 모달

```css
/* 오버레이 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.15s ease;
}

/* 모달 컨테이너 */
.modal {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  max-height: 85vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.2s ease;
}

/* 모달 헤더 */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-5) var(--space-6);
  border-bottom: 1px solid var(--color-border);
}

.modal-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
}

/* 모달 본문 */
.modal-body {
  padding: var(--space-6);
  overflow-y: auto;
  flex: 1;
}

/* 모달 푸터 */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--color-border);
  background: var(--color-bg-tertiary);
}

/* 큰 모달 (이미지 확대용) */
.modal-lg {
  max-width: 900px;
}

/* 전체 화면 모달 */
.modal-fullscreen {
  width: 100%;
  max-width: 100%;
  height: 100vh;
  max-height: 100vh;
  border-radius: 0;
}
```

### 6.6 배지 / 태그

```css
/* 기본 배지 */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  border-radius: 4px;
  background: var(--color-bg-hover);
  color: var(--color-text-secondary);
}

/* 컬러 배지 */
.badge-primary {
  background: var(--color-primary-soft);
  color: var(--color-primary);
}
.badge-success {
  background: var(--color-success-bg);
  color: var(--color-success);
}
.badge-warning {
  background: var(--color-warning-bg);
  color: var(--color-warning);
}
.badge-error {
  background: var(--color-error-bg);
  color: var(--color-error);
}

/* 라벨 배지 (A, B, C 영역 표시) */
.badge-label {
  min-width: 24px;
  height: 24px;
  padding: 0;
  border-radius: 6px;
  justify-content: center;
  font-weight: var(--font-bold);
  background: var(--color-primary);
  color: var(--color-text-inverse);
}
```

### 6.7 툴팁

```css
/* 툴팁 컨테이너 */
.tooltip-wrapper {
  position: relative;
}

.tooltip {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 12px;
  font-size: var(--text-xs);
  color: var(--color-text-primary);
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  white-space: nowrap;
  z-index: 100;
  opacity: 0;
  visibility: hidden;
  transition: all 0.15s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* 화살표 */
.tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: var(--color-bg-elevated);
}

.tooltip-wrapper:hover .tooltip {
  opacity: 1;
  visibility: visible;
}
```

---

## 7. 특수 컴포넌트 스타일

### 7.1 이미지 썸네일 그리드

```css
/* 썸네일 그리드 컨테이너 */
.thumbnail-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-2);
}

/* 썸네일 아이템 */
.thumbnail {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.15s ease;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail:hover {
  border-color: var(--color-border-strong);
}

.thumbnail.selected {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-primary-soft);
}

/* 썸네일 오버레이 (삭제 버튼 등) */
.thumbnail-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.15s ease;
}

.thumbnail:hover .thumbnail-overlay {
  opacity: 1;
}

/* 번호 배지 */
.thumbnail-number {
  position: absolute;
  top: 4px;
  left: 4px;
  width: 20px;
  height: 20px;
  background: var(--color-primary);
  color: var(--color-text-inverse);
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 추가 버튼 (+ 아이콘) */
.thumbnail-add {
  background: var(--color-bg-tertiary);
  border: 2px dashed var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  font-size: 24px;
}

.thumbnail-add:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: var(--color-primary-soft);
}
```

### 7.2 Linear 스타일 편집 히스토리

```css
/* 히스토리 타임라인 */
.edit-history {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* 히스토리 아이템 */
.history-item {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-3) 0;
  cursor: pointer;
  transition: background 0.15s ease;
  position: relative;
}

.history-item:hover {
  background: var(--color-bg-hover);
  margin: 0 calc(var(--space-3) * -1);
  padding-left: var(--space-3);
  padding-right: var(--space-3);
  border-radius: 6px;
}

/* 타임라인 라인 */
.history-item::before {
  content: '';
  position: absolute;
  left: 11px;
  top: 32px;
  bottom: -12px;
  width: 2px;
  background: var(--color-border);
}

.history-item:last-child::before {
  display: none;
}

/* 상태 아이콘 */
.history-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 12px;
  position: relative;
  z-index: 1;
}

.history-icon.applied {
  background: var(--color-success);
  color: white;
}

.history-icon.pending {
  background: var(--color-warning);
  color: var(--color-text-inverse);
  animation: pulse 1.5s infinite;
}

.history-icon.error {
  background: var(--color-error);
  color: white;
}

/* 히스토리 내용 */
.history-content {
  flex: 1;
  min-width: 0;
}

.history-title {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-primary);
  margin-bottom: 2px;
}

.history-desc {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.history-time {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  flex-shrink: 0;
}
```

### 7.3 프롬프트 미리보기 박스

```css
/* 미리보기 컨테이너 */
.prompt-preview {
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
}

/* 미리보기 헤더 (탭) */
.preview-tabs {
  display: flex;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg-secondary);
}

.preview-tab {
  padding: 10px 16px;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  background: transparent;
  border: none;
  cursor: pointer;
}

.preview-tab.active {
  color: var(--color-primary);
  box-shadow: inset 0 -2px 0 var(--color-primary);
}

/* 미리보기 본문 */
.preview-content {
  padding: var(--space-4);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
  color: var(--color-text-secondary);
  max-height: 200px;
  overflow-y: auto;
}

/* 복사 버튼 */
.preview-copy {
  position: absolute;
  top: var(--space-2);
  right: var(--space-2);
}
```

### 7.4 Thinking 모드 표시

```css
/* Thinking 모드 활성화 시 프롬프트 영역 */
.builder-area.thinking-active {
  position: relative;
}

.builder-area.thinking-active::before {
  content: '';
  position: absolute;
  inset: 0;
  border: 2px solid var(--color-primary);
  border-radius: 12px;
  pointer-events: none;
  animation: thinking-glow 2s ease-in-out infinite;
}

@keyframes thinking-glow {
  0%, 100% {
    box-shadow: 0 0 10px var(--color-primary-glow),
                inset 0 0 10px var(--color-primary-glow);
    opacity: 0.5;
  }
  50% {
    box-shadow: 0 0 25px var(--color-primary-glow),
                inset 0 0 25px var(--color-primary-glow);
    opacity: 1;
  }
}

/* Thinking 토글 스위치 */
.thinking-toggle {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: 6px 12px;
  background: var(--color-bg-tertiary);
  border-radius: 20px;
  cursor: pointer;
}

.thinking-toggle.active {
  background: var(--color-primary-soft);
}

.thinking-toggle .toggle-track {
  width: 36px;
  height: 20px;
  background: var(--color-bg-hover);
  border-radius: 10px;
  position: relative;
  transition: background 0.2s ease;
}

.thinking-toggle.active .toggle-track {
  background: var(--color-primary);
}

.thinking-toggle .toggle-thumb {
  width: 16px;
  height: 16px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: transform 0.2s ease;
}

.thinking-toggle.active .toggle-thumb {
  transform: translateX(16px);
}
```

### 7.5 캔버스 마킹 에디터

```css
/* 마킹 에디터 컨테이너 */
.marking-editor {
  position: relative;
  background: var(--color-bg-primary);
  border-radius: 8px;
  overflow: hidden;
}

/* 캔버스 영역 */
.marking-canvas {
  width: 100%;
  aspect-ratio: 16/9;
  background: #1a1a1a;
  position: relative;
}

/* 마킹 영역 */
.marking-region {
  position: absolute;
  border: 2px dashed var(--color-primary);
  background: var(--color-primary-soft);
  cursor: move;
  transition: border-color 0.15s ease;
}

.marking-region:hover,
.marking-region.selected {
  border-style: solid;
  border-width: 3px;
}

/* 리사이즈 핸들 */
.marking-region .resize-handle {
  position: absolute;
  width: 10px;
  height: 10px;
  background: var(--color-primary);
  border-radius: 2px;
}

.resize-handle.nw { top: -5px; left: -5px; cursor: nw-resize; }
.resize-handle.ne { top: -5px; right: -5px; cursor: ne-resize; }
.resize-handle.sw { bottom: -5px; left: -5px; cursor: sw-resize; }
.resize-handle.se { bottom: -5px; right: -5px; cursor: se-resize; }

/* 라벨 표시 */
.marking-label {
  position: absolute;
  top: -28px;
  left: 0;
  padding: 2px 8px;
  background: var(--color-primary);
  color: var(--color-text-inverse);
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  border-radius: 4px 4px 0 0;
}

/* 마킹 리스트 */
.marking-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-4);
  max-height: 200px;
  overflow-y: auto;
}

.marking-list-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  background: var(--color-bg-tertiary);
  border-radius: 6px;
}

.marking-list-item .label-badge {
  width: 28px;
  height: 28px;
  background: var(--color-primary);
  color: var(--color-text-inverse);
  font-weight: var(--font-bold);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

---

## 8. 애니메이션 및 트랜지션

### 8.1 기본 트랜지션

```css
:root {
  /* 이징 함수 */
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);

  /* 듀레이션 */
  --duration-fast: 0.1s;
  --duration-normal: 0.15s;
  --duration-slow: 0.3s;
  --duration-slower: 0.5s;
}

/* 유틸리티 클래스 */
.transition-all {
  transition: all var(--duration-normal) var(--ease-default);
}

.transition-colors {
  transition: color var(--duration-normal) var(--ease-default),
              background-color var(--duration-normal) var(--ease-default),
              border-color var(--duration-normal) var(--ease-default);
}

.transition-transform {
  transition: transform var(--duration-normal) var(--ease-default);
}
```

### 8.2 키프레임 애니메이션

```css
/* 페이드 인 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 슬라이드 업 */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 슬라이드 다운 */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 스케일 인 */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 펄스 (로딩) */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* 스피너 */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Shimmer (스켈레톤) */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* 바나나 흔들림 (버튼 클릭) */
@keyframes shake {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-5deg); }
  75% { transform: rotate(5deg); }
}

/* 파티클 효과 (성공 시) */
@keyframes confetti {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-100px) scale(0);
  }
}
```

### 8.3 애니메이션 적용 클래스

```css
/* 애니메이션 클래스 */
.animate-fadeIn { animation: fadeIn var(--duration-normal) var(--ease-out); }
.animate-slideUp { animation: slideUp var(--duration-slow) var(--ease-out); }
.animate-scaleIn { animation: scaleIn var(--duration-normal) var(--ease-out); }
.animate-pulse { animation: pulse 1.5s var(--ease-default) infinite; }
.animate-spin { animation: spin 1s linear infinite; }
.animate-shake { animation: shake 0.3s var(--ease-bounce); }

/* 스켈레톤 로딩 */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-bg-tertiary) 0%,
    var(--color-bg-hover) 50%,
    var(--color-bg-tertiary) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-text {
  height: 14px;
  margin-bottom: 8px;
}

.skeleton-image {
  aspect-ratio: 1;
  border-radius: 8px;
}
```

---

## 9. 그림자 및 깊이 시스템

### 9.1 그림자 레벨

```css
:root {
  /* 그림자 레벨 */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.4);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.5);

  /* 특수 그림자 */
  --shadow-glow-primary: 0 0 20px var(--color-primary-glow);
  --shadow-glow-success: 0 0 20px rgba(0, 214, 143, 0.4);
  --shadow-glow-error: 0 0 20px rgba(255, 71, 87, 0.4);

  /* 인셋 그림자 */
  --shadow-inset: inset 0 2px 4px rgba(0, 0, 0, 0.3);
}
```

### 9.2 Z-Index 레이어

```css
:root {
  --z-base: 0;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-overlay: 300;
  --z-modal: 400;
  --z-popover: 500;
  --z-tooltip: 600;
  --z-toast: 700;
}
```

---

## 10. 아이콘 시스템

### 10.1 아이콘 크기

```css
:root {
  --icon-xs: 12px;
  --icon-sm: 16px;
  --icon-md: 20px;
  --icon-lg: 24px;
  --icon-xl: 32px;
}
```

### 10.2 주요 사용 아이콘 (이모지 기반)

| 용도 | 아이콘 | 대체 SVG 권장 |
|------|--------|--------------|
| 앱 로고 | 🍌 | 커스텀 바나나 SVG |
| 탐색 모드 | 🔍 | Search |
| 정제 모드 | ✨ | Sparkles |
| 최종 모드 | 📸 | Camera |
| Thinking | 🧠 | Brain |
| 설정 | ⚙️ | Settings |
| 도움말 | ❓ | HelpCircle |
| 팁 | 💡 | Lightbulb |
| 복사 | 📋 | Copy |
| 다운로드 | ⬇️ | Download |
| 삭제 | 🗑️ | Trash |
| 추가 | ➕ | Plus |
| 닫기 | ✕ | X |
| 체크 | ✓ | Check |
| 경고 | ⚠️ | AlertTriangle |
| 오류 | ❌ | XCircle |
| 성공 | ✅ | CheckCircle |
| 로딩 | ⏳ | Loader |
| 이미지 | 🖼️ | Image |
| 캔버스 | 📐 | Square |
| 마킹 | 🎯 | Target |

### 10.3 아이콘 버튼 스타일

```css
/* 아이콘 컨테이너 */
.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* 아이콘 크기 클래스 */
.icon-xs { width: var(--icon-xs); height: var(--icon-xs); font-size: var(--icon-xs); }
.icon-sm { width: var(--icon-sm); height: var(--icon-sm); font-size: var(--icon-sm); }
.icon-md { width: var(--icon-md); height: var(--icon-md); font-size: var(--icon-md); }
.icon-lg { width: var(--icon-lg); height: var(--icon-lg); font-size: var(--icon-lg); }
.icon-xl { width: var(--icon-xl); height: var(--icon-xl); font-size: var(--icon-xl); }
```

---

## 11. 로딩 상태 UI

### 11.1 스피너

```css
/* 기본 스피너 */
.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.spinner-sm { width: 14px; height: 14px; border-width: 1.5px; }
.spinner-lg { width: 32px; height: 32px; border-width: 3px; }
```

### 11.2 스켈레톤 카드

```html
<!-- 이미지 생성 중 스켈레톤 -->
<div class="skeleton-card">
  <div class="skeleton skeleton-image"></div>
  <div class="skeleton-content">
    <div class="skeleton skeleton-text" style="width: 80%"></div>
    <div class="skeleton skeleton-text" style="width: 60%"></div>
  </div>
</div>
```

```css
.skeleton-card {
  background: var(--color-bg-tertiary);
  border-radius: 12px;
  overflow: hidden;
  padding: var(--space-4);
}

.skeleton-content {
  margin-top: var(--space-3);
}
```

### 11.3 전체 페이지 로딩

```css
.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(13, 13, 13, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  z-index: var(--z-overlay);
}

.loading-text {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
  animation: pulse 1.5s infinite;
}
```

---

## 12. 토스트 / 알림

### 12.1 토스트 스타일

```css
/* 토스트 컨테이너 */
.toast-container {
  position: fixed;
  bottom: var(--space-6);
  right: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  z-index: var(--z-toast);
}

/* 토스트 아이템 */
.toast {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  box-shadow: var(--shadow-lg);
  animation: slideUp var(--duration-slow) var(--ease-out);
  max-width: 400px;
}

/* 토스트 타입 */
.toast-success {
  border-left: 4px solid var(--color-success);
}
.toast-error {
  border-left: 4px solid var(--color-error);
}
.toast-warning {
  border-left: 4px solid var(--color-warning);
}
.toast-info {
  border-left: 4px solid var(--color-info);
}

/* 토스트 내용 */
.toast-message {
  flex: 1;
  font-size: var(--text-sm);
  color: var(--color-text-primary);
}

/* 닫기 버튼 */
.toast-close {
  padding: 4px;
  color: var(--color-text-muted);
  cursor: pointer;
}
.toast-close:hover {
  color: var(--color-text-primary);
}
```

---

## 13. 드래그 앤 드롭 영역

```css
/* 드롭존 */
.dropzone {
  border: 2px dashed var(--color-border);
  border-radius: 12px;
  padding: var(--space-8);
  text-align: center;
  cursor: pointer;
  transition: all 0.15s ease;
}

.dropzone-icon {
  font-size: 48px;
  margin-bottom: var(--space-4);
  opacity: 0.5;
}

.dropzone-text {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
}

.dropzone-hint {
  color: var(--color-text-muted);
  font-size: var(--text-xs);
  margin-top: var(--space-2);
}

/* 호버 상태 */
.dropzone:hover {
  border-color: var(--color-primary);
  background: var(--color-primary-soft);
}

/* 드래그 오버 상태 */
.dropzone.drag-over {
  border-color: var(--color-primary);
  border-style: solid;
  background: var(--color-primary-soft);
  transform: scale(1.02);
}
```

---

## 14. 헤더 및 네비게이션

### 14.1 앱 헤더

```css
/* 헤더 */
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-5);
  background: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border);
  height: 56px;
}

/* 로고 영역 */
.header-logo {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.logo-icon {
  font-size: 28px;
}

.logo-text {
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
}

.logo-text span {
  color: var(--color-primary);
}

/* 헤더 센터 (작업 모드) */
.header-center {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

/* 헤더 우측 (액션 버튼) */
.header-actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
```

### 14.2 툴바 (카테고리/템플릿 탭)

```css
/* 툴바 */
.toolbar {
  display: flex;
  align-items: center;
  padding: 0 var(--space-5);
  background: var(--color-bg-tertiary);
  border-bottom: 1px solid var(--color-border);
  height: 48px;
  overflow-x: auto;
}

/* 카테고리 드롭다운 */
.category-select {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: var(--color-bg-hover);
  border-radius: 6px;
  cursor: pointer;
  margin-right: var(--space-4);
}

/* 템플릿 탭 스크롤 영역 */
.template-tabs {
  display: flex;
  gap: var(--space-1);
  flex: 1;
  overflow-x: auto;
  scrollbar-width: none;
}

.template-tabs::-webkit-scrollbar {
  display: none;
}
```

---

## 15. 푸터

```css
/* 푸터 */
.app-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-5);
  background: var(--color-bg-secondary);
  border-top: 1px solid var(--color-border);
  height: 32px;
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

/* 상태 표시 */
.footer-status {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-success);
}

.status-dot.error {
  background: var(--color-error);
}

.status-dot.warning {
  background: var(--color-warning);
  animation: pulse 1s infinite;
}

/* API 사용량 */
.footer-usage {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
```

---

## 16. 접근성 고려사항

### 16.1 포커스 스타일

```css
/* 기본 포커스 아웃라인 */
*:focus {
  outline: none;
}

*:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* 버튼 포커스 */
.btn:focus-visible {
  box-shadow: 0 0 0 3px var(--color-primary-soft);
}

/* 입력 필드 포커스 */
.input:focus-visible {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-soft);
}
```

### 16.2 스크린 리더 전용 텍스트

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### 16.3 모션 감소 설정

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 17. 유틸리티 클래스

```css
/* 디스플레이 */
.hidden { display: none !important; }
.block { display: block; }
.flex { display: flex; }
.grid { display: grid; }
.inline-flex { display: inline-flex; }

/* Flexbox */
.flex-col { flex-direction: column; }
.flex-1 { flex: 1; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.gap-1 { gap: var(--space-1); }
.gap-2 { gap: var(--space-2); }
.gap-3 { gap: var(--space-3); }
.gap-4 { gap: var(--space-4); }

/* 여백 */
.m-0 { margin: 0; }
.mt-2 { margin-top: var(--space-2); }
.mt-4 { margin-top: var(--space-4); }
.mb-2 { margin-bottom: var(--space-2); }
.mb-4 { margin-bottom: var(--space-4); }

.p-0 { padding: 0; }
.p-2 { padding: var(--space-2); }
.p-4 { padding: var(--space-4); }

/* 텍스트 정렬 */
.text-left { text-align: left; }
.text-center { text-align: center; }
.text-right { text-align: right; }

/* 텍스트 색상 */
.text-primary { color: var(--color-text-primary); }
.text-secondary { color: var(--color-text-secondary); }
.text-muted { color: var(--color-text-muted); }
.text-accent { color: var(--color-primary); }

/* 너비 */
.w-full { width: 100%; }

/* 오버플로우 */
.overflow-hidden { overflow: hidden; }
.overflow-auto { overflow: auto; }

/* 커서 */
.cursor-pointer { cursor: pointer; }
.cursor-not-allowed { cursor: not-allowed; }

/* 불투명도 */
.opacity-50 { opacity: 0.5; }
.opacity-75 { opacity: 0.75; }

/* 테두리 */
.rounded { border-radius: 8px; }
.rounded-lg { border-radius: 12px; }
.rounded-full { border-radius: 9999px; }

/* 트렁케이트 */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

---

## 18. 다크/라이트 모드 (옵션)

> 기본은 다크 모드이나, 추후 라이트 모드 지원 시 사용

```css
/* 라이트 모드 */
@media (prefers-color-scheme: light) {
  :root.auto-theme {
    --color-bg-primary: #FFFFFF;
    --color-bg-secondary: #F8F9FA;
    --color-bg-tertiary: #F1F3F4;
    --color-bg-elevated: #FFFFFF;
    --color-bg-hover: #E8EAED;
    
    --color-text-primary: #202124;
    --color-text-secondary: #5F6368;
    --color-text-muted: #9AA0A6;
    
    --color-border: rgba(0, 0, 0, 0.1);
    --color-border-strong: rgba(0, 0, 0, 0.2);
    
    --color-surface: rgba(255, 255, 255, 0.9);
    --color-surface-border: rgba(0, 0, 0, 0.08);
  }
}

/* 수동 라이트 모드 클래스 */
.theme-light {
  /* 위와 동일한 변수 오버라이드 */
}
```

---

## 부록 A: 전체 CSS 리셋

```css
/* CSS Reset */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-sans);
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  color: var(--color-text-primary);
  background: var(--color-bg-primary);
}

img, video {
  max-width: 100%;
  height: auto;
  display: block;
}

button {
  font-family: inherit;
  font-size: inherit;
  cursor: pointer;
  background: none;
  border: none;
}

input, textarea, select {
  font-family: inherit;
  font-size: inherit;
}

a {
  color: inherit;
  text-decoration: none;
}

ul, ol {
  list-style: none;
}

/* 스크롤바 스타일 (다크 테마) */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--color-bg-secondary);
}

::-webkit-scrollbar-thumb {
  background: var(--color-bg-hover);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-border-strong);
}
```

---

## 부록 B: 주요 컴포넌트 HTML 구조 예시

### B.1 버튼 그룹

```html
<div class="btn-group flex gap-2">
  <button class="btn btn-secondary">📋 복사</button>
  <button class="btn btn-secondary">🔄 초기화</button>
  <button class="btn btn-primary btn-lg">🎨 이미지 생성</button>
</div>
```

### B.2 필드 그룹

```html
<div class="field-group">
  <label class="field-label">
    주제 (Subject) <span class="required">*</span>
  </label>
  <textarea 
    class="input textarea" 
    placeholder="예: 파란색 발광 광학기를 가진 금욕적인 로봇 바리스타"
  ></textarea>
  <span class="field-hint">💡 구체적으로 작성하세요.</span>
</div>
```

### B.3 카드 그리드

```html
<div class="thumbnail-grid">
  <div class="thumbnail selected">
    <span class="thumbnail-number">1</span>
    <img src="..." alt="첨부 이미지 1">
    <div class="thumbnail-overlay">
      <button class="btn btn-icon btn-ghost">🗑️</button>
    </div>
  </div>
  <div class="thumbnail">
    <span class="thumbnail-number">2</span>
    <img src="..." alt="첨부 이미지 2">
  </div>
  <div class="thumbnail thumbnail-add">+</div>
</div>
```

### B.4 모달

```html
<div class="modal-overlay">
  <div class="modal">
    <div class="modal-header">
      <h3 class="modal-title">⚙️ API 설정</h3>
      <button class="btn btn-icon btn-ghost">✕</button>
    </div>
    <div class="modal-body">
      <!-- 내용 -->
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary">취소</button>
      <button class="btn btn-primary">저장</button>
    </div>
  </div>
</div>
```

---

**문서 끝**

> 이 명세서는 Claude Code 및 개발 에이전트가 일관된 디자인을 구현할 수 있도록  
> 모든 시각적 요소의 상세 스펙을 포함합니다.  
> 구현 시 이 문서의 CSS 변수와 클래스명을 그대로 사용하세요.
