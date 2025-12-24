// ===== TEMPLATE HANDLERS =====

import { TEMPLATES } from '../templates.js';
import { state } from '../state.js';
import { renderTemplateTabs, renderTemplateFields } from '../ui/render-templates.js';

// 템플릿 변경 핸들러
export function handleTemplateChange(templateId) {
  state.currentTemplate = templateId;
  renderTemplateTabs();
  renderTemplateFields();
}

// 폼 리셋
export function resetForm() {
  const template = TEMPLATES[state.currentTemplate] || state.customTemplates[state.currentTemplate];
  if (!template) return;

  template.fields.forEach(field => {
    if (field.defaultValue !== undefined) {
      state.fieldValues[state.currentTemplate][field.id] = field.defaultValue;
    } else if (field.type === 'checkbox-group') {
      state.fieldValues[state.currentTemplate][field.id] = [];
    } else if (field.type === 'checkbox') {
      state.fieldValues[state.currentTemplate][field.id] = false;
    } else {
      state.fieldValues[state.currentTemplate][field.id] = '';
    }
  });
  renderTemplateFields();
}
