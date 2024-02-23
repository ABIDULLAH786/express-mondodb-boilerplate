const express = require('express');
const { authController } = require('../controllers');

const router = express.Router();

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);
router.post('/auth/refresh-tokens', authController.refreshTokens);
router.post('/auth/forgot-password', authController.forgotPassword);
router.post('/auth/reset-password', authController.resetPassword);

router.post('/auth/send-verification-email', authController.sendVerificationEmail);
router.post('/auth/verify-email', authController.verifyEmail);

module.exports = router;

