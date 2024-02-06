const mongoose = require("mongoose")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Name"],
        maxlength: [30, "Your Name cannot exceed 30 charachters"],
    },
    email: {
        type: String,
        required: [true, "Please Enter Email"],
        // unique: [true, "You have Entered A Duplicate Name"],
    },
    password: {
        type: String,
        required: [true, "Please Enter Password"]
    }
})

// Encryption of password
UserSchema.pre("save", function (next) {
    if (user.isModified('password')) {
        const user = this;
        bcrypt.hash(user.password, 5, function (req, hash) {
            user.password = hash;
        })
    }
    next();
});

UserSchema.methods.getJwtToken = () => {
    return jwt.sign({ email: this.email }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    })
}
userSchema.methods.isPasswordMatch = async function (password) {
    const user = this;
    return bcrypt.compare(password, user.password);
};

userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
};
module.exports = mongoose.model("users", UserSchema)