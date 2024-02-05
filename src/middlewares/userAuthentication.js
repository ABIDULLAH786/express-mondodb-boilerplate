const jwt = require("jsonwebtoken");
require("dotenv").config();

const authToken = (req, res, next) => {
    // Option 1
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer Token

    // Option 2
    // const token = req.header("x-auth-token");

    // If token not found, send error message
    if (!token) {
       return res.status(401).send({ error: true, message: "Token not found" });
    }

    // Authenticate token
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (user) {
            next();
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