const mongoose = require("mongoose")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { roles } = require('../config/roles');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Name"],
        maxlength: [30, "Your Name cannot exceed 30 charachters"],
    },
    email: {
        type: String,
        required: [true, "Please Enter Email"],
        unique: [true, "Email Already in use"],
    },
    password: {
        type: String,
        required: [true, "Please Enter Password"]
    },
    role: {
        type: String,
        enum: roles,
        default: 'user',
    },
})

// Encryption of password
UserSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();

    // bcrypt.hash(user.password, 5, function (req, hash) {
    //     user.password = hash;
    //     next();
    // })
});

UserSchema.methods.getJwtToken = () => {
    return jwt.sign({ email: this.email }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    })
}
UserSchema.methods.isPasswordMatch = async function (password) {
    return bcrypt.compare(password, this.password);
};

UserSchema.statics.isEmailTaken = async function (email, excludeUserId) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    console.log(user)
    return !!user;
};
module.exports = mongoose.model("users", UserSchema)