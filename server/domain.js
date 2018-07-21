var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    name: String,
    rank: String,
    active: Boolean,
    role: String
})

UserSchema.plugin(passportLocalMongoose, { usernameField: "email", hashField: "password" });

module.exports = mongoose.model('User', UserSchema);