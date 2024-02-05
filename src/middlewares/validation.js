module.exports.validateUserInput = async (req, res, next) => {

    if (!req?.body?.email || !req?.body?.name || !req?.body?.password) {
        return res.status(400).send({ error: true, message: "Please fill all fields" })
    }
    else {
        if (!validateEmail(req.body.email)) {
            return res.status(400).send({ error: true, message: "Invalid email address" })
        }
        if (req.body.password.length < 8) {
            return res.status(400).send({ error: true, message: "Password must be at least 8 characters long." })
        }
        next();
    }
}
const validateEmail = (email) => {
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
        return res.status(400).send({ error: true, message: "Invalid email address" })
    }
    next();

}