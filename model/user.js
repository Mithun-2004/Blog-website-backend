const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    signupName : {
        type : String,
        required : true
    },
    signupEmail : {
        type : String,
        required : true
    },
    signupPassword : {
        type : String,
        required : true
    }
})

const User = mongoose.model("User", userSchema);

module.exports = User;