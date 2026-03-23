export type LogLevel = 'info' | 'error' | 'network';

export const logger = {
  info(scope: string, message: string, meta?: unknown) {
    console.info(`[${scope}] ${message}`, meta ?? '');
  },
  error(scope: string, message: string, meta?: unknown) {
    console.error(`[${scope}] ${message}`, meta ?? '');
  },
  network(scope: string, message: string, meta?: unknown) {
    console.debug(`[${scope}] ${message}`, meta ?? '');
  }
};
