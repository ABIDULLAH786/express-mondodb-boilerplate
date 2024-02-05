const mongoose = require('mongoose')

const connectDatabase = () => {
    mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(con => {
        console.log(`server is connected on ${con.connection.host} `);
    }).catch((error) => {
        console.log(error)
    })
}
module.exports = connectDatabase;