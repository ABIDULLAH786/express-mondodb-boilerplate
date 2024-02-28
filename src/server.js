const app = require("./app");
const logger = require('./config/logger');
const dotenv = require("dotenv");

dotenv.config({ path: "src/config/config.env" });

const connectDatabase = require("./database/connection");


connectDatabase();

const server = app.listen(process.env.PORT, () => {
  logger.info('Connected to MongoDB');
  logger.info(`Server is port ${process.env.PORT} in ${process.env.NODE_ENV} =>  htpp://localhost:${process.env.PORT}`);
});

process.on("unhandledRejection", (err) => {
  logger.error(`Error name : ${err.name} , Error msg ${err.message}  `);
  logger.warn("Shutting down Server due to  Rejection Errors");
  server.close(() => {
    logger.info('Server closed');
    process.exit(1);
  });
});
const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);