const mongoose = require("mongoose")

// *** fllowUpSchema for mongodb ***
const addFollowUpenquiresSchema = mongoose.Schema({
    enquires_id : String,
    is_communicated: String,
    summery: String,
    next_follow_required: String,
    next_follow_enqueries_date_time : String,
})

module.exports = mongoose.model("Add-followup",addFollowUpenquiresSchema)