const mongoose = require("mongoose")

const studenPaginationSchema = mongoose.Schema({
    name : String,
    email : String,
    mobnumber : String,
    whatsappno : String,
    gender : String,
    dob : String,
    address : String,
    workexprience : String,
    company : String,

})