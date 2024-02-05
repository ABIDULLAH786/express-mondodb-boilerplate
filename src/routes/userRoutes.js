const express = require('express');
const { register, login, getProfile, updateProfile, deleteAccount } = require('../controllers/userController');
const authentication = require("../middlewares/userAuthentication");
const { validateUserInput, validateEmailInput } = require("../middlewares/validation");

const router = express.Router();

router.route('/api/v1/users/register').post(validateUserInput,register)
router.route('/api/v1/users/login').post(login)
router.route('/api/v1/users/profile/:id').get(authentication, getProfile)
router.route('/api/v1/users/profile/:id').put(authentication, validateEmailInput, updateProfile)
router.route('/api/v1/users/profile/:id').delete(authentication, deleteAccount)

module.exports = router;