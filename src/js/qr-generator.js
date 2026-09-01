/**
 * ==================== QR GENERATOR ====================
 * Módulo responsable de generar el código QR de descarga
 * Dependencia: QRCode library (debe estar en el HTML)
 */

class QRGenerator {
  constructor(containerId, downloadUrl) {
    this.containerId = containerId;
    this.downloadUrl = downloadUrl;
    this.container = null;
  }

  /**
   * Inicializa el generador de QR
   */
  init() {
    this.container = document.getElementById(this.containerId);
    
    if (!this.container) {
      console.warn(`QR container "${this.containerId}" no encontrado`);
      return false;
    }

    this.generate();
    return true;
  }

  /**
   * Genera el código QR
   */
  generate() {
    try {
      // Limpiar contenedor anterior
      this.container.innerHTML = '';

      // Verificar que QRCode esté disponible
      if (typeof QRCode === 'undefined') {
        console.error('QRCode library no está cargada');
        this.showError('QR library no disponible');
        return;
      }

      // Generar QR
      new QRCode(this.container, {
        text: this.downloadUrl,
        width: 250,
        height: 250,
        colorDark: '#04010e',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      });

      console.log('QR generado correctamente');
    } catch (error) {
      console.error('Error generando QR:', error);
      this.showError('Error al generar QR');
    }
  }

  /**
   * Muestra mensaje de error
   */
  showError(message) {
    this.container.innerHTML = `
      <p style="color: var(--color-rojo-peligro); text-align: center; padding: 20px;">
        ${message}
      </p>
    `;
  }

  /**
   * Regenera el QR con una nueva URL
   */
  setUrl(newUrl) {
    this.downloadUrl = newUrl;
    this.generate();
  }
}

// Exportar para uso global
window.QRGenerator = QRGenerator;
