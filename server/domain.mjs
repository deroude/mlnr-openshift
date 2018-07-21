import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

var UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    name: String,
    rank: String,
    active: Boolean,
    role: String
})

UserSchema.plugin(passportLocalMongoose, { usernameField: "email", hashField: "password" });

export const User = mongoose.model('User', UserSchema);