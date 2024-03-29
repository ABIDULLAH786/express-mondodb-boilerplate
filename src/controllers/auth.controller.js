const { authService, userService, tokenService, emailService } = require('../services');
const catchAsyncErrors = require('../utils/catchAsyncError');
const ApiError = require('../utils/ApiError');
const { HTTP_STATUS_CODES } = require('../utils/status_codes');

const register = catchAsyncErrors(async (req, res) => {
    const user = await userService.createUser(req.body);
    const token = await tokenService.generateVerifyEmailToken(user);
    await emailService.sendVerificationEmail(user, token);
    res.status(HTTP_STATUS_CODES.CREATED).json({ message: "User registered successfully, will recive verification link via email" });
});

const login = catchAsyncErrors(async (req, res) => {
    const { email, password } = req.body;
    const user = await authService.loginUserWithEmailAndPassword(email, password);
    const tokens = await tokenService.generateAuthTokens(user);
    res.status(HTTP_STATUS_CODES.ACCEPTED).send({ user, tokens });
});

const logout = catchAsyncErrors(async (req, res) => {
    await authService.logout(req.body.refreshToken);
    res.status(HTTP_STATUS_CODES.OK).json({ status: 'ok' });
});

const refreshTokens = catchAsyncErrors(async (req, res) => {
    const tokens = await authService.refreshAuth(req.body.refreshToken);
    res.send({ ...tokens });
});

const forgotPassword = catchAsyncErrors(async (req, res) => {
    if (!req.body.email) throw new ApiError("Required Data is missing", HTTP_STATUS_CODES.BAD_REQUEST)

    const { user, resetPasswordToken } = await tokenService.generateResetPasswordToken(req.body.email);
    await emailService.sendResetPasswordEmail(user, resetPasswordToken);
    res.status(HTTP_STATUS_CODES.OK).json({ delivered: 1, status: 'ok' });
});

const resetPassword = catchAsyncErrors(async (req, res) => {
    if (!req.body.password) throw new ApiError("Required Data is missing", HTTP_STATUS_CODES.BAD_REQUEST)

    await authService.resetPassword(req.body.token, req.body.password);
    res.status(HTTP_STATUS_CODES.OK).json({ status: 'ok', message: "Password changed successfully" });
});

const testEmail = catchAsyncErrors(async (req, res) => {
    await emailService.testEmail(req.body.email);
    res.status(HTTP_STATUS_CODES.OK).json({ delivered: 1, status: 'ok' });
});

const verifyEmail = catchAsyncErrors(async (req, res) => {
    const token = req?.query?.token || req.body.token
    await authService.verifyEmail(token);
    res.status(HTTP_STATUS_CODES.OK).json({ delivered: 1, status: 'ok' });
});

module.exports = {
    testEmail,
    register,
    login,
    logout,
    refreshTokens,
    forgotPassword,
    resetPassword,
    verifyEmail,
};