// Error logging e monitoramento
class ErrorLogger {
  private static instance: ErrorLogger;
  private errors: Array<{
    timestamp: number;
    message: string;
    stack?: string;
    userAgent: string;
    url: string;
    userId?: string;
  }> = [];

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  private constructor() {
    this.setupGlobalErrorHandlers();
  }

  private setupGlobalErrorHandlers() {
    // Capturar erros JavaScript não tratados
    window.addEventListener('error', (event) => {
      this.logError({
        message: event.message,
        stack: event.error?.stack,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    // Capturar promises rejeitadas não tratadas
    window.addEventListener('unhandledrejection', (event) => {
      this.logError({
        message: `Unhandled promise rejection: ${event.reason}`,
        stack: event.reason?.stack || 'No stack trace available'
      });
    });

    // Capturar erros de React (development)
    if (process.env.NODE_ENV === 'development') {
      const originalConsoleError = console.error;
      console.error = (...args) => {
        if (args[0]?.includes?.('React')) {
          this.logError({
            message: `React Error: ${args.join(' ')}`,
            stack: new Error().stack
          });
        }
        originalConsoleError.apply(console, args);
      };
    }
  }

  logError(error: {
    message: string;
    stack?: string;
    filename?: string;
    lineno?: number;
    colno?: number;
  }) {
    const errorEntry = {
      timestamp: Date.now(),
      message: error.message,
      stack: error.stack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      filename: error.filename,
      lineno: error.lineno,
      colno: error.colno
    };

    this.errors.push(errorEntry);

    // Manter apenas os últimos 50 erros
    if (this.errors.length > 50) {
      this.errors.shift();
    }

    // Log no console em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', errorEntry);
    }

    // Em produção, enviar para serviço de monitoramento
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoringService(errorEntry);
    }
  }

  private async sendToMonitoringService(error: any) {
    try {
      // Aqui você integraria com Sentry, LogRocket, etc.
      // Por enquanto, apenas salvar no localStorage para debug
      const storedErrors = JSON.parse(localStorage.getItem('tfm.errors') || '[]');
      storedErrors.push(error);
      
      // Manter apenas os últimos 20 erros no localStorage
      if (storedErrors.length > 20) {
        storedErrors.splice(0, storedErrors.length - 20);
      }
      
      localStorage.setItem('tfm.errors', JSON.stringify(storedErrors));
    } catch (e) {
      console.warn('Failed to store error:', e);
    }
  }

  getErrors() {
    return this.errors;
  }

  getStoredErrors() {
    try {
      return JSON.parse(localStorage.getItem('tfm.errors') || '[]');
    } catch {
      return [];
    }
  }

  clearErrors() {
    this.errors = [];
    localStorage.removeItem('tfm.errors');
  }
}

export const errorLogger = ErrorLogger.getInstance();