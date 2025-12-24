// ===== RESPONSIVE MODULE =====

import { state } from '../state.js';

// 현재 활성 패널
let activePanel = 'builder'; // 'attach' | 'builder' | 'result'

// 브레이크포인트
const MOBILE_BREAKPOINT = 767;

// 모바일 여부 확인
export function isMobile() {
  return window.innerWidth <= MOBILE_BREAKPOINT;
}

// 패널 전환
export function setActivePanel(panelId) {
  activePanel = panelId;

  // 패널 활성화
  const panels = document.querySelectorAll('.main-3col > .panel');
  panels.forEach((panel, index) => {
    const panelIds = ['attach', 'builder', 'result'];
    if (panelIds[index] === panelId) {
      panel.classList.add('mobile-active');
    } else {
      panel.classList.remove('mobile-active');
    }
  });

  // 네비게이션 버튼 활성화
  const navBtns = document.querySelectorAll('.mobile-nav-btn');
  navBtns.forEach(btn => {
    if (btn.dataset.panel === panelId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// 현재 활성 패널 반환
export function getActivePanel() {
  return activePanel;
}

// 반응형 초기화
export function initResponsive() {
  // 초기 상태 설정
  handleResize();

  // 리사이즈 이벤트 리스너
  window.addEventListener('resize', handleResize);

  // 모바일 네비게이션 이벤트 설정
  setupMobileNavigation();

  // 터치 스와이프 지원
  setupSwipeGestures();
}

// 리사이즈 핸들러
function handleResize() {
  const mobile = isMobile();

  if (mobile) {
    // 모바일 모드
    setActivePanel(activePanel);
  } else {
    // 데스크톱 모드 - 모든 패널 표시
    const panels = document.querySelectorAll('.main-3col > .panel');
    panels.forEach(panel => {
      panel.classList.remove('mobile-active');
    });
  }
}

// 모바일 네비게이션 설정
function setupMobileNavigation() {
  const navBtns = document.querySelectorAll('.mobile-nav-btn');
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const panelId = btn.dataset.panel;
      setActivePanel(panelId);
    });
  });
}

// 스와이프 제스처 설정
function setupSwipeGestures() {
  let touchStartX = 0;
  let touchEndX = 0;
  const SWIPE_THRESHOLD = 50;

  const mainArea = document.querySelector('.main-3col');
  if (!mainArea) return;

  mainArea.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  mainArea.addEventListener('touchend', (e) => {
    if (!isMobile()) return;

    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const diff = touchStartX - touchEndX;
    const panelOrder = ['attach', 'builder', 'result'];
    const currentIndex = panelOrder.indexOf(activePanel);

    if (Math.abs(diff) < SWIPE_THRESHOLD) return;

    if (diff > 0) {
      // 왼쪽으로 스와이프 → 다음 패널
      if (currentIndex < panelOrder.length - 1) {
        setActivePanel(panelOrder[currentIndex + 1]);
      }
    } else {
      // 오른쪽으로 스와이프 → 이전 패널
      if (currentIndex > 0) {
        setActivePanel(panelOrder[currentIndex - 1]);
      }
    }
  }
}

// 특정 패널로 이동 (외부에서 호출용)
export function navigateToPanel(panelId) {
  if (isMobile()) {
    setActivePanel(panelId);
  }
}
