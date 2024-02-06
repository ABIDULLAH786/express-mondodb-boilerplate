const UserModel = require("../models/userModel")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")

module.exports.login = catchAsyncErrors(async (req, res, next) => {
    try {
        const { email, password } = req.body

        // chech weather the user with provided email exist in the system
        const find = await UserModel.findOne({ email: email.trim() })
        if (find.length === 0)
            return res.status(200).send({ message: "This email is not associated with any account" })

        const match = await bcrypt.compare(password, find.password);
        if (match) {

            const accessToken = jwt.sign(
                { id: find._id },
                process.env.JWT_SECRET_KEY,
                {
                    expiresIn: process.env.JWT_EXPIRES_TIME
                }
            );
            return res.status(202).json({ accessToken, id: find._id, message: "Login Done" })

        } else {
            return res.status(404).json({ message: "Invalid Data Entered" })
        }

    } catch (err) {
        res.status(500).send({ message: "Internal Server Error" });
    }
})


module.exports.register = catchAsyncErrors(async (req, res, next) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            return res.status(400).send({
                success: false,
                error: "Missing required field",
                message: "Please include/fill all the fields in your request."
            })
        }

        // check weather the user already registered or not
        const find = await UserModel.find({ email: email.trim() })
        if (find.length !== 0)
            return res.status(200).send({ message: "This email is already used" })

        const userCreated = await UserModel.create({
            name: name.trim(), email: email.trim(), password
        });

        if (!userCreated) {
            return res.status(400).send({ message: "Error Occured while creating account" });
        }
        res.status(201).json({
            message: "Account successfully created",
        })
    } catch (err) {
        res.status(500).send({ message: "Internal Server Error" });
    }

})

