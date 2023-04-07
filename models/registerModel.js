const mongoose = require("mongoose")

// *** registerSchema  for mongodb***
const registerSchema = mongoose.Schema({
    name: String,
    email: String,
   password: String,
    confirmPassword : String,
    mobNumber : String

})

module.exports = mongoose.model("Register", registerSchema)