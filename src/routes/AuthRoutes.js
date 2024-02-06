const express = require('express');
const { validateUserInput, validateEmailInput } = require("../middlewares/validation");
const { register, login } = require('../controllers/authController');

const router = express.Router();

router.route('/api/v1/auth/register').post(validateUserInput, validateEmailInput, register)
router.route('/api/v1/auth/login').post(validateUserInput, login)


module.exports = router;