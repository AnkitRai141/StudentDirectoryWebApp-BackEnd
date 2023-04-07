const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const Profile = require("./models/profileModel")
const Students = require("./models/geeksModel")
const secretKey = "hhhh"
const Joi = require("joi")
const path = require('path')
const cors = require("cors")
const multer = require("multer")

// *** file extension type check ***
const storage = multer.diskStorage({
    limits: { fileSize: 1000000 },
    destination: function (req, file, cb) {
        return cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`)
    },
})
const fileFilter = (req, file, cb) => {
    checkfileType(file, cb)
}
const checkfileType = ((file, cb) => {
    const fileType = /png || jpeg || jpg /
    const extName = fileType.test(path.extname(file.originalname).toLowerCase())
    const mimetype = fileType.test(file.mimetype)
    if (mimetype && extName) {
        return cb(null, true)
    } else {
        cb("Error : you can only upload images only")
    }
})
const upload = multer({ storage: storage, fileFilter })
// *** file extension type check end ***



// controllers imported  --
const studentControler = require("./controllers/studentController")
const couseController = require("./controllers/courseController")
const registerController = require("./controllers/registerController")
const loginController = require("./controllers/loginController")
const { count } = require("./models/geeksModel")

// *** middleware use ***
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use("/uploads", express.static(path.join(__dirname, 'uploads')))


//*** MongoDB connection  *//
const MONGODB_URL = `mongodb+srv://141raiankit:141raiankit@cluster0.zupm4b5.mongodb.net/Geeksdoor?retryWrites=true&w=majority`
mongoose.connect(MONGODB_URL).then(() => {
    console.log("DataBase is Connected")
}).catch(() => {
    console.log("Database is Not Connected***")
})
//*** MongoDB connection  end ***//

// *** verify token & decode token 
const verifyToken = (async (req, res, next) => {
    let token = req.headers.authorization
    console.log("token from login from app** ", token)
    try {
        if (token === null) {
            res.send("no token provided ")
        } else {
            const decodeToken = jwt.verify(token, secretKey)
            req.register = decodeToken
            console.log(decodeToken)
            next()
        }
    } catch (err) {
        res.send(" no token ")
    }
})

// All routes ###

//  *** Login student *** 
app.post("/login", loginController.loginStudent)

// *** Register  student in database ***
app.post("/register", registerController.registerStudent)

// *** Add Student in Database ***
app.post("/student", verifyToken, studentControler.addStudent)

// *** Get All Students from database ***
app.post("/students", verifyToken, studentControler.getAllStudent)

// *** get  Single Student data from databse ***
app.get("/student/:studentId", verifyToken, studentControler.singleStudent)

// *** Edit and Update Student data in database ***
app.put("/students/:studentId", studentControler.editStudent)

// *** Delete Student from database ***
app.delete("/student/:studentId", studentControler.deleteStudents)

// ** Fetch course Data from database  ***
app.get("/course", couseController.fetchCourse)


// ** post  File Upload  ***
app.post("/profile", upload.single("image"), async (req, res, next) => {

    try {
        const name = req.file.path
        const file = req.file
        await Profile.create({ name })
        res.send({ status: "OK", msg: "file uploaded  Succesfully", data: { name, file } })
        console.log(file)
    } catch (err) {
        res.send({ status: "ERR", msg: " somthing went wrong file uploading " })
        console.log(err)
    }
})
// ** post  File Upload end ***


//  ***  post course  into database**
// app.post("/course",async(req , res)=>{
//     const { courseName } = req.body
//     let insertCourse = {
//         courseName
//     }
//     try{
//         await Course.create(insertCourse)
//         res.send({ status: "OK", msg: "Data Posted  Succesfully", data: null })
//     } catch (err){
//         res.send({ status: "ERR", msg: "Somthing Went Wrong" })

//     }
// })
//  ***  post course  into database end**

//  *** Post  filter or  course &fees  ***
app.post("/filter", async (req, res) => {
    try {
        const { courseName, maxFees, minFees } = req.query
        const filterData = await Students.aggregate([
            {
                $match: {
                    $and: [
                        {
                            courseName: { $in: [courseName] },
                        },
                        {
                            fees: { $gte: minFees, $lte: maxFees }
                        },
                    ]
                },
            }
        ])
        res.send({
            status: "OK",
            msg: "course fecthed succesfully",
            data: filterData
        })
    } catch (err) {
        res.send({
            status: "ERR",
            msg: "somthing wrong "
        })
        console.log(err)
    }
})
//  *** Post  filter or  course &  fees  end   ***



// *** Enquires Added  to database ***
// app.post("/followup-by-enquiry/:studentId", async (req, res) => {
//     // let { studentId } = req.params
//     const {
//         student_id,
//         is_communicated,
//         summery,
//         next_follow_required,
//         next_follow_enqueries_date_time,
//     } = req.body

//     let enquerieToInserted = {
//         student_id,
//         is_communicated,
//         summery,
//         next_follow_required,
//         next_follow_enqueries_date_time,
//     }
//     try {
//         await Enqueries.create(enquerieToInserted)
//         res.send({ status: "OK", msg: "Enquires Posted  Succesfully", data: null })
//     } catch (err) {
//         res.send({ status: "ERR", msg: "Somthing went wrong" })
//     }
// })
// *** Enquires Added  to database  end ***


// **Add followUp of Enquires **

// app.post("/add-followup-on-enquires/:enquiresId", async (req, res) => {
//     const {
//         enquires_id,
//         is_communicated,
//         summery,
//         next_follow_required,
//         next_follow_enqueries_date_time,
//     } = req.body

//     let addFollowEnquiresInserted = {
//         enquires_id,
//         is_communicated,
//         summery,
//         next_follow_required,
//         next_follow_enqueries_date_time,
//     }
//     try {
//         await AddFollowup.create(addFollowEnquiresInserted)
//         res.send({ status: "OK", msg: "Enquires Posted  Succesfully", data: null })
//     } catch (err) {
//         res.send({ status: "ERR", msg: "Somthing went wrong" })
//     }
// })
// **Add followUp of Enquires **


// app.post("/enquery", async (req, res) => {

//     try {
//         const { query, page, limit, sortBy, sortType } = req.body
//         const params = [
//             "name",
//             "email",
//             "mobnumber",
//             "whatsappno",
//             "gender",
//             "dob",
//             "address",
//             "workexprience",
//             "company"
//         ]
//         let searchQuery = []
//         for (let each in params) {
//             let key = params[each]
//             let value = { $regex: `.*${query}.*`, $options: "i" }

//             searchQuery.push({ [key]: value })
//         }
//         let data = await Students.aggregate([
//             { $match: { $or: searchQuery } }
//         ])
//         res.send({ status: "OK", msg: "data fetched succesfully  ", data: data })
//     } catch (e) {
//         res.send({ status: "ERR", msg: "Eror in  data fetching  ", data: null })

//     }
// })

// All routes ###

// ** Server listen on port 3004 **
const port = 3004
app.listen(port, () => {
    console.log("serever is running on ", port)
})



