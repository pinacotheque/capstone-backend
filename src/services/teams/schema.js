import User from "../users/schema.js";
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const TeamSchema = new Schema(
    {
        game: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        date: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: false,
        },
        maxPlayers: { type: Number, default: 1, required: true, },
        user: { type: Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

TeamSchema.pre("save", async function (done) {
    try {
        const isExist = await User.findById(this.user);
        if (isExist) {
            done();
        } else {
            const error = new Error("This author does not exist");
            error.status = 400;
            done(error);
        }
    } catch (error) {
        done(error);
    }
});

export default model("Team", TeamSchema);