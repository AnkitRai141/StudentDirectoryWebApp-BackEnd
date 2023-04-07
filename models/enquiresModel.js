const mongoose = require("mongoose")

// *** enqurieSchema ***
const enqueriesSchema = mongoose.Schema({
    student_id : String,
    is_communicated: String,
    summery: String,
    next_follow_required: String,
    next_follow_enqueries_date_time : String,
})
module.exports = mongoose.model("Enqueries", enqueriesSchema)