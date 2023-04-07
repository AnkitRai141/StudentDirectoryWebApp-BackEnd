const Students = require("../models/geeksModel")
const Joi = require("joi")
const multer = require("multer")

// *** add student  function *** 
exports.addStudent = ((async (req, res) => {
    try {

        // *** studentSchema for validation ***
        const studentSchema = Joi.object({
            name: Joi.number()
                .min(3)
                .max(30)
                .required(),

            email: Joi.string()
                .email()
                .required(),

            mobnumber: Joi.number()
                .required(),

            whatsappno: Joi.number()
                .required(),

            gender: Joi.string()
                .required(),

            dob: Joi.number()
                .required(),

            courseName: Joi.string()
                .required(),

            fees: Joi.number()
                .required(),

            address: Joi.string()
                .required(),

            workexprience: Joi.string()
                .required(),

            company: Joi.string()
                .required()
        })
        // *** studentSchema for validation end ***

        const { error, value } = studentSchema.validate(req.body, { abortEarly: false })
        if (error) {
            console.log(error)
            return res.send({ error: error })
        }
        const insertedData = {
            name,
            email,
            mobnumber,
            whatsappno,
            gender,
            dob,
            courseName,
            fees,
            address,
            workexprience,
            company,
        }
        const students = await Students.create(insertedData)
        res.send({
            status: "OK",
            msg: "Data Posted  Succesfully",
            data: students
        })
        // console.log("students ----", students)
    } catch (err) {
        res.send({
            status: "ERR",
            msg: "Somthing went wrong"
        })
        console.log(err)
    }
}))
// *** add student  function end *** 


// *** get allStudent function ***
exports.getAllStudent = (
    async (req, res) => {
        try {
            let { query, page, limit, sortBy, sortType } = req.body
            const params = [
                "name",
                "email",
                "mobnumber",
                "whatsappno",
                "gender",
                "dob",
                "address",
                "workexprience",
                "company"
            ]
            let searchNameQuery = []

            for (let each in params) {
                let key = params[each]
                let value = { $regex: `.*${query}.*`, $options: "i" }
                searchNameQuery.push({ [key]: value })
            }

            page = page ? page : 1
            limit = limit ? limit : 5
            sortBy = sortBy ? sortBy : "name"
            sortType = sortType ? sortType : "ASC"

            let students = await Students.aggregate([
                { $match: { $or: searchNameQuery } },
                { $sort: { [sortBy]: sortType === 'ACS' ? 1 : -1 } },
                { $skip: (page - 1) * limit },
                { $limit: limit },
            ])

            let count = await Students.aggregate([
                { $match: {} },
                { $count: "totalRecords" }
            ])
            res.send({
                status: "OK",
                msg: "Data Fetched  Succesfully",
                data: {
                    students,
                    count
                }
            })
            // console.log(token)
        } catch (err) {
            res.status({
                status: "ERR",
                msg: "Error while fetching Data",
                data: null
            },
                err)
        }
    })
// *** get allStudent function end ***

// *** get singleStudent  function *** 
exports.singleStudent = (
    async (req, res) => {
        let { studentId } = req.params
        // console.log("Id from Single student controller", studentId)
        try {
            let student = await Students.findById({ _id: studentId })
            // console.log(student)
            res.send({
                status: "OK",
                msg: "Student Fetched Successfully",
                data: student
            })
        } catch (e) {
            res.status({
                status: "ERR",
                msg: "Error while fetching  student Data"
            })
            // console.log(e)
        }
    })
// *** get singleStudent  function end *** 


// *** edit student function ***
exports.editStudent = (
    async (req, res) => {
        const { name, email, mobnumber, whatsappno, gender, dob, address, workexprience, company } = req.body
        // console.log(req.body)
        let { studentId } = req.params
        try {
            await Students.findOneAndUpdate({ _id: studentId }, {
                $set: {
                    name,
                    email,
                    mobnumber,
                    whatsappno,
                    gender,
                    dob,
                    address,
                    workexprience,
                    company
                }
            })
            res.send({
                status: "OK",
                msg: "Data Update Succesfully",
                data: null
            })
        } catch (err) {
            res.send({
                status: "ERR",
                msg: "Somthing went Wrong ",
                data: null
            })
        }
    })
// *** edit student function end ***


// *** delete student function ***
exports.deleteStudents = (
    async (req, res) => {
        let { studentId } = req.params
        // console.log(studentId)
        try {
            await Students.deleteMany({ _id: studentId })
            res.send({
                status: "OK",
                msg: "Data Deleted Succesfully",
                data: null
            })
        } catch (err) {
            res.send({
                status: "ERR",
                msg: " Somthing went wrong In Deletion ",
                data: null
            })
        }
    })
// *** delete student function end ***
