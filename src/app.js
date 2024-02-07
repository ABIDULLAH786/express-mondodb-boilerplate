const express = require("express");
const app = new express();
const cors = require("cors");

const errorMiddleware = require("./middlewares/errors");
app.use(express.json());
app.use(cors());

const { userRoute, authRoute } = require("./routes")
app.use(authRoute)
app.use(userRoute)
app.use(errorMiddleware);

module.exports = app;
