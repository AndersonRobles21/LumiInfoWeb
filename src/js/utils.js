/**
 * ==================== UTILITIES ====================
 * Funciones utilitarias y helpers reutilizables
 */

/**
 * Detecta si el dispositivo es móvil
 * @returns {boolean}
 */
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Copia texto al portapapeles
 * @param {string} text - Texto a copiar
 * @returns {Promise}
 */
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Error al copiar:', error);
    return false;
  }
}

/**
 * Espera un tiempo determinado
 * @param {number} ms - Milisegundos
 * @returns {Promise}
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Obtiene un parámetro de la URL
 * @param {string} param - Nombre del parámetro
 * @returns {string|null}
 */
function getUrlParameter(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

/**
 * Valida un email
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Debounce - evita llamadas repetidas
 * @param {Function} func
 * @param {number} wait - Milisegundos
 * @returns {Function}
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle - limita frecuencia de llamadas
 * @param {Function} func
 * @param {number} limit - Milisegundos
 * @returns {Function}
 */
function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Obtiene el color de contraste para un color dado
 * @param {string} hexColor - Color en formato hex
 * @returns {string} - Blanco o negro
 */
function getContrastColor(hexColor) {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#ffffff';
}

/**
 * Formatea un número con separadores de miles
 * @param {number} num
 * @returns {string}
 */
function formatNumber(num) {
  return new Intl.NumberFormat('es-ES').format(num);
}

/**
 * Formatea una fecha en formato legible
 * @param {Date} date
 * @returns {string}
 */
function formatDate(date) {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

/**
 * Crea un elemento DOM
 * @param {string} tag
 * @param {object} attributes
 * @param {string} content
 * @returns {HTMLElement}
 */
function createElement(tag, attributes = {}, content = '') {
  const element = document.createElement(tag);
  
  Object.keys(attributes).forEach(key => {
    element.setAttribute(key, attributes[key]);
  });
  
  if (content) {
    element.textContent = content;
  }
  
  return element;
}

// Exportar funciones
window.Utils = {
  isMobile,
  copyToClipboard,
  delay,
  getUrlParameter,
  isValidEmail,
  debounce,
  throttle,
  getContrastColor,
  formatNumber,
  formatDate,
  createElement
};
