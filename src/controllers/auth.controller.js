const { authService, userService, tokenService, emailService } = require('../services');
const catchAsyncErrors = require('../utils/catchAsyncError');
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
    res.status(HTTP_STATUS_CODES.NO_CONTENT).send();
});

const refreshTokens = catchAsyncErrors(async (req, res) => {
    const tokens = await authService.refreshAuth(req.body.refreshToken);
    res.send({ ...tokens });
});

const forgotPassword = catchAsyncErrors(async (req, res) => {
    const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
    await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
    res.status(HTTP_STATUS_CODES.NO_CONTENT).send();
});

const resetPassword = catchAsyncErrors(async (req, res) => {
    await authService.resetPassword(req.query.token, req.body.password);
    res.status(HTTP_STATUS_CODES.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsyncErrors(async (req, res) => {
    const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.body);
    await emailService.sendVerificationEmail(req.body, verifyEmailToken);
    res.status(HTTP_STATUS_CODES.NO_CONTENT).send();
});

const verifyEmail = catchAsyncErrors(async (req, res) => {
    console.log("verify email api end point")
    console.log(req)
    const token = req?.query?.token || req.body.token
    await authService.verifyEmail(token);
    res.status(HTTP_STATUS_CODES.NO_CONTENT).send();
});

module.exports = {
    register,
    login,
    logout,
    refreshTokens,
    forgotPassword,
    resetPassword,
    sendVerificationEmail,
    verifyEmail,
};