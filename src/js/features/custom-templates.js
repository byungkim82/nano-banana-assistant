// ===== CUSTOM TEMPLATES =====

import { STORAGE_KEYS } from '../config.js';
import { TEMPLATES } from '../templates.js';
import { state, initializeCustomTemplateFieldValues } from '../state.js';
import { renderTemplateTabs, renderTemplateFields } from '../ui/render-templates.js';
import { handleTemplateChange } from '../handlers/template-handlers.js';
import { showError, hideError, escapeHtml, generateCustomTemplateId } from '../utils.js';

// 커스텀 템플릿 저장
export function saveCustomTemplates() {
  try {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_TEMPLATES, JSON.stringify(state.customTemplates));
  } catch (e) {
    console.error('Failed to save custom templates:', e);
    showError('템플릿 저장에 실패했습니다. 저장 공간이 부족할 수 있습니다.');
  }
}

// 커스텀 템플릿 로드
export function loadCustomTemplates() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_TEMPLATES);
    if (saved) {
      state.customTemplates = JSON.parse(saved);
      // 커스텀 템플릿의 fieldValues 초기화
      Object.keys(state.customTemplates).forEach(templateId => {
        if (!state.fieldValues[templateId]) {
          initializeCustomTemplateFieldValues(templateId, state.customTemplates[templateId]);
        }
      });
    }
  } catch (e) {
    console.error('Failed to load custom templates:', e);
  }
}

// 필드 값 초기화 헬퍼
function initFieldValue(templateId, field) {
  if (field.defaultValue !== undefined) {
    state.fieldValues[templateId][field.id] = field.defaultValue;
  } else if (field.type === 'checkbox-group') {
    state.fieldValues[templateId][field.id] = [];
  } else if (field.type === 'checkbox') {
    state.fieldValues[templateId][field.id] = false;
  } else {
    state.fieldValues[templateId][field.id] = '';
  }
}

// 템플릿 에디터 열기
export function openTemplateEditor(templateId = null) {
  const modal = document.getElementById('templateEditorModal');
  if (!modal) return;

  if (templateId && state.customTemplates[templateId]) {
    // 기존 템플릿 편집
    state.editingTemplate = templateId;
    const template = state.customTemplates[templateId];
    document.getElementById('templateName').value = template.name;
    document.getElementById('templateIcon').value = template.icon;
    document.getElementById('templateCategory').value = template.category || 'custom';
    document.getElementById('templateDescription').value = template.description || '';
    document.getElementById('templatePrompt').value = template.promptTemplate;
    state.templateEditorFields = JSON.parse(JSON.stringify(template.fields));
  } else {
    // 새 템플릿 생성
    state.editingTemplate = null;
    document.getElementById('templateName').value = '';
    document.getElementById('templateIcon').value = '🎨';
    document.getElementById('templateCategory').value = 'custom';
    document.getElementById('templateDescription').value = '';
    document.getElementById('templatePrompt').value = '';
    state.templateEditorFields = [];
  }

  renderTemplateEditorFields();
  modal.classList.add('active');
}

// 템플릿 에디터 닫기
export function closeTemplateEditor() {
  const modal = document.getElementById('templateEditorModal');
  if (modal) modal.classList.remove('active');
  state.editingTemplate = null;
  state.templateEditorFields = [];
}

// 에디터 필드 추가
export function addEditorField() {
  const newField = {
    id: 'field_' + Date.now(),
    label: '새 필드',
    type: 'text',
    placeholder: '',
    helpText: '',
    required: false,
    options: []
  };
  state.templateEditorFields.push(newField);
  renderTemplateEditorFields();
}

// 에디터 필드 삭제
export function deleteEditorField(index) {
  state.templateEditorFields.splice(index, 1);
  renderTemplateEditorFields();
}

// 에디터 필드 이동
export function moveEditorField(index, direction) {
  const newIndex = index + direction;
  if (newIndex < 0 || newIndex >= state.templateEditorFields.length) return;

  const temp = state.templateEditorFields[index];
  state.templateEditorFields[index] = state.templateEditorFields[newIndex];
  state.templateEditorFields[newIndex] = temp;
  renderTemplateEditorFields();
}

// 에디터 필드 업데이트
export function updateEditorField(index, property, value) {
  state.templateEditorFields[index][property] = value;

  // 라벨 변경 시 ID 자동 생성
  if (property === 'label' && !state.templateEditorFields[index].idManuallySet) {
    state.templateEditorFields[index].id = value.toLowerCase()
      .replace(/[^a-z0-9가-힣]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '') || 'field_' + Date.now();
  }

  renderTemplateEditorFields();
}

// 필드 옵션 추가
export function addFieldOption(fieldIndex) {
  if (!state.templateEditorFields[fieldIndex].options) {
    state.templateEditorFields[fieldIndex].options = [];
  }
  state.templateEditorFields[fieldIndex].options.push({
    value: '',
    label: ''
  });
  renderTemplateEditorFields();
}

// 필드 옵션 삭제
export function deleteFieldOption(fieldIndex, optionIndex) {
  state.templateEditorFields[fieldIndex].options.splice(optionIndex, 1);
  renderTemplateEditorFields();
}

// 필드 타입 이름 가져오기
function getFieldTypeName(type) {
  const names = {
    'text': '텍스트',
    'textarea': '영역',
    'select': '선택',
    'checkbox': '체크',
    'checkbox-group': '그룹'
  };
  return names[type] || type;
}

// 템플릿 에디터 필드 렌더링
export function renderTemplateEditorFields() {
  const container = document.getElementById('templateFieldsEditor');
  const placeholdersContainer = document.getElementById('fieldPlaceholders');

  if (!container) return;

  if (state.templateEditorFields.length === 0) {
    container.innerHTML = '<div class="empty-fields-message">필드가 없습니다. "필드 추가" 버튼을 클릭하세요.</div>';
    if (placeholdersContainer) placeholdersContainer.innerHTML = '';
    return;
  }

  container.innerHTML = state.templateEditorFields.map((field, index) => `
    <div class="editor-field-item">
      <div class="editor-field-header">
        <span class="field-drag-handle">⋮⋮</span>
        <span class="field-type-badge">${getFieldTypeName(field.type)}</span>
        <span class="field-label-preview">{${field.id}}</span>
        <div class="field-actions">
          <button class="btn btn-outline btn-sm" onclick="moveEditorField(${index}, -1)" ${index === 0 ? 'disabled' : ''}>▲</button>
          <button class="btn btn-outline btn-sm" onclick="moveEditorField(${index}, 1)" ${index === state.templateEditorFields.length - 1 ? 'disabled' : ''}>▼</button>
          <button class="btn btn-outline btn-sm btn-danger" onclick="deleteEditorField(${index})">🗑️</button>
        </div>
      </div>
      <div class="editor-field-body">
        <div class="field-row">
          <div class="field-col">
            <label>라벨</label>
            <input type="text" class="form-input" value="${escapeHtml(field.label)}"
                   oninput="updateEditorField(${index}, 'label', this.value)">
          </div>
          <div class="field-col">
            <label>ID</label>
            <input type="text" class="form-input" value="${escapeHtml(field.id)}"
                   oninput="updateEditorField(${index}, 'id', this.value); state.templateEditorFields[${index}].idManuallySet = true;">
          </div>
          <div class="field-col">
            <label>타입</label>
            <select class="form-select" onchange="updateEditorField(${index}, 'type', this.value)">
              <option value="text" ${field.type === 'text' ? 'selected' : ''}>텍스트</option>
              <option value="textarea" ${field.type === 'textarea' ? 'selected' : ''}>텍스트영역</option>
              <option value="select" ${field.type === 'select' ? 'selected' : ''}>선택</option>
              <option value="checkbox" ${field.type === 'checkbox' ? 'selected' : ''}>체크박스</option>
              <option value="checkbox-group" ${field.type === 'checkbox-group' ? 'selected' : ''}>체크박스 그룹</option>
            </select>
          </div>
        </div>
        <div class="field-row">
          <div class="field-col">
            <label>Placeholder</label>
            <input type="text" class="form-input" value="${escapeHtml(field.placeholder || '')}"
                   oninput="updateEditorField(${index}, 'placeholder', this.value)">
          </div>
          <div class="field-col-sm">
            <label>필수</label>
            <input type="checkbox" ${field.required ? 'checked' : ''}
                   onchange="updateEditorField(${index}, 'required', this.checked)">
          </div>
        </div>
        <div class="field-row">
          <div class="field-col">
            <label>도움말</label>
            <input type="text" class="form-input" value="${escapeHtml(field.helpText || '')}"
                   oninput="updateEditorField(${index}, 'helpText', this.value)">
          </div>
        </div>
        ${(field.type === 'select' || field.type === 'checkbox-group') ? `
          <div class="field-options">
            <label>옵션</label>
            ${(field.options || []).map((opt, optIndex) => `
              <div class="option-row">
                <input type="text" class="form-input" placeholder="값" value="${escapeHtml(opt.value)}"
                       oninput="state.templateEditorFields[${index}].options[${optIndex}].value = this.value">
                <input type="text" class="form-input" placeholder="라벨" value="${escapeHtml(opt.label)}"
                       oninput="state.templateEditorFields[${index}].options[${optIndex}].label = this.value">
                <button class="btn btn-outline btn-sm" onclick="deleteFieldOption(${index}, ${optIndex})">×</button>
              </div>
            `).join('')}
            <button class="btn btn-outline btn-sm" onclick="addFieldOption(${index})">+ 옵션 추가</button>
          </div>
        ` : ''}
      </div>
    </div>
  `).join('');

  // 필드 플레이스홀더 버튼 렌더링
  if (placeholdersContainer) {
    placeholdersContainer.innerHTML = state.templateEditorFields.map(field => `
      <button class="field-placeholder-btn" onclick="insertFieldPlaceholder('${field.id}')">{${field.id}}</button>
    `).join('');
  }
}

// 필드 플레이스홀더 삽입
export function insertFieldPlaceholder(fieldId) {
  const textarea = document.getElementById('templatePrompt');
  if (!textarea) return;

  const placeholder = `{${fieldId}}`;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;

  textarea.value = text.substring(0, start) + placeholder + text.substring(end);
  textarea.focus();
  textarea.selectionStart = textarea.selectionEnd = start + placeholder.length;
}

// 템플릿 저장
export function saveTemplate() {
  const name = document.getElementById('templateName').value.trim();
  const icon = document.getElementById('templateIcon').value.trim() || '🎨';
  const category = document.getElementById('templateCategory').value;
  const description = document.getElementById('templateDescription').value.trim();
  const promptTemplate = document.getElementById('templatePrompt').value.trim();

  // 유효성 검사
  if (!name) {
    showError('템플릿 이름을 입력해주세요.');
    return;
  }
  if (state.templateEditorFields.length === 0) {
    showError('최소 1개의 필드가 필요합니다.');
    return;
  }
  if (!promptTemplate) {
    showError('프롬프트 템플릿을 입력해주세요.');
    return;
  }

  const templateId = state.editingTemplate || generateCustomTemplateId();

  const template = {
    id: templateId,
    name: name,
    icon: icon,
    category: category,
    description: description,
    isCustom: true,
    createdAt: state.editingTemplate ? state.customTemplates[templateId].createdAt : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fields: state.templateEditorFields.map(f => ({
      id: f.id,
      label: f.label,
      type: f.type,
      placeholder: f.placeholder || '',
      helpText: f.helpText || '',
      required: f.required || false,
      options: f.options || []
    })),
    promptTemplate: promptTemplate
  };

  state.customTemplates[templateId] = template;

  // fieldValues 초기화
  state.fieldValues[templateId] = {};
  template.fields.forEach(field => {
    initFieldValue(templateId, field);
  });

  saveCustomTemplates();
  closeTemplateEditor();
  renderTemplateTabs();

  // 새로 만든 템플릿으로 전환
  handleTemplateChange(templateId);

  showError(state.editingTemplate ? '템플릿이 수정되었습니다.' : '템플릿이 생성되었습니다.');
  setTimeout(hideError, 2000);
}

// 템플릿 복제
export function duplicateTemplate(templateId) {
  let sourceTemplate;

  if (TEMPLATES[templateId]) {
    sourceTemplate = TEMPLATES[templateId];
  } else if (state.customTemplates[templateId]) {
    sourceTemplate = state.customTemplates[templateId];
  } else {
    showError('템플릿을 찾을 수 없습니다.');
    return;
  }

  const newId = generateCustomTemplateId();
  const newTemplate = {
    ...JSON.parse(JSON.stringify(sourceTemplate)),
    id: newId,
    name: sourceTemplate.name + ' (복사본)',
    isCustom: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  state.customTemplates[newId] = newTemplate;

  // fieldValues 초기화
  state.fieldValues[newId] = {};
  newTemplate.fields.forEach(field => {
    initFieldValue(newId, field);
  });

  saveCustomTemplates();
  renderTemplateTabs();

  showError('템플릿이 복제되었습니다.');
  setTimeout(hideError, 2000);
}

// 커스텀 템플릿 삭제
export function deleteCustomTemplate(templateId) {
  if (!state.customTemplates[templateId]) {
    showError('삭제할 템플릿을 찾을 수 없습니다.');
    return;
  }

  if (!confirm(`"${state.customTemplates[templateId].name}" 템플릿을 삭제하시겠습니까?`)) {
    return;
  }

  delete state.customTemplates[templateId];
  delete state.fieldValues[templateId];

  // 현재 선택된 템플릿이 삭제된 것이면 기본 템플릿으로 전환
  if (state.currentTemplate === templateId) {
    state.currentTemplate = 'basic';
  }

  saveCustomTemplates();
  renderTemplateTabs();
  renderTemplateFields();

  showError('템플릿이 삭제되었습니다.');
  setTimeout(hideError, 2000);
}

// 템플릿 내보내기
export function exportTemplate(templateId) {
  const template = state.customTemplates[templateId];
  if (!template) {
    showError('템플릿을 찾을 수 없습니다.');
    return;
  }

  const exportData = JSON.stringify(template, null, 2);
  const blob = new Blob([exportData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `template-${template.name.replace(/[^a-z0-9가-힣]/gi, '-')}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// 템플릿 가져오기
export function importTemplate(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const template = JSON.parse(e.target.result);

      // 유효성 검사
      if (!template.name || !template.fields || !template.promptTemplate) {
        throw new Error('유효하지 않은 템플릿 파일입니다.');
      }

      const newId = generateCustomTemplateId();
      template.id = newId;
      template.isCustom = true;
      template.createdAt = new Date().toISOString();
      template.updatedAt = new Date().toISOString();

      state.customTemplates[newId] = template;

      // fieldValues 초기화
      state.fieldValues[newId] = {};
      template.fields.forEach(field => {
        initFieldValue(newId, field);
      });

      saveCustomTemplates();
      renderTemplateTabs();

      showError('템플릿을 가져왔습니다.');
      setTimeout(hideError, 2000);
    } catch (err) {
      showError('템플릿 파일을 읽을 수 없습니다: ' + err.message);
    }
  };
  reader.readAsText(file);
}
