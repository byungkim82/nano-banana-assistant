// ===== TIPS SYSTEM MODULE =====

import { state } from '../state.js';
import { saveToLocalStorage, loadFromLocalStorage } from '../storage.js';
import { STORAGE_KEYS } from '../config.js';

// 팁 정의
const TIPS = {
  complexScene: {
    id: 'complexScene',
    title: 'Thinking 모드 권장',
    message: '복잡한 장면이나 여러 요소가 포함된 이미지는 Thinking 모드를 활성화하면 더 정확한 결과를 얻을 수 있습니다.',
    trigger: 'promptLength',
    threshold: 200,
    position: 'bottom'
  },
  textRendering: {
    id: 'textRendering',
    title: '텍스트 렌더링 팁',
    message: '텍스트 렌더링은 25자 이하가 권장됩니다. 긴 텍스트는 여러 이미지로 나누어 생성하세요.',
    trigger: 'template',
    templateId: 'typography',
    position: 'bottom'
  },
  productPhoto: {
    id: 'productPhoto',
    title: '제품 사진 팁',
    message: '제품 사진은 흰색 또는 단색 배경에서 가장 좋은 결과를 얻을 수 있습니다.',
    trigger: 'template',
    templateId: 'productLifestyle',
    position: 'bottom'
  },
  imageAttachment: {
    id: 'imageAttachment',
    title: '참조 이미지 활용',
    message: '참조 이미지를 첨부하면 스타일이나 구도를 더 정확하게 재현할 수 있습니다.',
    trigger: 'noImages',
    position: 'bottom'
  },
  workMode: {
    id: 'workMode',
    title: '작업 모드 선택',
    message: '탐색 모드(512px)로 빠르게 아이디어를 테스트하고, 만족스러운 결과가 나오면 최종 모드로 고해상도 이미지를 생성하세요.',
    trigger: 'firstGeneration',
    position: 'top'
  },
  editSession: {
    id: 'editSession',
    title: '대화식 편집 모드',
    message: '생성된 이미지를 기반으로 수정 요청을 할 수 있습니다. "조금 더 밝게", "배경을 파란색으로" 등 자연어로 요청하세요.',
    trigger: 'imageGenerated',
    position: 'bottom'
  }
};

// 현재 표시 중인 팁
let currentTip = null;
let tipTimeout = null;

// 팁 설정 로드
export function loadTipsSettings() {
  const showTips = loadFromLocalStorage(STORAGE_KEYS.SHOW_TIPS);
  const dismissedTips = loadFromLocalStorage(STORAGE_KEYS.DISMISSED_TIPS);

  state.showTips = showTips !== false; // 기본값 true
  state.dismissedTips = dismissedTips || [];
}

// 팁 설정 저장
function saveTipsSettings() {
  saveToLocalStorage(STORAGE_KEYS.SHOW_TIPS, state.showTips);
  saveToLocalStorage(STORAGE_KEYS.DISMISSED_TIPS, state.dismissedTips);
}

// 팁 표시 여부 토글
export function toggleTips() {
  state.showTips = !state.showTips;
  saveTipsSettings();

  if (!state.showTips && currentTip) {
    hideTip();
  }

  return state.showTips;
}

// 팁 표시
export function showTip(tipId, targetElement = null) {
  if (!state.showTips) return;
  if (state.dismissedTips.includes(tipId)) return;

  const tip = TIPS[tipId];
  if (!tip) return;

  // 이전 팁 숨기기
  hideTip();

  // 팁 요소 생성
  const tipElement = document.createElement('div');
  tipElement.className = 'tip-popup';
  tipElement.id = 'currentTip';
  tipElement.innerHTML = `
    <div class="tip-header">
      <span class="tip-icon">💡</span>
      <span class="tip-title">${tip.title}</span>
      <button class="tip-close" onclick="dismissTip('${tipId}')" aria-label="팁 닫기">&times;</button>
    </div>
    <div class="tip-message">${tip.message}</div>
    <div class="tip-footer">
      <button class="tip-dismiss-all" onclick="disableAllTips()">모든 팁 끄기</button>
    </div>
  `;

  // 위치 계산
  if (targetElement) {
    const rect = targetElement.getBoundingClientRect();
    tipElement.style.position = 'fixed';

    if (tip.position === 'top') {
      tipElement.style.bottom = `${window.innerHeight - rect.top + 10}px`;
      tipElement.style.left = `${rect.left}px`;
    } else {
      tipElement.style.top = `${rect.bottom + 10}px`;
      tipElement.style.left = `${rect.left}px`;
    }
  } else {
    // 타겟이 없으면 화면 하단에 표시
    tipElement.style.position = 'fixed';
    tipElement.style.bottom = '20px';
    tipElement.style.right = '20px';
  }

  document.body.appendChild(tipElement);
  currentTip = { id: tipId, element: tipElement };

  // 애니메이션
  requestAnimationFrame(() => {
    tipElement.classList.add('visible');
  });

  // 자동 숨김 (10초)
  tipTimeout = setTimeout(() => {
    hideTip();
  }, 10000);
}

// 팁 숨기기
export function hideTip() {
  if (tipTimeout) {
    clearTimeout(tipTimeout);
    tipTimeout = null;
  }

  const tipElement = document.getElementById('currentTip');
  if (tipElement) {
    tipElement.classList.remove('visible');
    setTimeout(() => {
      tipElement.remove();
    }, 200);
  }

  currentTip = null;
}

// 팁 영구 닫기 (다시 표시 안 함)
export function dismissTip(tipId) {
  if (!state.dismissedTips.includes(tipId)) {
    state.dismissedTips.push(tipId);
    saveTipsSettings();
  }
  hideTip();
}

// 모든 팁 비활성화
export function disableAllTips() {
  state.showTips = false;
  saveTipsSettings();
  hideTip();
}

// 모든 팁 초기화
export function resetTips() {
  state.dismissedTips = [];
  state.showTips = true;
  saveTipsSettings();
}

// 조건에 따른 팁 트리거
export function triggerTip(trigger, context = {}) {
  if (!state.showTips) return;

  for (const [tipId, tip] of Object.entries(TIPS)) {
    if (state.dismissedTips.includes(tipId)) continue;

    switch (tip.trigger) {
      case 'promptLength':
        if (trigger === 'promptLength' && context.length >= tip.threshold) {
          showTip(tipId, context.element);
          return;
        }
        break;

      case 'template':
        if (trigger === 'template' && context.templateId === tip.templateId) {
          showTip(tipId, context.element);
          return;
        }
        break;

      case 'noImages':
        if (trigger === 'noImages' && (!state.attachedImages || state.attachedImages.length === 0)) {
          showTip(tipId, context.element);
          return;
        }
        break;

      case 'firstGeneration':
        if (trigger === 'firstGeneration' && !localStorage.getItem('nano_banana_first_gen_done')) {
          localStorage.setItem('nano_banana_first_gen_done', 'true');
          showTip(tipId, context.element);
          return;
        }
        break;

      case 'imageGenerated':
        if (trigger === 'imageGenerated') {
          showTip(tipId, context.element);
          return;
        }
        break;
    }
  }
}

// 팁 초기화
export function initTips() {
  loadTipsSettings();
}
