import { createLogger, transports, format } from 'winston';

export const logger = createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: format.combine(
    format.errors({ stack: true }),
    format((info) => ({ ...info, level: info.level.toUpperCase() }))(),
    format.colorize({ level: true }),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.prettyPrint(),
    format.splat(),
    format.printf(
      (info) => `[${info.timestamp}] ${info.level} ${info.message}`,
    ),
  ),
  transports: [new transports.Console()],
});
