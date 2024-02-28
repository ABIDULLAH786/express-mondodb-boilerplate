const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");
const { HTTP_STATUS_CODES } = require("../utils/status_codes");
const { tokenTypes } = require("../config/tokens");
require("dotenv").config();

const authToken = (req, res, next) => {

    // Option 1
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer Token

    // Option 2
    // const token = req.header("x-auth-token");

    // If token not found, send error message
    if (!token) {
        throw new ErrorHandler("Token not found", HTTP_STATUS_CODES.NOT_FOUND)
    }

    // Authenticate token
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (payload) {
            next();
        } else {
            throw new ErrorHandler("Unathorized", HTTP_STATUS_CODES.UNAUTHORIZED)

        }

    } catch (err) {
        // Handling wrong JWT error
        if (err.name === 'JsonWebTokenError') {
            return res.status(403).send({ error: true, message: "JSON Web Token is invalid" });
        }

        // Handling Expired JWT error
        if (err.name === 'TokenExpiredError') {
            return res.status(400).send({ error: true, message: "JSON Web Token is expired, login again" });
        }


    }
};

module.exports = authToken;