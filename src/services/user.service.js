module.exports.getUserById = async (email) => {
    return User.findOne({ email });
};