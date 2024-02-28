const mongoose = require('mongoose');
const logger = require('../config/logger');

const connectDatabase = () => {
    mongoose.connect(process.env.DB_CLOUD_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(con => {
        logger.info(`server is connected on ${con.connection.host} `);
    }).catch((error) => {
        logger.error(error)
    })
}
module.exports = connectDatabase;