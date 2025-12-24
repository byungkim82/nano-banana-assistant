// ===== STATE =====

import { TEMPLATES } from './templates.js';

export const state = {
  apiKey: '',
  apiStatus: 'disconnected', // 'disconnected' | 'testing' | 'connected' | 'error'
  currentTemplate: 'basic',
  fieldValues: {},
  generatedImage: null,
  isLoading: false,
  error: null,
  // Phase 2 추가
  workMode: 'explore', // 'explore' | 'refine' | 'final'
  attachedImages: [], // { id, file, originalSize, processedSize, base64, thumbnail, width, height }
  selectedImageId: null,
  resultHistory: [], // { id, prompt, translatedPrompt, image: { mimeType, data }, timestamp }
  selectedResultId: null,
  autoTranslate: false,
  translatedPrompt: '',
  isTranslating: false,
  promptTab: 'original', // 'original' | 'translated'
  imageModalIndex: -1,
  // Phase 3 추가
  thinkingMode: false,
  editSession: {
    sessionId: null,
    basePrompt: '',
    editHistory: [], // { id, step, request, prompt, image, timestamp }
    currentEditIndex: -1
  },
  presetCategory: 'lighting',
  // Phase 4 추가
  promptHistory: [], // { id, prompt, translatedPrompt, templateId, timestamp }
  promptHistorySearch: '',
  customTemplates: {}, // { templateId: templateObject }
  editingTemplate: null, // 현재 편집 중인 템플릿 ID
  templateEditorFields: [], // 편집기의 필드 목록
  canvasSettings: {
    aspectRatio: '1:1',
    customWidth: 1024,
    customHeight: 1024,
    baseSize: 1024,
    backgroundColor: '#FFFFFF',
    backgroundType: 'white' // 'white' | 'transparent' | 'custom'
  }
};

// 템플릿별 기본값 초기화
export function initializeFieldValues() {
  Object.keys(TEMPLATES).forEach(templateId => {
    state.fieldValues[templateId] = {};
    TEMPLATES[templateId].fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        state.fieldValues[templateId][field.id] = field.defaultValue;
      } else if (field.type === 'checkbox-group') {
        state.fieldValues[templateId][field.id] = [];
      } else if (field.type === 'checkbox') {
        state.fieldValues[templateId][field.id] = false;
      } else {
        state.fieldValues[templateId][field.id] = '';
      }
    });
  });
}

// 커스텀 템플릿의 필드값도 초기화
export function initializeCustomTemplateFieldValues(templateId, template) {
  state.fieldValues[templateId] = {};
  template.fields.forEach(field => {
    if (field.defaultValue !== undefined) {
      state.fieldValues[templateId][field.id] = field.defaultValue;
    } else if (field.type === 'checkbox-group') {
      state.fieldValues[templateId][field.id] = [];
    } else if (field.type === 'checkbox') {
      state.fieldValues[templateId][field.id] = false;
    } else {
      state.fieldValues[templateId][field.id] = '';
    }
  });
}
