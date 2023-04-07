const Register = require("../models/registerModel")
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const Joi = require("joi")


// *** login schema for validation***
const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required(),
    password: Joi.number()
        .required()
})
// *** login schema  end ***


exports.loginStudent = (async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body

        const { error, value } = loginSchema.validate(req.body, { abortEarly: false })
        if (error) {
            return res.send({ error: error })
        } else {
            let login = await Register.findOne({ email })
            if (!login) {
                res.send("user not valid")
            } else {
                bcrypt.compare(password, login.password).then((result) => {
                    console.log("result", result)
                    if (result === false) {
                        res.send("user not valid ***")
                        console.log("ichcsfsffsvffs", result)
                    } else {
                        const token = jwt.sign({ u_id: login._id }, 'hhhh')
                        result ? res.send({
                            status: "OK",
                            msg: "Connected",
                            token
                        })
                            : res.send({
                                status: "err",
                                msg: "somthing wrong "
                            })
                        console.log(token)
                    }
                }
                )
            }
        }
    } catch (err) {
        res.send({ status: "ERR", msg: "somthing wrong ---" })
        console.log(err)
    }
})