// ===== MAIN.JS - Entry Point =====

// Core modules
import { state, initializeFieldValues } from './state.js';
import { loadFromStorage, loadPromptHistory as loadPromptHistoryStorage, loadCustomTemplates as loadCustomTemplatesStorage, loadSettings } from './storage.js';

// UI modules
import { renderTemplateTabs, renderTemplateFields } from './ui/render-templates.js';
import { renderResult } from './ui/render-result.js';
import { renderAttachedImages } from './ui/render-images.js';
import { renderEditSession } from './ui/render-edit-session.js';

// Handler modules
import { handleTemplateChange, resetForm } from './handlers/template-handlers.js';
import {
  setWorkMode, handleFileSelect, addImages, selectAttachedImage,
  deleteAttachedImage, deleteSelectedImage, viewOriginalImage,
  downloadImage, selectResultHistory
} from './handlers/image-handlers.js';
import {
  generateImage, copyPrompt, handleTranslateToggle, setPromptTab
} from './handlers/generation-handlers.js';
import {
  openSettingsModal, closeSettingsModal, toggleApiKeyVisibility,
  testApiConnection, saveApiKey, openImageModal, closeImageModal,
  navigateImageModal, downloadModalImage, reusePrompt
} from './handlers/modal-handlers.js';
import {
  startNewSession, initEditSession, addEditHistory, selectEditHistoryItem,
  clearEditRequest, applyEditRequest, setPresetCategory, applyPreset,
  toggleThinkingMode, loadThinkingMode
} from './handlers/edit-handlers.js';

// Feature modules
import {
  savePromptToHistory, loadPromptHistory, openPromptHistory, closePromptHistory,
  searchPromptHistory, restorePromptFromHistory, copyPromptFromHistory,
  deletePromptFromHistory, clearAllPromptHistory
} from './features/prompt-history.js';
import {
  openCanvasGenerator, closeCanvasGenerator, setCanvasAspectRatio,
  setCanvasBaseSize, setCanvasCustomSize, setCanvasBackgroundType,
  setCanvasBackgroundColor, generateAndAttachCanvas
} from './features/canvas-generator.js';
import {
  loadCustomTemplates, openTemplateEditor, closeTemplateEditor,
  addEditorField, deleteEditorField, moveEditorField, updateEditorField,
  addFieldOption, deleteFieldOption, saveTemplate, duplicateTemplate,
  deleteCustomTemplate, exportTemplate, insertFieldPlaceholder
} from './features/custom-templates.js';

// ===== Register Global Functions for onclick handlers =====
window.handleTemplateChange = handleTemplateChange;
window.resetForm = resetForm;

// Image handlers
window.setWorkMode = setWorkMode;
window.handleFileSelect = handleFileSelect;
window.selectAttachedImage = selectAttachedImage;
window.deleteAttachedImage = deleteAttachedImage;
window.deleteSelectedImage = deleteSelectedImage;
window.viewOriginalImage = viewOriginalImage;
window.downloadImage = downloadImage;
window.selectResultHistory = (historyId) => {
  selectResultHistory(historyId);
  renderResult();
};

// Generation handlers
window.generateImage = generateImage;
window.copyPrompt = copyPrompt;
window.handleTranslateToggle = handleTranslateToggle;
window.setPromptTab = setPromptTab;

// Modal handlers
window.openSettingsModal = openSettingsModal;
window.closeSettingsModal = closeSettingsModal;
window.toggleApiKeyVisibility = toggleApiKeyVisibility;
window.testApiConnection = testApiConnection;
window.saveApiKey = saveApiKey;
window.openImageModal = openImageModal;
window.closeImageModal = closeImageModal;
window.navigateImageModal = navigateImageModal;
window.downloadModalImage = downloadModalImage;
window.reusePrompt = reusePrompt;

// Edit handlers
window.startNewSession = startNewSession;
window.initEditSession = initEditSession;
window.selectEditHistoryItem = selectEditHistoryItem;
window.clearEditRequest = clearEditRequest;
window.applyEditRequest = applyEditRequest;
window.setPresetCategory = setPresetCategory;
window.applyPreset = applyPreset;
window.toggleThinkingMode = toggleThinkingMode;

// Prompt history handlers
window.savePromptToHistory = savePromptToHistory;
window.openPromptHistory = openPromptHistory;
window.closePromptHistory = closePromptHistory;
window.searchPromptHistory = searchPromptHistory;
window.restorePromptFromHistory = restorePromptFromHistory;
window.copyPromptFromHistory = copyPromptFromHistory;
window.deletePromptFromHistory = deletePromptFromHistory;
window.clearAllPromptHistory = clearAllPromptHistory;

// Canvas generator handlers
window.openCanvasGenerator = openCanvasGenerator;
window.closeCanvasGenerator = closeCanvasGenerator;
window.setCanvasAspectRatio = setCanvasAspectRatio;
window.setCanvasBaseSize = setCanvasBaseSize;
window.setCanvasCustomSize = setCanvasCustomSize;
window.setCanvasBackgroundType = setCanvasBackgroundType;
window.setCanvasBackgroundColor = setCanvasBackgroundColor;
window.generateAndAttachCanvas = generateAndAttachCanvas;

// Custom template handlers
window.openTemplateEditor = openTemplateEditor;
window.closeTemplateEditor = closeTemplateEditor;
window.addEditorField = addEditorField;
window.deleteEditorField = deleteEditorField;
window.moveEditorField = moveEditorField;
window.updateEditorField = updateEditorField;
window.addFieldOption = addFieldOption;
window.deleteFieldOption = deleteFieldOption;
window.saveTemplate = saveTemplate;
window.duplicateTemplate = duplicateTemplate;
window.deleteCustomTemplate = deleteCustomTemplate;
window.exportTemplate = exportTemplate;
window.insertFieldPlaceholder = insertFieldPlaceholder;

// State access (for inline handlers)
window.state = state;

// ===== App Initialization =====
function initApp() {
  // 1. Initialize field values for all templates
  initializeFieldValues();

  // 2. Load saved data from localStorage
  const savedApiKey = loadFromStorage();
  loadSettings();
  loadPromptHistory();
  loadCustomTemplates();
  loadThinkingMode();

  // 3. Test API connection if key exists
  if (savedApiKey) {
    testApiConnection(true);
  }

  // 4. Render initial UI
  renderTemplateTabs();
  renderTemplateFields();
  renderResult();
  renderAttachedImages();

  // 5. Setup drag and drop for image upload
  setupDragAndDrop();

  // 6. Setup keyboard shortcuts
  setupKeyboardShortcuts();

  console.log('Nano Banana Assistant initialized');
}

// Setup drag and drop for image upload
function setupDragAndDrop() {
  const uploadArea = document.getElementById('uploadArea');
  if (!uploadArea) return;

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    uploadArea.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  });

  ['dragenter', 'dragover'].forEach(eventName => {
    uploadArea.addEventListener(eventName, () => {
      uploadArea.classList.add('drag-over');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    uploadArea.addEventListener(eventName, () => {
      uploadArea.classList.remove('drag-over');
    });
  });

  uploadArea.addEventListener('drop', async (e) => {
    const files = Array.from(e.dataTransfer.files);
    await addImages(files);
  });
}

// Setup keyboard shortcuts
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // ESC to close modals
    if (e.key === 'Escape') {
      closeSettingsModal();
      closeImageModal();
      closePromptHistory();
      closeCanvasGenerator();
      closeTemplateEditor();
    }

    // Arrow keys for image modal navigation
    if (state.imageModalIndex >= 0) {
      if (e.key === 'ArrowLeft') {
        navigateImageModal(-1);
      } else if (e.key === 'ArrowRight') {
        navigateImageModal(1);
      }
    }

    // Ctrl/Cmd + Enter to generate
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      generateImage();
    }
  });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);
