const express = require('express');
const authentication = require("../middlewares/userAuthentication");
const { userController } = require('../controllers');

const router = express.Router();


router.route('/api/users').get(userController.getAllUsers)
router.route('/api/users/:id').get(userController.getUser)
router.route('/api/users').post(userController.createUser)
router.route('/api/users/:id').put(userController.updateUser)
router.route('/api/users/:id').delete(userController.deleteUser)
router.route('/api/users/profile/:id/').post(authentication, userController.getUserDetails)

module.exports = router;