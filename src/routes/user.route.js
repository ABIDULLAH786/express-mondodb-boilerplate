const express = require('express');
const authentication = require("../middlewares/userAuthentication");
const { userController } = require('../controllers');

const router = express.Router();


router.route('/api/v1/users').get(userController.getAllUsers)
router.route('/api/v1/users/:id').get(userController.getUser)
router.route('/api/v1/users').post(userController.createUser)
router.route('/api/v1/users/:id').put(userController.updateUser)
router.route('/api/v1/users/:id').delete(userController.deleteUser)
router.route('/api/v1/users/profile/:id/').post(authentication, userController.getUserDetails)

module.exports = router;