// ===== I18N MODULE =====

import { state } from '../state.js';
import { saveToLocalStorage, loadFromLocalStorage } from '../storage.js';
import { STORAGE_KEYS } from '../config.js';
import koLocale from '../data/locales/ko.js';
import enLocale from '../data/locales/en.js';

// 지원 언어
const LOCALES = {
  ko: koLocale,
  en: enLocale
};

// 기본 언어
const DEFAULT_LOCALE = 'ko';

// 현재 로케일 데이터
let currentLocaleData = null;

// 로케일 초기화
export function initI18n() {
  const savedLocale = loadFromLocalStorage(STORAGE_KEYS.LOCALE);
  const browserLocale = navigator.language?.split('-')[0];

  // 우선순위: 저장된 설정 > 브라우저 언어 > 기본값
  let locale = savedLocale || browserLocale || DEFAULT_LOCALE;

  // 지원하지 않는 언어면 기본값 사용
  if (!LOCALES[locale]) {
    locale = DEFAULT_LOCALE;
  }

  setLocale(locale, false);
}

// 로케일 설정
export function setLocale(locale, save = true) {
  if (!LOCALES[locale]) {
    console.warn(`Locale '${locale}' not supported. Using '${DEFAULT_LOCALE}'.`);
    locale = DEFAULT_LOCALE;
  }

  state.locale = locale;
  currentLocaleData = LOCALES[locale];

  if (save) {
    saveToLocalStorage(STORAGE_KEYS.LOCALE, locale);
  }

  // DOM 업데이트
  updateDOMLocale();

  // html lang 속성 업데이트
  document.documentElement.lang = locale;

  // 언어 토글 아이콘 업데이트
  const localeIcon = document.getElementById('localeIcon');
  if (localeIcon) {
    localeIcon.textContent = locale === 'ko' ? '🇰🇷' : '🇺🇸';
  }

  return locale;
}

// 현재 로케일 반환
export function getLocale() {
  return state.locale || DEFAULT_LOCALE;
}

// 번역 함수
export function t(key, params = {}) {
  if (!currentLocaleData) {
    initI18n();
  }

  // 점 표기법으로 중첩된 키 접근 (예: 'builder.generate')
  const keys = key.split('.');
  let value = currentLocaleData;

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // 키를 찾지 못하면 기본 언어에서 찾기
      value = getFromDefaultLocale(key);
      if (!value) {
        console.warn(`Translation key not found: ${key}`);
        return key; // 키 자체를 반환
      }
      break;
    }
  }

  // 파라미터 치환 (예: "Hello, {name}" -> "Hello, World")
  if (typeof value === 'string' && Object.keys(params).length > 0) {
    for (const [param, paramValue] of Object.entries(params)) {
      value = value.replace(new RegExp(`\\{${param}\\}`, 'g'), paramValue);
    }
  }

  return value;
}

// 기본 언어에서 값 가져오기
function getFromDefaultLocale(key) {
  const keys = key.split('.');
  let value = LOCALES[DEFAULT_LOCALE];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return null;
    }
  }

  return value;
}

// DOM에서 data-i18n 속성을 가진 요소들 업데이트
function updateDOMLocale() {
  const elements = document.querySelectorAll('[data-i18n]');

  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translation = t(key);

    if (translation && translation !== key) {
      // data-i18n-attr 가 있으면 해당 속성에 적용
      const attr = el.getAttribute('data-i18n-attr');
      if (attr) {
        el.setAttribute(attr, translation);
      } else {
        el.textContent = translation;
      }
    }
  });

  // placeholder 속성
  const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
  placeholderElements.forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const translation = t(key);
    if (translation && translation !== key) {
      el.placeholder = translation;
    }
  });

  // aria-label 속성
  const ariaElements = document.querySelectorAll('[data-i18n-aria]');
  ariaElements.forEach(el => {
    const key = el.getAttribute('data-i18n-aria');
    const translation = t(key);
    if (translation && translation !== key) {
      el.setAttribute('aria-label', translation);
    }
  });

  // title 속성
  const titleElements = document.querySelectorAll('[data-i18n-title]');
  titleElements.forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    const translation = t(key);
    if (translation && translation !== key) {
      el.title = translation;
    }
  });
}

// 언어 토글 (한국어 <-> 영어)
export function toggleLocale() {
  const newLocale = state.locale === 'ko' ? 'en' : 'ko';
  setLocale(newLocale);
  return newLocale;
}

// 사용 가능한 로케일 목록
export function getAvailableLocales() {
  return Object.keys(LOCALES).map(code => ({
    code,
    name: code === 'ko' ? '한국어' : 'English',
    nativeName: code === 'ko' ? '한국어' : 'English'
  }));
}

// 특정 로케일 데이터 가져오기
export function getLocaleData(locale) {
  return LOCALES[locale] || null;
}
