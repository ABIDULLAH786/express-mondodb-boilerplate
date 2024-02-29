const morgan = require('morgan');
const logger = require('./logger');

// morgan.token('message', (req, res, err) => res.locals.errorMessage || '');

const getIpFormat = () => (process.env.NODE_ENV === 'PRODUCTION' ? ':remote-addr - ' : '');
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;

const successHandler = morgan(successResponseFormat, {
    skip: (req, res) => res.statusCode >= 400,
    stream: { write: (message) => logger.http(message.trim()) },
});

const errorHandler = morgan(errorResponseFormat, {
    skip: (req, res) => res.statusCode < 400,
    stream: { write: (message) => logger.error(message.trim()) },
});

module.exports = {
    successHandler,
    errorHandler,
};
