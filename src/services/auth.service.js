const tokenService = require('./token.service');
const userService = require('./user.service');
const Token = require('../models/token.model');
const { tokenTypes } = require('../config/tokens');
const { HTTP_STATUS_CODES } = require('../utils/status_codes');
const ErrorHandler = require('../utils/errorHandler');
const { emailService } = require('.');

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
module.exports.loginUserWithEmailAndPassword = async (email, password) => {
    const user = await userService.getUserByEmail(email);
    if (!user || !(await user?.isPasswordMatch(password))) {
        throw new ErrorHandler('Incorrect email or password', HTTP_STATUS_CODES.UNAUTHORIZED);
    }
    return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
module.exports.logout = async (refreshToken) => {
    const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
    if (!refreshTokenDoc) {
        throw new ErrorHandler('Not found', HTTP_STATUS_CODES.NOT_FOUND);
    }
    await refreshTokenDoc.remove();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
module.exports.refreshAuth = async (refreshToken) => {
    try {
        const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
        const user = await userService.getUserById(refreshTokenDoc.user);
        if (!user) {
            throw new Error();
        }
        await refreshTokenDoc.remove();
        return tokenService.generateAuthTokens(user);
    } catch (error) {
        throw new ErrorHandler('Please authenticate', HTTP_STATUS_CODES.UNAUTHORIZED);
    }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
module.exports.resetPassword = async (resetPasswordToken, newPassword) => {
    try {
        const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
        const user = await userService.getUserById(resetPasswordTokenDoc.user);
        if (!user) {
            throw new Error();
        }
        await userService.updateUserById(user.id, { password: newPassword });
        await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
    } catch (error) {
        throw new ErrorHandler('Password reset failed', HTTP_STATUS_CODES.UNAUTHORIZED);
    }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
module.exports.verifyEmail = async (verifyEmailToken) => {
    const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    if (!verifyEmailTokenDoc) {
        throw new Error("User info not found.", 400);
    }
    const user = await userService.getUserById(verifyEmailTokenDoc.user);
    if (!user) {
        throw new Error("User info not found.", 400);
    }
    const verified = await userService.updateUserById(user.id, { email: user.email, verified: true });
    if (verified) {
        // await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
        emailService.sendVerifiedConfirmation(user)
    } else {
        throw new ErrorHandler('Email verification failed', HTTP_STATUS_CODES.BAD_REQUEST);
    }
};

