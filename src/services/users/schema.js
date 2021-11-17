import bcrypt from "bcrypt";
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const UsersSchema = new Schema(
    {
        username: { type: String, required: true, default: "Username" },
        name: { type: String, required: true, default: "Name" },
        email: { type: String, required: true },
        password: { type: String, required: true },
        avatar: { type: String },
    },
    { timestamps: true }
);

//********** HASH THE PASSWORDS **********

UsersSchema.pre("save", async function (next) {
    const newUser = this;
    const plainPW = newUser.password;
    if (newUser.isModified("password")) {
        newUser.password = await bcrypt.hash(plainPW, 10);
    }
    next();
});

//********** HIDES PASSWORD AND __V FROM JSON RETURN **********

UsersSchema.methods.toJSON = function () {
    const userDocument = this;
    const userObject = userDocument.toObject();
    delete userObject.password;
    delete userObject.__v;
    return userObject;
};

//********** COMPARE PASSWORDS **********

UsersSchema.statics.checkCredentials = async function (email, plainPW) {
    const user = await this.findOne({ email });
    if (user) {
        const isMatch = await bcrypt.compare(plainPW, user.password);
        return isMatch ? user : null;

    } else {
        return null;
    }
};

//********** MONGOOSE GETUSERS **********

UsersSchema.static("getUser", async function (id) {
    const user = await this.findOne({ _id: id })
    console.log(user);
    return user;
});

export default new model("User", UsersSchema);
