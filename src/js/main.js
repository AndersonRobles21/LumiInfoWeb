/**
 * ==================== MAIN - INICIALIZACIÓN ====================
 * Archivo principal que coordina todas las funcionalidades
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Inicializando aplicación...');

  // Configurar navegación suave
  setupSmoothScroll();

  // Configurar animaciones con Intersection Observer
  setupScrollAnimations();

  // Configurar comportamiento de logros
  setupAchievements();

  // Configurar eventos de analytics
  setupAnalyticsTracking();

  // Configurar cuestionario de procrastinación
  setupCuestionario();

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

        const qrGenerator = new QRGenerator('qr-container', 'https://www.mediafire.com/file/dhpzb7tq1xg41pf/LUMI.apk/file');
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
 * Configura el cuestionario de procrastinación
 */
function setupCuestionario() {
  const formulario = document.getElementById('cuestionario-procrastinacion');
  const inicio = document.getElementById('iniciar-cuestionario');
  const siguiente = document.getElementById('siguiente-pregunta');
  const reinicio = document.getElementById('reiniciar-cuestionario');

  if (!formulario || !inicio || !siguiente || !reinicio) return;

  inicio.addEventListener('click', iniciarCuestionario);
  siguiente.addEventListener('click', siguientePregunta);
  formulario.querySelectorAll('input[type="radio"]').forEach(respuesta => {
    respuesta.addEventListener('change', responderPregunta);
  });

  formulario.addEventListener('submit', function(event) {
    event.preventDefault();
    calcularNivel();
  });

  reinicio.addEventListener('click', reiniciarCuestionario);
}

/**
 * Abre el cuestionario y muestra la primera pregunta
 */
function iniciarCuestionario() {
  const formulario = document.getElementById('cuestionario-procrastinacion');
  const invitacion = document.getElementById('invitacion-cuestionario');

  invitacion.hidden = true;
  formulario.hidden = false;
  formulario.reset();
  formulario.dataset.preguntaActual = '0';
  mostrarPregunta(0);
}

/**
 * Guarda la selección y actualiza el avance del cuestionario
 */
function responderPregunta() {
  const formulario = document.getElementById('cuestionario-procrastinacion');
  const preguntaActual = Number(formulario.dataset.preguntaActual || 0);
  mostrarMensajeCuestionario('');
  actualizarControles(preguntaActual);
}

/**
 * Avanza a la siguiente pregunta después de validar la respuesta actual
 */
function siguientePregunta() {
  const formulario = document.getElementById('cuestionario-procrastinacion');
  const preguntaActual = Number(formulario.dataset.preguntaActual || 0);
  const respuesta = formulario.querySelector(`input[name="pregunta-${preguntaActual + 1}"]:checked`);

  if (!respuesta) {
    mostrarMensajeCuestionario('Responde las 5 preguntas para conocer tu resultado.');
    return;
  }

  formulario.dataset.preguntaActual = String(preguntaActual + 1);
  mostrarPregunta(preguntaActual + 1);
}

function mostrarPregunta(indice) {
  const formulario = document.getElementById('cuestionario-procrastinacion');
  const preguntas = formulario.querySelectorAll('.pregunta');
  const porcentaje = ((indice + 1) / preguntas.length) * 100;

  preguntas.forEach((pregunta, preguntaIndice) => {
    pregunta.hidden = preguntaIndice !== indice;
  });

  document.getElementById('progreso-texto').textContent = `Pregunta ${indice + 1} de ${preguntas.length}`;
  document.getElementById('progreso-cuestionario').style.width = `${porcentaje}%`;
  actualizarControles(indice);
  mostrarMensajeCuestionario('');
}

function actualizarControles(indice) {
  const siguiente = document.getElementById('siguiente-pregunta');
  const calcular = document.getElementById('calcular-cuestionario');
  const formulario = document.getElementById('cuestionario-procrastinacion');
  const respuesta = formulario.querySelector(`input[name="pregunta-${indice + 1}"]:checked`);
  const esUltima = indice === 4;

  siguiente.hidden = esUltima;
  calcular.hidden = !esUltima;
}

/**
 * Calcula el promedio y lo convierte a una escala de 1 a 10
 */
function calcularNivel() {
  const respuestas = [];

  for (let indice = 1; indice <= 5; indice += 1) {
    const respuesta = document.querySelector(`input[name="pregunta-${indice}"]:checked`);
    if (!respuesta) {
      mostrarMensajeCuestionario('Responde las 5 preguntas para conocer tu resultado.');
      return;
    }
    respuestas.push(Number(respuesta.value));
  }

  const promedio = respuestas.reduce((total, valor) => total + valor, 0) / respuestas.length;
  const nivelCalculado = ((promedio - 1) / 4) * 9 + 1;
  const nivel = Math.max(1, Math.min(10, Math.round(nivelCalculado)));
  mostrarResultado(nivel);
}

/**
 * Muestra el nivel, la barra y su interpretación
 */
function mostrarResultado(nivel) {
  const resultado = document.getElementById('resultado-cuestionario');
  const nivelElemento = document.getElementById('nivel-procrastinacion');
  const progreso = document.getElementById('progreso-nivel');
  const interpretacion = document.getElementById('interpretacion-nivel');
  const barra = document.querySelector('.barra-nivel');

  const interpretaciones = {
    bajo: 'Nivel bajo. Sueles mantener una buena constancia con tus actividades.',
    moderado: 'Nivel moderado. En algunas ocasiones puedes posponer actividades importantes.',
    alto: 'Nivel alto. Puedes tener dificultades para iniciar o mantener algunas actividades a tiempo.',
    muyAlto: 'Nivel muy alto. Posponer actividades parece ser una conducta frecuente y puede afectar tu organización.'
  };

  let texto;
  if (nivel <= 3) texto = interpretaciones.bajo;
  else if (nivel <= 6) texto = interpretaciones.moderado;
  else if (nivel <= 8) texto = interpretaciones.alto;
  else texto = interpretaciones.muyAlto;

  nivelElemento.textContent = nivel;
  progreso.style.width = `${nivel * 10}%`;
  barra.setAttribute('aria-valuenow', nivel);
  interpretacion.textContent = texto;
  resultado.hidden = false;
  resultado.classList.remove('resultado-visible');
  requestAnimationFrame(() => resultado.classList.add('resultado-visible'));
  mostrarMensajeCuestionario('');
}

/**
 * Reinicia respuestas y resultado
 */
function reiniciarCuestionario() {
  const formulario = document.getElementById('cuestionario-procrastinacion');
  const invitacion = document.getElementById('invitacion-cuestionario');
  const resultado = document.getElementById('resultado-cuestionario');

  formulario.reset();
  formulario.hidden = true;
  formulario.dataset.preguntaActual = '0';
  invitacion.hidden = false;
  resultado.hidden = true;
  resultado.classList.remove('resultado-visible');
  document.getElementById('progreso-cuestionario').style.width = '20%';
  document.getElementById('progreso-texto').textContent = 'Pregunta 1 de 5';
  mostrarMensajeCuestionario('');
}

function mostrarMensajeCuestionario(mensaje) {
  const elemento = document.getElementById('mensaje-cuestionario');
  if (elemento) elemento.textContent = mensaje;
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
  document.querySelectorAll('[href*="mediafire.com"]').forEach(link => {
    link.addEventListener('click', function() {
      analytics.trackEvent('app_download_attempt', {
        url: this.href,
        platform: 'MediaFire'
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
  const link = 'https://www.mediafire.com/file/dhpzb7tq1xg41pf/LUMI.apk/file';
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
    android: 'https://www.mediafire.com/file/dhpzb7tq1xg41pf/LUMI.apk/file'
  };

  analytics.trackEvent('app_download_initiated', { platform });
  window.open(links[platform], '_blank');
}

// Exportar funciones globales
window.copyDownloadLink = copyDownloadLink;
window.openDownloadPage = openDownloadPage;
window.setupScrollAnimations = setupScrollAnimations;
