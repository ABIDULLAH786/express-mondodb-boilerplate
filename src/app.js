const express = require("express");
const app = new express();
const cors = require("cors");

const errorMiddleware = require("./middlewares/errors");
app.use(express.json());
app.use(cors());

const UserRoutes = require("./routes/UserRoutes")
app.use(UserRoutes)
app.use(errorMiddleware);

module.exports = app;
