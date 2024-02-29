const winston = require('winston');
const { combine, uncolorize, colorize, splat, printf } = winston.format
const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});
const env = process.env.NODE_ENV || 'PRODUCTION';
const logger = winston.createLogger({
  level: env === 'DEVELOPMENT' ? 'debug' : 'info',
  format: combine(
    enumerateErrorFormat(),
    env === 'DEVELOPMENT' ? colorize() : uncolorize(),
    splat(),
    printf(({ level, message }) => `${level}: ${message}`)
  ),
  transports: [
    new winston.transports.Console(),
    // the below is used for saving the error in log file
    // new winston.transports.File({ filename: 'logs/errors.log', level: "error" })
  ],
});

module.exports = logger;
