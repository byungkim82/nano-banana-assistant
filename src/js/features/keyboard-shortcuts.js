// ===== KEYBOARD SHORTCUTS MODULE =====

import { state } from '../state.js';
import { TEMPLATES } from '../templates.js';

// 단축키 정의
export const SHORTCUTS = {
  'ctrl+enter': {
    key: 'Enter',
    ctrl: true,
    action: 'generate',
    description: '이미지 생성',
    category: 'general'
  },
  'ctrl+c': {
    key: 'c',
    ctrl: true,
    action: 'copy',
    description: '프롬프트 복사',
    category: 'builder',
    context: 'builder'
  },
  'ctrl+r': {
    key: 'r',
    ctrl: true,
    action: 'reset',
    description: '폼 초기화',
    category: 'builder'
  },
  'ctrl+s': {
    key: 's',
    ctrl: true,
    action: 'saveApi',
    description: 'API 키 저장',
    category: 'settings',
    context: 'settingsModal'
  },
  'ctrl+1': {
    key: '1',
    ctrl: true,
    action: 'template1',
    description: '템플릿 1 (기본)',
    category: 'template'
  },
  'ctrl+2': {
    key: '2',
    ctrl: true,
    action: 'template2',
    description: '템플릿 2 (포토)',
    category: 'template'
  },
  'ctrl+3': {
    key: '3',
    ctrl: true,
    action: 'template3',
    description: '템플릿 3 (타이포)',
    category: 'template'
  },
  'ctrl+4': {
    key: '4',
    ctrl: true,
    action: 'template4',
    description: '템플릿 4 (로고)',
    category: 'template'
  },
  'ctrl+5': {
    key: '5',
    ctrl: true,
    action: 'template5',
    description: '템플릿 5 (명암)',
    category: 'template'
  },
  'ctrl+6': {
    key: '6',
    ctrl: true,
    action: 'template6',
    description: '템플릿 6 (제품)',
    category: 'template'
  },
  'escape': {
    key: 'Escape',
    ctrl: false,
    action: 'closeModal',
    description: '모달 닫기',
    category: 'general'
  },
  'question': {
    key: '?',
    ctrl: false,
    shift: true,
    action: 'showHelp',
    description: '단축키 안내',
    category: 'general'
  }
};

// 템플릿 ID 배열
const templateIds = Object.keys(TEMPLATES);

// 단축키 핸들러
function handleShortcut(action) {
  switch (action) {
    case 'generate':
      if (window.generateImage) {
        window.generateImage();
      }
      break;

    case 'copy':
      if (window.copyPrompt) {
        window.copyPrompt();
      }
      break;

    case 'reset':
      if (window.resetForm) {
        window.resetForm();
      }
      break;

    case 'saveApi':
      const settingsModal = document.getElementById('settingsModal');
      if (settingsModal && !settingsModal.classList.contains('hidden')) {
        if (window.saveApiKey) {
          window.saveApiKey();
        }
      }
      break;

    case 'template1':
    case 'template2':
    case 'template3':
    case 'template4':
    case 'template5':
    case 'template6':
      const index = parseInt(action.replace('template', '')) - 1;
      if (templateIds[index] && window.handleTemplateChange) {
        window.handleTemplateChange(templateIds[index]);
      }
      break;

    case 'closeModal':
      closeAllModals();
      break;

    case 'showHelp':
      if (window.openHelp) {
        window.openHelp();
      }
      break;
  }
}

// 모든 모달 닫기
function closeAllModals() {
  if (window.closeSettingsModal) window.closeSettingsModal();
  if (window.closeImageModal) window.closeImageModal();
  if (window.closePromptHistory) window.closePromptHistory();
  if (window.closeCanvasGenerator) window.closeCanvasGenerator();
  if (window.closeTemplateEditor) window.closeTemplateEditor();
  if (window.closeHelp) window.closeHelp();
}

// 단축키 초기화
export function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // 입력 필드에서는 일부 단축키 비활성화
    const isInputFocused = document.activeElement.matches('input, textarea, select');

    // ESC는 항상 동작
    if (e.key === 'Escape') {
      handleShortcut('closeModal');
      return;
    }

    // 입력 필드에서는 Ctrl+Enter, Ctrl+S만 동작
    if (isInputFocused) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleShortcut('generate');
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleShortcut('saveApi');
        return;
      }
      return;
    }

    // ? 키로 도움말
    if (e.key === '?' && e.shiftKey) {
      e.preventDefault();
      handleShortcut('showHelp');
      return;
    }

    // Ctrl/Cmd 단축키
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'Enter':
          e.preventDefault();
          handleShortcut('generate');
          break;
        case 'c':
          // 기본 복사 동작은 유지하되, 선택된 텍스트가 없을 때만 프롬프트 복사
          if (!window.getSelection().toString()) {
            e.preventDefault();
            handleShortcut('copy');
          }
          break;
        case 'r':
          e.preventDefault();
          handleShortcut('reset');
          break;
        case 's':
          e.preventDefault();
          handleShortcut('saveApi');
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
          e.preventDefault();
          handleShortcut('template' + e.key);
          break;
      }
    }

    // Arrow 키 (이미지 모달 네비게이션)
    if (state.imageModalIndex >= 0) {
      if (e.key === 'ArrowLeft') {
        if (window.navigateImageModal) {
          window.navigateImageModal(-1);
        }
      } else if (e.key === 'ArrowRight') {
        if (window.navigateImageModal) {
          window.navigateImageModal(1);
        }
      }
    }
  });
}

// 단축키 목록 반환 (도움말용)
export function getShortcutsList() {
  const list = [];
  for (const [id, shortcut] of Object.entries(SHORTCUTS)) {
    let keyCombo = '';
    if (shortcut.ctrl) keyCombo += 'Ctrl+';
    if (shortcut.shift) keyCombo += 'Shift+';
    keyCombo += shortcut.key.toUpperCase();

    list.push({
      id,
      keyCombo,
      description: shortcut.description,
      category: shortcut.category
    });
  }
  return list;
}
