/**
 * ==================== ANALYTICS ====================
 * Módulo para rastrear eventos y secciones visitadas
 */

class Analytics {
  constructor() {
    this.events = [];
    this.sessionStart = new Date();
    this.currentSection = null;
  }

  /**
   * Registra un evento
   * @param {string} eventName - Nombre del evento
   * @param {object} data - Datos adicionales
   */
  trackEvent(eventName, data = {}) {
    const event = {
      name: eventName,
      timestamp: new Date(),
      data: data,
      sessionDuration: new Date() - this.sessionStart
    };

    this.events.push(event);
    console.log(`📊 Evento: ${eventName}`, event);

    // Enviar a servicio externo si está configurado
    this.sendToServer(event);
  }

  /**
   * Registra una sección visitada
   * @param {string} sectionName
   * @param {number} visibility - 0-1 (visibilidad)
   */
  trackSection(sectionName, visibility) {
    this.currentSection = sectionName;
    this.trackEvent('section_view', {
      section: sectionName,
      visibility: visibility
    });
  }

  /**
   * Registra un clic en botón
   * @param {string} buttonLabel
   * @param {string} action
   */
  trackButtonClick(buttonLabel, action) {
    this.trackEvent('button_click', {
      label: buttonLabel,
      action: action
    });
  }

  /**
   * Obtiene estadísticas de la sesión
   * @returns {object}
   */
  getSessionStats() {
    return {
      duration: new Date() - this.sessionStart,
      totalEvents: this.events.length,
      currentSection: this.currentSection,
      startTime: this.sessionStart,
      events: this.events
    };
  }

  /**
   * Envía eventos al servidor (simulado)
   * Implementar con tu endpoint real
   */
  sendToServer(event) {
    // Ejemplo: fetch('/api/analytics', {
    //   method: 'POST',
    //   body: JSON.stringify(event)
    // }).catch(err => console.warn('Error enviando analytics:', err));
    
    // Por ahora solo logging
  }

  /**
   * Imprime estadísticas en consola
   */
  printStats() {
    const stats = this.getSessionStats();
    console.table({
      'Duración sesión': `${Math.round(stats.duration / 1000)}s`,
      'Total eventos': stats.totalEvents,
      'Sección actual': stats.currentSection || 'Ninguna'
    });
  }
}

// Crear instancia global
const analytics = new Analytics();
window.analytics = analytics;
