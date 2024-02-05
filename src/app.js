const express = require("express");
const app = new express();
const cors = require("cors");

const errorMiddleware = require("./middlewares/errors");
app.use(express.json());
app.use(cors());

const userRoutes = require("./routes/userRoutes")
const PersonRouter = require("./routes/PersonRoutes");
app.use(userRoutes)
app.use(errorMiddleware);

app.use(PersonRouter);
module.exports = app;
