const { users } = require("../utils/usersData");
const catchAsyncErrors = require('../utils/catchAsyncError');
const { userService } = require('../services')

module.exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await userService.getUsers();
    res.send(users);
})

module.exports.getUser = catchAsyncErrors(async (req, res, next) => {
    const user = await userService.getUserById(req.params.id);
    res.send(user);
})

module.exports.createUser = catchAsyncErrors(async (req, res, next) => {
    const user = await userService.createUser(req?.body);
    res.send(user);
})

module.exports.updateUser = catchAsyncErrors(async (req, res, next) => {
    const response = await userService.updateUserById(req.params.id,req.body);
    res.send(response);
})

module.exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const response = await userService.deleteUserById(req.params.id);
    res.send(response);
})