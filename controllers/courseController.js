const Course = require("../models/course")

exports.fetchCourse = (async (req, res) => {
    try {
        let course = await Course.find({})
        res.send({ status: "OK", msg: "Data Fetched Succesfully", data: course })
    } catch (e) {
        res.send({ status: "ERR", msg: " Somthing Went Wrong ", data: null })
    }
})