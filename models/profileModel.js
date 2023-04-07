const mongoose = require("mongoose")
// *** profileSchema for mongodb**
const profileSchema = mongoose.Schema({
    name :{
        type: String,
        required : true
    },
})

module.exports = mongoose.model("Profile",profileSchema)