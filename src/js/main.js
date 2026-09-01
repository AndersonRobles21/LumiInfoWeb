/**
 * ==================== MAIN - INICIALIZACIÓN ====================
 * Archivo principal que coordina todas las funcionalidades
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Inicializando aplicación...');

  // Inicializar QR Generator (desactivado - solo marco vacío)
  // initializeQRGenerator();

  // Configurar navegación suave
  setupSmoothScroll();

  // Configurar animaciones con Intersection Observer
  setupScrollAnimations();

  // Configurar comportamiento de logros
  setupAchievements();

  // Configurar eventos de analytics
  setupAnalyticsTracking();

  console.log('✅ Aplicación iniciada correctamente');
});

/**
 * Inicializa el generador de QR
 */
function initializeQRGenerator() {
  try {
    // Esperar a que la librería QRCode esté disponible
    const checkQRCode = setInterval(() => {
      if (typeof QRCode !== 'undefined') {
        clearInterval(checkQRCode);

        const qrGenerator = new QRGenerator('qr-container', 'https://play.google.com/store/apps/details?id=com.lumiapp');
        qrGenerator.init();

        console.log('✅ QR Generator inicializado');
      }
    }, 100);

    // Timeout de seguridad
    setTimeout(() => clearInterval(checkQRCode), 5000);
  } catch (error) {
    console.error('Error inicializando QR:', error);
  }
}

/**
 * Configura smooth scroll para enlaces internos
 */
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '') return;

      e.preventDefault();
      const target = document.querySelector(href);

      if (target) {
        analytics.trackButtonClick(this.textContent, `scroll_to_${href}`);
        
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  console.log('✅ Smooth scroll configurado');
}

/**
 * Configura animaciones al hacer scroll con Intersection Observer
 */
function setupScrollAnimations() {
  const options = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        analytics.trackSection(
          entry.target.id || entry.target.className,
          entry.intersectionRatio
        );
      }
    });
  }, options);

  // Observar elementos animables
  const selectors = [
    '.caracteristica-card',
    '.paso',
    '.seccion-item',
    '.tech-item',
    '.logro-badge',
    '.seccion-titulo'
  ];

  selectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(element => {
      observer.observe(element);
    });
  });

  console.log('✅ Animaciones de scroll configuradas');
}

/**
 * Configura comportamiento interactivo de logros
 */
function setupAchievements() {
  const achievements = document.querySelectorAll('.logro-badge');

  achievements.forEach((achievement, index) => {
    achievement.addEventListener('click', function() {
      const name = this.querySelector('span')?.textContent || `Achievement ${index + 1}`;
      
      analytics.trackButtonClick(name, 'achievement_clicked');
      showAchievementDetail(name, index);
    });

    // Agregar interactividad hover
    achievement.style.cursor = 'pointer';
    achievement.style.transition = 'var(--transicion-normal)';
  });

  console.log('✅ Comportamiento de logros configurado');
}

/**
 * Muestra detalles de un logro
 */
function showAchievementDetail(name, index) {
  console.log(`🏆 Logro clickeado: ${name} (${index})`);
  
  // Aquí se podría mostrar un modal o notificación
  // Por ahora solo se registra en consola y analytics
}

/**
 * Configura rastreo de eventos de analytics
 */
function setupAnalyticsTracking() {
  // Rastrear descargas
  document.querySelectorAll('[href*="play.google.com"], [href*="apps.apple.com"]').forEach(link => {
    link.addEventListener('click', function() {
      analytics.trackEvent('app_download_attempt', {
        url: this.href,
        platform: this.href.includes('play.google') ? 'Android' : 'iOS'
      });
    });
  });

  // Rastrear navegación de secciones
  document.querySelectorAll('section').forEach(section => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          analytics.trackSection(
            section.id || section.className,
            entry.intersectionRatio
          );
        }
      });
    });

    observer.observe(section);
  });

  // Mostrar estadísticas en consola cada 30 segundos
  setInterval(() => {
    if (window.location.hash === '#debug') {
      analytics.printStats();
    }
  }, 30000);

  console.log('✅ Analytics configurado');
}

/**
 * Funciones públicas para usar desde HTML
 */

/**
 * Copia enlace de descarga
 */
function copyDownloadLink() {
  const link = 'https://play.google.com/store/apps/details?id=com.lumiapp';
  Utils.copyToClipboard(link).then(() => {
    analytics.trackEvent('download_link_copied');
    alert('✅ Enlace de descarga copiado al portapapeles');
  }).catch(() => {
    alert('❌ Error al copiar el enlace');
  });
}

/**
 * Abre la página de descarga
 */
function openDownloadPage(platform = 'android') {
  const links = {
    android: 'https://play.google.com/store/apps/details?id=com.lumiapp',
    ios: 'https://apps.apple.com/app/lumi/id1234567890'
  };

  analytics.trackEvent('app_download_initiated', { platform });
  window.open(links[platform], '_blank');
}

// Exportar funciones globales
window.copyDownloadLink = copyDownloadLink;
window.openDownloadPage = openDownloadPage;
window.setupScrollAnimations = setupScrollAnimations;
