// Script global para manejar problemas de navegación hacia atrás
document.addEventListener('DOMContentLoaded', () => {
  // Control del scroll restoration
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  // Detectar navegación hacia atrás
  let isBackNavigation = false;
  
  // Marcar navegación hacia atrás
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      isBackNavigation = true;
    }
  });

  // Función para resetear el estado del InteractiveHero
  const resetInteractiveHero = () => {
    const intro = document.getElementById('intro');
    const bienvenida = document.getElementById('bienvenida');
    const estacion1 = document.getElementById('estacion-1');
    
    if (intro) {
      intro.style.opacity = '1';
      intro.style.transform = 'scale(1)';
    }
    
    if (bienvenida) {
      bienvenida.style.opacity = '0';
      bienvenida.style.transform = 'scale(0.95) translateY(0px)';
    }
    
    if (estacion1) {
      estacion1.style.opacity = '0';
      estacion1.style.transform = 'scale(0.95)';
    }
  };

  // Reset de animaciones y scroll al navegar hacia atrás
  if (isBackNavigation || performance.navigation.type === 2) {
    // Reset de animaciones
    document.body.classList.add('reset-animations');
    
    // Reset específico del InteractiveHero
    resetInteractiveHero();
    
    // Scroll al inicio
    window.scrollTo(0, 0);
    
    // Remover reset después de un breve delay
    setTimeout(() => {
      document.body.classList.remove('reset-animations');
      isBackNavigation = false;
    }, 300);
  }

  // Asegurar que las páginas siempre comiencen en la parte superior
  window.addEventListener('load', () => {
    if (!isBackNavigation) {
      window.scrollTo(0, 0);
    }
  });

  // Manejar enlaces internos para evitar problemas de scroll
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (link) {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });

  // Reset adicional al cambiar de página
  window.addEventListener('beforeunload', () => {
    resetInteractiveHero();
  });
}); 