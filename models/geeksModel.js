const mongoose = require("mongoose")

// *** studentSchema for mongdb ***
const studentSchema = mongoose.Schema({
    name: String,
    email: String,
    mobnumber: String,
    whatsappno: String,
    gender: String,
    dob: String,
    courseName: [String],
    fees : String,
    address: String,
    workexprience: String,
    company: String,
    createdBy : String
})

module.exports = mongoose.model("Students", studentSchema)