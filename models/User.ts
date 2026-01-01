import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: String,
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    googleSub: { type: String, required: false, unique: true, sparse: true },
    name: String,
    //avatarLink: { type: String, required: false}
},
{
    timestamps: true
});

export const User = models.User || model("User", UserSchema);