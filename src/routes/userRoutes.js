const express = require('express');
const authentication = require("../middlewares/userAuthentication");
const { getAllUsers, getUser, createUser, updateUser, deleteUser } = require('../controllers/usersController');

const router = express.Router();


router.route('/api/v1/users').get(getAllUsers)
router.route('/api/v1/users/:id').get(getUser)
router.route('/api/v1/users').post(createUser)
router.route('/api/v1/users/:id').put(updateUser)
router.route('/api/v1/users/:id').delete(deleteUser)

module.exports = router;