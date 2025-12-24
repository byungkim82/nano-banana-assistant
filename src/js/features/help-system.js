// ===== HELP SYSTEM MODULE =====

import { getShortcutsList } from './keyboard-shortcuts.js';

// 도움말 콘텐츠
const HELP_CONTENT = {
  overview: {
    title: '앱 개요',
    content: `
      <h3>나노 바나나 프롬프트 어시스턴트</h3>
      <p>Google Gemini AI를 활용한 이미지 생성 도구입니다.</p>

      <h4>주요 기능</h4>
      <ul>
        <li><strong>템플릿 기반 프롬프트 빌더</strong> - 12개의 전문 템플릿으로 쉽게 프롬프트 작성</li>
        <li><strong>이미지 첨부</strong> - 참조 이미지를 첨부하여 더 정확한 결과 생성</li>
        <li><strong>자동 번역</strong> - 한글 프롬프트를 영어로 자동 번역</li>
        <li><strong>대화식 편집</strong> - 생성된 이미지를 기반으로 수정 요청</li>
        <li><strong>Thinking 모드</strong> - AI가 이미지 생성 전 논리적 검토 수행</li>
        <li><strong>사용자 정의 템플릿</strong> - 나만의 템플릿 생성 및 관리</li>
      </ul>
    `
  },
  templates: {
    title: '템플릿 사용법',
    content: `
      <h4>기본 템플릿 (6개)</h4>
      <ul>
        <li><strong>🎨 기본</strong> - 6요소 공식 (주제, 스타일, 분위기, 조명, 구도, 색상)</li>
        <li><strong>📷 포토</strong> - 사진 촬영 설정 (카메라, 렌즈, 조리개, 셔터 스피드)</li>
        <li><strong>🔤 타이포</strong> - 텍스트 레터링 (폰트, 크기, 색상, 레이아웃)</li>
        <li><strong>📐 로고 그리드</strong> - 8개 로고 변형 시리즈</li>
        <li><strong>🌗 명암법</strong> - 명암 대비 전문</li>
        <li><strong>🛍️ 제품</strong> - 제품 라이프스타일 촬영</li>
      </ul>

      <h4>템플릿 사용 방법</h4>
      <ol>
        <li>상단 탭에서 원하는 템플릿 선택</li>
        <li>각 필드에 내용 입력 (필수 필드는 * 표시)</li>
        <li>미리보기에서 생성된 프롬프트 확인</li>
        <li>"이미지 생성" 버튼 클릭</li>
      </ol>

      <h4>사용자 정의 템플릿</h4>
      <p>"➕ 새 템플릿" 버튼으로 나만의 템플릿을 만들 수 있습니다.</p>
    `
  },
  shortcuts: {
    title: '키보드 단축키',
    content: '' // 동적으로 생성
  },
  tips: {
    title: '이미지 생성 팁',
    content: `
      <h4>더 나은 결과를 위한 팁</h4>

      <h5>💡 프롬프트 작성</h5>
      <ul>
        <li>구체적이고 상세하게 설명할수록 좋습니다</li>
        <li>원하는 스타일, 분위기, 조명을 명확히 지정하세요</li>
        <li>텍스트 렌더링은 25자 이하가 권장됩니다</li>
      </ul>

      <h5>🧠 Thinking 모드 활용</h5>
      <ul>
        <li>다중 요소가 있는 복잡한 장면</li>
        <li>정확한 텍스트 렌더링이 필요한 경우</li>
        <li>물리적 정확성이 중요한 이미지</li>
        <li>여러 이미지의 일관성 유지가 필요한 경우</li>
      </ul>

      <h5>📸 작업 모드 선택</h5>
      <ul>
        <li><strong>탐색 모드</strong> - 빠른 아이디어 테스트용 (512px)</li>
        <li><strong>정제 모드</strong> - 세부 조정용 (1024px)</li>
        <li><strong>최종 모드</strong> - 프로덕션 출력용 (원본 해상도)</li>
      </ul>

      <h5>🖼️ 이미지 첨부</h5>
      <ul>
        <li>참조 이미지를 첨부하면 더 정확한 결과를 얻을 수 있습니다</li>
        <li>최대 14개까지 첨부 가능</li>
        <li>드래그 앤 드롭으로 쉽게 업로드</li>
      </ul>
    `
  },
  faq: {
    title: 'FAQ',
    content: `
      <h4>자주 묻는 질문</h4>

      <details>
        <summary>API 키는 어디서 발급받나요?</summary>
        <p><a href="https://aistudio.google.com/app/apikey" target="_blank">Google AI Studio</a>에서 무료로 발급받을 수 있습니다.</p>
      </details>

      <details>
        <summary>이미지가 생성되지 않아요</summary>
        <p>API 키가 올바르게 입력되었는지 확인하세요. 연결 테스트 버튼으로 API 상태를 확인할 수 있습니다.</p>
      </details>

      <details>
        <summary>"안전 필터에 의해 차단되었습니다" 오류가 나요</summary>
        <p>Gemini의 안전 필터가 특정 콘텐츠를 차단했습니다. 프롬프트를 수정해 주세요.</p>
      </details>

      <details>
        <summary>텍스트가 정확하게 렌더링되지 않아요</summary>
        <p>텍스트 렌더링은 25자 이하가 권장됩니다. Thinking 모드를 활성화하면 정확도가 높아집니다.</p>
      </details>

      <details>
        <summary>이전에 생성한 이미지를 다시 보고 싶어요</summary>
        <p>결과 패널의 히스토리 썸네일에서 이전 이미지를 확인할 수 있습니다. 프롬프트 히스토리 버튼(📜)을 클릭하면 이전 프롬프트도 볼 수 있습니다.</p>
      </details>

      <details>
        <summary>다크 모드를 사용하고 싶어요</summary>
        <p>헤더의 테마 토글 버튼(☀️/🌙)을 클릭하세요. 시스템 설정에 따라 자동으로 적용됩니다.</p>
      </details>
    `
  }
};

// 현재 탭
let currentTab = 'overview';

// 도움말 모달 열기
export function openHelp() {
  const modal = document.getElementById('helpModal');
  if (modal) {
    modal.classList.remove('hidden');
    renderHelpContent(currentTab);
  }
}

// 도움말 모달 닫기
export function closeHelp() {
  const modal = document.getElementById('helpModal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

// 도움말 탭 변경
export function setHelpTab(tab) {
  currentTab = tab;

  // 탭 버튼 활성화
  document.querySelectorAll('.help-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });

  renderHelpContent(tab);
}

// 도움말 콘텐츠 렌더링
function renderHelpContent(tab) {
  const container = document.getElementById('helpContent');
  if (!container) return;

  let content = HELP_CONTENT[tab]?.content || '';

  // 단축키 탭은 동적으로 생성
  if (tab === 'shortcuts') {
    content = generateShortcutsContent();
  }

  container.innerHTML = content;
}

// 단축키 콘텐츠 동적 생성
function generateShortcutsContent() {
  const shortcuts = getShortcutsList();

  const categories = {
    general: '일반',
    builder: '빌더',
    template: '템플릿',
    settings: '설정'
  };

  let html = '<h4>키보드 단축키</h4>';

  for (const [catId, catName] of Object.entries(categories)) {
    const catShortcuts = shortcuts.filter(s => s.category === catId);
    if (catShortcuts.length === 0) continue;

    html += `<h5>${catName}</h5><table class="shortcuts-table"><tbody>`;
    for (const shortcut of catShortcuts) {
      html += `
        <tr>
          <td><kbd>${shortcut.keyCombo}</kbd></td>
          <td>${shortcut.description}</td>
        </tr>
      `;
    }
    html += '</tbody></table>';
  }

  return html;
}
