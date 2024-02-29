const { User } = require("../models");
const ApiError = require("../utils/ApiError");
const { HTTP_STATUS_CODES } = require('../utils/status_codes');

module.exports.getUserById = async (userId) => {
    return User.findById(userId);
};
module.exports.getUserByEmail = async (email) => {
    return User.findOne({ email });
};
module.exports.createUser = async (userBody) => {
    const user = await User.create(userBody);
    
    return user
};

module.exports.getUsers = async () => {
    return User.find();
};

module.exports.updateUserById = async (userId, updateBody) => {
    const user = await this.getUserById(userId);
    if (!user) {
        throw new ApiError('User not found', HTTP_STATUS_CODES.NOT_FOUND);
    }
    if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
        throw new ApiError('Email already taken', HTTP_STATUS_CODES.BAD_REQUEST);
    }
    Object.assign(user, updateBody);
    await user.save();
    return user;
};

module.exports.deleteUserById = async (userId) => {
    const user = await this.getUserById(userId);
    if (!user) {
        throw new ApiError('User not found', HTTP_STATUS_CODES.NOT_FOUND);
    }
    await user.remove();
    return user;
};


module.exports.getUserDetailsById = async (userId) => {
    const user = await this.getUserById(userId);
    return user;
};