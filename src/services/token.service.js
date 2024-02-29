const jwt = require('jsonwebtoken');
const moment = require('moment');
const userService = require('./user.service');
const { Token } = require('../models');
const { tokenTypes } = require('../config/tokens');
const ApiError = require('../utils/ApiError');
const { HTTP_STATUS_CODES } = require('../utils/status_codes');

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (userId, expires, type, secret = process.env.JWT_SECRET_KEY) => {
    const payload = {
        sub: userId,
        iat: moment().unix(),
        exp: expires.unix(),
        type,
    };
    return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
const saveToken = async (token, userId, expires, type, blacklisted = false) => {
    const tokenDoc = await Token.create({
        token,
        user: userId,
        expires: expires.toDate(),
        type,
        blacklisted,
    });
    return tokenDoc;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token, type, secret = process.env.JWT_SECRET_KEY) => {
    const payload = jwt.verify(token, secret);
    const tokenDoc = await Token.findOne({ token, type, user: payload.sub, blacklisted: false });
    if (!tokenDoc) {
        throw new ApiError('Invalid token', HTTP_STATUS_CODES.BAD_REQUEST);
    }
    return tokenDoc;
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user) => {
    const accessTokenExpires = moment().add(process.env.JWT_EXPIRES_TIME, 'minutes');
    const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS);

    const refreshTokenExpires = moment().add(process.env.JWT_REFRESH_EXPIRES_TIME, 'days');
    const refreshToken = generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH);
    await saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH);

    return {
        access: {
            token: accessToken,
            expires: accessTokenExpires.toDate(),
        },
        refresh: {
            token: refreshToken,
            expires: refreshTokenExpires.toDate(),
        },
    };
};

/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
const generateResetPasswordToken = async (email) => {
    const user = await userService.getUserByEmail(email);
    if (!user) {
        throw new ApiError('No users found with this email', HTTP_STATUS_CODES.NOT_FOUND);
    }
    const expires = moment().add(process.env.JWT_RESET_PASSWORD_TOKEN_EXPIRES_TIME, 'minutes');
    const resetPasswordToken = generateToken(user.id, expires, tokenTypes.RESET_PASSWORD);
    deleteTokenIfExist(user.id);
    await saveToken(resetPasswordToken, user.id, expires, tokenTypes.RESET_PASSWORD);
    return { user, resetPasswordToken };
};

/**
 * Generate verify email token
 * @param {User} user
 * @returns {Promise<string>}
 */
const generateVerifyEmailToken = async (user) => {
    const expires = moment().add(process.env.JWT_VERIFY_EMAIL_TOKEN_EXPIRES_TIME, 'minutes');
    const verifyEmailToken = generateToken(user.id, expires, tokenTypes.VERIFY_EMAIL);
    await saveToken(verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL);
    return verifyEmailToken;
};

/**
 * get  token ny user id
 * @param {Number} id
 * @returns {Promise<string>}
 */
const getTokenByUserId = async (user) => {
    const token = await Token.findOne({ user });
    return token;
};

/**
 * get  token ny user id
 * @param {Number} id (user)
 */
const deleteTokenIfExist = async (user) => {
    return await Token.deleteOne({ user });
};
module.exports = {
    generateToken,
    saveToken,
    verifyToken,
    generateAuthTokens,
    generateResetPasswordToken,
    generateVerifyEmailToken,
};