async function authenticate({ email, password }) {
    const user = await UserModel.findOne({ email: email.trim() });
    if (user) {
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            return user._id;
        }
    } else {
        return false;
    }

}