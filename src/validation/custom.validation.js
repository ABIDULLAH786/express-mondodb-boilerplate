const ApiError = require("../utils/ApiError");

module.exports.objectId = (value, helpers) => {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
        throw new ApiError(`${value} must be a valid mongo id`, 400);
    }
    return value;
};

module.exports.password = (value, helpers) => {
    if (value.length < 8) {
        throw new ApiError('password must be at least 8 characters', 400);
    }
    if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
        throw new ApiError('password must contain at least 1 letter and 1 number', 400);
    }
    return value;
};

module.exports.validateUserInput = async (req, res, next) => {

    if (!req?.body?.email || !req?.body?.name || !req?.body?.password) {
        throw new ApiError('Please fill all fields', 400);
    }
    else {
        if (!validateEmail(req.body.email)) {
            throw new ApiError('Invalid email address', 400);
        }
        if (req.body.password.length < 8) {
            throw new ApiError('Password must be at least 8 characters long.', 400);
        }
        next();
    }
}
module.exports.validateEmail = (email) => {
    var reg = /^((?!\.)[\w-.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/
    if (!email)
        return false;

    if (email.length > 254)
        return false;

    var valid = reg.test(email);
    if (!valid)
        return false;

    // Further checking of some things regex can't handle
    var parts = email.split("@");
    if (parts[0].length > 64)
        return false;

    var domainParts = parts[1].split(".");
    if (domainParts.some(function (part) { return part.length > 63; }))
        return false;

    return true;
};

module.exports.validateEmailInput = async (req, res, next) => {
    if (!validateEmail(req.body.email)) {
        throw new ApiError('Invalid email address', 400);
    }
    next();

}

