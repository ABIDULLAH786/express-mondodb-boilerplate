const express = require("express");
const cors = require("cors");
const { HTTP_STATUS_CODES } = require("./utils/status_codes");
const ApiError = require("./utils/ApiError");
const morgan = require('./config/margon');
const {  errorHandler } = require("./middlewares/error");
const dotenv = require("dotenv");

dotenv.config({ path: "src/config/config.env" });
const app = new express();

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// enable cors
app.use(cors());



// logs HTTP requests to help in debuging and monitoring web server activity.
app.use(morgan.successHandler);
app.use(morgan.errorHandler);

// API Routes
const { userRoute, authRoute, docRoute } = require("./routes");
app.get('/', (req, res) => {
    res.send("Server is on Fire")
})
app.use('/v1', docRoute)
app.use('/v1', authRoute)
app.use('/v1', userRoute)

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new ApiError('Not found',HTTP_STATUS_CODES.NOT_FOUND));
});


// handle error
app.use(errorHandler); // error handler should be below API routes




module.exports = app;
