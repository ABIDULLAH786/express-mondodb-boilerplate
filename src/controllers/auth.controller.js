const { authService, userService, tokenService, emailService } = require('../services');
const catchAsyncErrors = require('../utils/catchAsyncError');
const { HTTP_STATUS_CODES } = require('../utils/status_codes');

const register = catchAsyncErrors(async (req, res) => {
    await userService.createUser(req.body);
    // const tokens = await tokenService.generateAuthTokens(user);
    res.status(HTTP_STATUS_CODES.CREATED)//.json({ message: "User registered successfully" });
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
    const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
    await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
    res.status(HTTP_STATUS_CODES.NO_CONTENT).send();
});

const verifyEmail = catchAsyncErrors(async (req, res) => {
    await authService.verifyEmail(req.query.token);
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