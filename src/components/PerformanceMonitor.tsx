import { useEffect } from 'react';

// Component para monitorar performance básica
export function PerformanceMonitor() {
  useEffect(() => {
    // Monitor básico de performance sem dependências externas
    const checkPerformance = () => {
      if (typeof window !== 'undefined' && 'performance' in window) {
        try {
          // Medir tempo de carregamento da página
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          
          if (navigation) {
            const loadTime = navigation.loadEventEnd - navigation.fetchStart;
            const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
            
            if (process.env.NODE_ENV === 'development') {
              console.log('Performance Metrics:', {
                loadTime: `${loadTime}ms`,
                domContentLoaded: `${domContentLoaded}ms`,
                firstPaint: performance.getEntriesByType('paint').find(p => p.name === 'first-paint')?.startTime || 'N/A'
              });
            }
          }
        } catch (error) {
          console.warn('Performance monitoring not available:', error);
        }
      }
    };

    // Verificar performance após carregamento completo
    if (document.readyState === 'complete') {
      setTimeout(checkPerformance, 1000);
    } else {
      window.addEventListener('load', () => setTimeout(checkPerformance, 1000));
    }
  }, []);

  return null;
}