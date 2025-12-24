// ===== RENDER TEMPLATES =====

import { TEMPLATES } from '../templates.js';
import { state } from '../state.js';
import { updatePromptPreview, updatePromptPreviewImmediate } from '../prompt-builder.js';

// 템플릿 탭 렌더링
export function renderTemplateTabs() {
  const container = document.getElementById('templateTabs');
  if (!container) return;

  container.innerHTML = '';

  // 기본 템플릿 렌더링
  Object.values(TEMPLATES).forEach(template => {
    const tab = document.createElement('button');
    tab.className = `template-tab ${state.currentTemplate === template.id ? 'active' : ''}`;
    tab.onclick = () => window.handleTemplateChange(template.id);
    tab.innerHTML = `
      <span class="icon">${template.icon}</span>
      <span>${template.name}</span>
    `;
    container.appendChild(tab);
  });

  // 커스텀 템플릿이 있으면 구분선과 커스텀 탭 추가
  if (Object.keys(state.customTemplates).length > 0) {
    const divider = document.createElement('div');
    divider.className = 'template-tab-divider';
    divider.innerHTML = '|';
    container.appendChild(divider);

    Object.values(state.customTemplates).forEach(template => {
      const tab = document.createElement('button');
      tab.className = `template-tab template-tab-custom ${state.currentTemplate === template.id ? 'active' : ''}`;
      tab.onclick = () => window.handleTemplateChange(template.id);
      tab.innerHTML = `
        <span class="icon">${template.icon}</span>
        <span>${template.name}</span>
      `;
      container.appendChild(tab);
    });
  }

  // "새 템플릿" 버튼
  const addBtn = document.createElement('button');
  addBtn.className = 'template-tab template-tab-add';
  addBtn.onclick = () => window.openTemplateEditor();
  addBtn.innerHTML = `
    <span class="icon">➕</span>
    <span>새 템플릿</span>
  `;
  container.appendChild(addBtn);
}

// 템플릿 필드 렌더링
export function renderTemplateFields() {
  const container = document.getElementById('templateForm');
  if (!container) return;

  // 기본 또는 커스텀 템플릿 가져오기
  const template = TEMPLATES[state.currentTemplate] || state.customTemplates[state.currentTemplate];

  if (!template) {
    container.innerHTML = '<p class="form-help">템플릿을 찾을 수 없습니다.</p>';
    return;
  }

  const values = state.fieldValues[state.currentTemplate];
  container.innerHTML = '';

  // 커스텀 템플릿인 경우 편집/삭제 버튼 표시
  if (template.isCustom) {
    const customActions = document.createElement('div');
    customActions.className = 'custom-template-actions';
    customActions.innerHTML = `
      <button class="btn btn-outline btn-sm" onclick="openTemplateEditor('${template.id}')">✏️ 편집</button>
      <button class="btn btn-outline btn-sm" onclick="duplicateTemplate('${template.id}')">📋 복제</button>
      <button class="btn btn-outline btn-sm" onclick="exportTemplate('${template.id}')">📤 내보내기</button>
      <button class="btn btn-outline btn-sm btn-danger" onclick="deleteCustomTemplate('${template.id}')">🗑️ 삭제</button>
    `;
    container.appendChild(customActions);
  } else {
    // 기본 템플릿 복제 버튼
    const duplicateBtn = document.createElement('div');
    duplicateBtn.className = 'template-duplicate-btn';
    duplicateBtn.innerHTML = `
      <button class="btn btn-outline btn-sm" onclick="duplicateTemplate('${template.id}')">📋 이 템플릿 복제하여 커스터마이즈</button>
    `;
    container.appendChild(duplicateBtn);
  }

  template.fields.forEach(field => {
    const group = document.createElement('div');
    group.className = 'form-group';

    // 라벨
    const label = document.createElement('label');
    label.className = 'form-label';
    label.innerHTML = field.label + (field.required ? ' <span class="required">*</span>' : '');
    group.appendChild(label);

    // 입력 필드 렌더링
    let input;

    switch (field.type) {
      case 'text':
        input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-input';
        input.placeholder = field.placeholder || '';
        input.value = values[field.id] || '';
        input.oninput = (e) => {
          state.fieldValues[state.currentTemplate][field.id] = e.target.value;
          updatePromptPreview();
        };
        break;

      case 'textarea':
        input = document.createElement('textarea');
        input.className = 'form-textarea';
        input.placeholder = field.placeholder || '';
        input.value = values[field.id] || '';
        input.oninput = (e) => {
          state.fieldValues[state.currentTemplate][field.id] = e.target.value;
          updatePromptPreview();
        };
        break;

      case 'select':
        input = document.createElement('select');
        input.className = 'form-select';
        field.options.forEach(opt => {
          const option = document.createElement('option');
          option.value = opt.value;
          option.textContent = opt.label;
          if (values[field.id] === opt.value) {
            option.selected = true;
          }
          input.appendChild(option);
        });
        input.onchange = (e) => {
          state.fieldValues[state.currentTemplate][field.id] = e.target.value;
          updatePromptPreview();
        };
        break;

      case 'checkbox':
        input = document.createElement('label');
        input.className = 'form-checkbox-label';
        input.innerHTML = `
          <input type="checkbox" ${values[field.id] ? 'checked' : ''}>
          <span>활성화</span>
        `;
        input.querySelector('input').onchange = (e) => {
          state.fieldValues[state.currentTemplate][field.id] = e.target.checked;
          updatePromptPreview();
        };
        break;

      case 'checkbox-group':
        input = document.createElement('div');
        input.className = 'form-checkbox-group';
        field.options.forEach(opt => {
          const checkLabel = document.createElement('label');
          checkLabel.className = 'form-checkbox-label';
          const isChecked = Array.isArray(values[field.id]) && values[field.id].includes(opt.value);
          checkLabel.innerHTML = `
            <input type="checkbox" value="${opt.value}" ${isChecked ? 'checked' : ''}>
            <span>${opt.label}</span>
          `;
          checkLabel.querySelector('input').onchange = (e) => {
            const currentValues = state.fieldValues[state.currentTemplate][field.id] || [];
            if (e.target.checked) {
              state.fieldValues[state.currentTemplate][field.id] = [...currentValues, opt.value];
            } else {
              state.fieldValues[state.currentTemplate][field.id] = currentValues.filter(v => v !== opt.value);
            }
            updatePromptPreview();
          };
          input.appendChild(checkLabel);
        });
        break;
    }

    if (input) {
      group.appendChild(input);
    }

    // 도움말
    if (field.helpText) {
      const help = document.createElement('p');
      help.className = 'form-help';
      help.textContent = field.helpText;
      group.appendChild(help);
    }

    container.appendChild(group);
  });

  // 템플릿 전환 시 즉시 업데이트
  updatePromptPreviewImmediate();
}
