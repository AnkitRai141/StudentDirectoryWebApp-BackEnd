const Register = require("../models/registerModel")
const bcrypt = require("bcrypt")
const Joi = require("joi")
const saltRounds = 10


// ***  registerSchema for validation ***
const regSchema = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    confirmPassword: Joi.string().min(8).required(),
    mobNumber: Joi.number().min(10).required()
})
// ***  registerSchema for validation end***

exports.registerStudent = (async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            confirmPassword,
            mobNumber
        } = req.body

        const { error } = regSchema.validate(req.body, { abortEarly: false })
        if (error) {
            res.send({ error: error })
        } else {
            const u_password = await bcrypt.hash(password, saltRounds)
            console.log(u_password)
            const regStudent = {
                name,
                email,
                password: u_password,
                confirmPassword,
                mobNumber
            }
            let reg_Res = await Register.create(regStudent)
            console.log(reg_Res)
            res.send({ status: "OK", msg: "Data Posted  Succesfully", data: reg_Res })
        }
    } catch (err) {
        res.send({ status: "ERR", msg: "Somthing went wrong" })
        console.log(err)
    }
})

// exports.registerStudent = (async (req, res) => {

//     const {
//         name,
//         email,
//        password,
//         confirmPassword,
//         mobNumber
//     } = req.body
//     const password1 = await bcrypt.hash(password, saltRounds)

//     try {
//         const regStudent = { name, email,password: password1, confirmPassword: password1, mobNumber }
//         const res = await Register.create(regStudent)
//         res.send({ status: "OK", msg: "Data Posted  Succesfully", data: null })
//         console.log(res)
//     } catch (err) {
//         res.status({ status: "ERR", msg: "Somthing went wrong" })
//         console.log(err)
//     }
// })