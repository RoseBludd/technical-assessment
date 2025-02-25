interface LoggerOptions {
  level: 'info' | 'warn' | 'error' | 'debug';
  timestamp?: boolean;
}

class Logger {
  private options: LoggerOptions = {
    level: 'info',
    timestamp: true
  };

  constructor(options?: Partial<LoggerOptions>) {
    this.options = { ...this.options, ...options };
  }

  private getTimestamp(): string {
    return new Date().toISOString();
  }

  private formatMessage(level: string, message: string): string {
    const timestamp = this.options.timestamp ? `[${this.getTimestamp()}] ` : '';
    return `${timestamp}[${level.toUpperCase()}] ${message}`;
  }

  info(message: string): void {
    if (this.options.level === 'debug' || this.options.level === 'info') {
      console.log(this.formatMessage('info', message));
    }
  }

  warn(message: string): void {
    if (this.options.level !== 'error') {
      console.warn(this.formatMessage('warn', message));
    }
  }

  error(message: string): void {
    console.error(this.formatMessage('error', message));
  }

  debug(message: string): void {
    if (this.options.level === 'debug') {
      console.debug(this.formatMessage('debug', message));
    }
  }
}

export const logger = new Logger(); 