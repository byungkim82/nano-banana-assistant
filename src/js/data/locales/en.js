// ===== English Locale =====

export default {
  // General
  app: {
    title: 'Nano Banana Prompt Assistant',
    description: 'Image generation tool powered by Google Gemini AI'
  },

  // Header
  header: {
    apiConnected: 'API Connected',
    apiDisconnected: 'API Not Connected',
    apiError: 'API Error',
    settings: 'Settings',
    help: 'Help',
    theme: 'Toggle Theme'
  },

  // Templates
  templates: {
    basic: 'Basic',
    photo: 'Photo',
    typography: 'Typography',
    logoGrid: 'Logo Grid',
    chiaroscuro: 'Chiaroscuro',
    productLifestyle: 'Product',
    addNew: 'New Template'
  },

  // Builder
  builder: {
    title: 'Prompt Builder',
    preview: 'Preview',
    original: 'Original',
    translated: 'Translated',
    autoTranslate: 'Auto Translate',
    generate: 'Generate Image',
    generating: 'Generating...',
    copy: 'Copy',
    reset: 'Reset',
    required: 'Required'
  },

  // Work Mode
  workMode: {
    title: 'Work Mode',
    explore: 'Explore',
    refine: 'Refine',
    final: 'Final',
    exploreDesc: 'Quick idea testing (512px)',
    refineDesc: 'Fine-tuning (1024px)',
    finalDesc: 'Production output (original resolution)'
  },

  // Attachments
  attachments: {
    title: 'Image Attachments',
    upload: 'Upload Images',
    dragDrop: 'Drag & drop or click',
    maxFiles: 'Max 14 files',
    delete: 'Delete',
    viewOriginal: 'View Original',
    createCanvas: 'Create Canvas'
  },

  // Result
  result: {
    title: 'Result',
    empty: 'Generated images will appear here',
    download: 'Download',
    edit: 'Edit',
    newSession: 'New Session',
    promptHistory: 'Prompt History'
  },

  // Edit Mode
  edit: {
    title: 'Interactive Edit',
    placeholder: 'Enter your edit request...',
    apply: 'Apply',
    presets: 'Presets',
    categories: {
      color: 'Color',
      style: 'Style',
      composition: 'Composition',
      detail: 'Detail'
    }
  },

  // Settings Modal
  settings: {
    title: 'Settings',
    apiKey: 'API Key',
    apiKeyPlaceholder: 'Enter your Gemini API key',
    save: 'Save',
    testConnection: 'Test Connection',
    getApiKey: 'Get API Key',
    thinkingMode: 'Thinking Mode',
    thinkingModeDesc: 'AI performs logical review before image generation'
  },

  // Help
  help: {
    title: 'Help',
    tabs: {
      overview: 'Overview',
      templates: 'Templates',
      shortcuts: 'Shortcuts',
      tips: 'Tips',
      faq: 'FAQ'
    }
  },

  // Tips
  tips: {
    disable: 'Disable all tips',
    complexScene: {
      title: 'Thinking Mode Recommended',
      message: 'For complex scenes with multiple elements, enabling Thinking Mode can produce more accurate results.'
    },
    textRendering: {
      title: 'Text Rendering Tip',
      message: 'Text rendering works best with 25 characters or less. For longer text, consider splitting into multiple images.'
    }
  },

  // Errors
  errors: {
    apiKeyRequired: 'Please set your API key first',
    generationFailed: 'Image generation failed',
    safetyFilter: 'Blocked by safety filter',
    networkError: 'Network error occurred',
    invalidApiKey: 'Invalid API key'
  },

  // Common
  common: {
    close: 'Close',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    save: 'Save',
    copy: 'Copy',
    copied: 'Copied!'
  }
};
