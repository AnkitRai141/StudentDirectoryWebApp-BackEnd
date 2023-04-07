const mongoose =  require("mongoose")

// *** coourseSchema ***
const courseSchema =  mongoose.Schema({
    courseName : String
},
{
    timestamps:true
})

module.exports = mongoose.model("Course" , courseSchema)