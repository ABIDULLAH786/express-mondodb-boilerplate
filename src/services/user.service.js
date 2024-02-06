const ErrorHandler = require("../utils/errorHandler");
const { users } = require("../utils/usersData");

module.exports.getUserById = async (id) => {
    const userIndex = users.findIndex((user) => user.id == id);
    if (userIndex === -1) {
        throw new ErrorHandler("User not found", 404)
    }
    return users[userIndex];
};

module.exports.createUser = async (data) => {
    if (users.filter(user => user?.email == data.email)?.length > 0) {
        throw new ErrorHandler('Email already taken', 422);
    }
    const newUser = {
        id: users?.length + 1,
        firstName: data?.firstName,
        lastName: data?.lastName,
        age: data?.age,
        email: data?.email,
        phone: data?.phone,
        username: data?.username,
    };

    users.push(newUser);

    const find = users.filter(user => user?.id == newUser?.id);

    return find;
};

module.exports.getUsers = async (id) => {
    return users;
};

module.exports.updateUserById = async (id, updateUser) => {
    const userIndex = users.findIndex((user) => user.id == id);
    if (userIndex === -1) {
        throw new ErrorHandler("User not found", 404)
    }

    if (users.filter(user => user?.email == updateUser.email)?.length > 0) {
        throw new ErrorHandler('Email already taken', 422);
    }
    users[userIndex] = {
        ...users[userIndex],
        firstName: updateUser.firstName,
        lastName: updateUser.lastName,
        age: updateUser.age,
        email: updateUser.email,
        phone: updateUser.phone,
        username: updateUser.username,
    };

    return users[userIndex];
};

module.exports.deleteUserById = async (id) => {
    const userIndex = users.findIndex((user) => user.id == id);
    const find = users.filter(user => user?.id == id);
    if (userIndex < 1) {
        throw new ErrorHandler('User not found', 404);
    }

    users.splice(userIndex, 1);
    return find;
};