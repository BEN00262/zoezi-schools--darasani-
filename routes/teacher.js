const router = require("express").Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const rateLimiter = require("../utils").rateLimiter(mongoose.connection);
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const yup = require("yup");
const { nanoid } = require("nanoid"); // for password generation
const { convertToJson, multerUploader } = require("../utils");
const { IsTeacherAuthenticated, IsSchoolAuthenticated } = require("../configs");
const { TeacherModel, ClassModel, SubjectModel } = require("../models")

class ZoeziBaseError extends Error {
    constructor(message) {
        super(message)
    }
}

router.get("/all", [IsSchoolAuthenticated], async (req, res) => {
    try {
        let teachers = await TeacherModel.find({ schoolID: req.school._id })
        return res.json({ teachers: teachers || [] })
    } catch(error) {
        console.log(error)
        return res.status(500).json([])
    }
})

// getting the teacher's view :)
router.get("/:teacherId", [IsSchoolAuthenticated],async (req, res) => {
    try {
        // we get the grades they are teaching and the subjects assigned
        let teacher = await TeacherModel.findOne({ 
            _id: req.params.teacherId, 
            schoolID: req.school._id
        });

        // resolve the grades and the subjects
        // we somehow need to show that a subject is not active

        let [grades, subjects] = await Promise.all([
            ClassModel.find({
                schoolID: req.school._id,
                classTeacher: teacher._id
            }).populate("classRef"),

            // get the grade also in the process for other stuff
            SubjectModel.find({
                teacher: teacher._id
            }).populate("grade")
        ])

        return res.json({ teacher, grades, subjects })
    } catch(error) {
        console.log(error)
        return res.status(500).json({})
    }
})

// handle the creation and management of the teachers in the system
// a teacher can be able to change their pasword but the main teacher ( admin ) is able to see the traffic
router.post("/new", [IsSchoolAuthenticated], async (req, res) => {
    try {
        // validate the phone numbers using expressjs validator
        let { name, email, password, confirmPassword } = req.body;

        // we should auto generate the passwords
        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({
                status: false,
                message: "Please fill all the required fields"
            })
        }

        let encryptedPassword = CryptoJS.AES.encrypt(password, process.env.AES_ENCRYPTION_KEY).toString();

        let salt = await bcrypt.genSalt(10)
        password = await bcrypt.hash(password, salt)

        await TeacherModel.create({ 
            name, email, password, 
            schoolID: req.school._id,
            encryptedPassword
        });

        // send the email here ( we can also allow importation of teachers using csv )
        return res.status(201).json({ status: true });
    } catch(error) {
        console.log(error);

        if (error.name === 'MongoError' && error.code === 11000) {
            // this means the guy exists
            return res.json({ error: "User with the Email already exists" })
        }

        return res.status(500).json({ error: "Internal Server Error!" })
    }
});

router.get("/export/credentials", [IsSchoolAuthenticated], async (req, res) => {
    try {
        let teachers = await TeacherModel.find({ schoolID: req.school._id })

        teachers = (teachers || []).map(x => ({
            name: x.name,
            email: x.email,

            password: x.encryptedPassword ? CryptoJS.AES.decrypt(
                x.encryptedPassword, process.env.AES_ENCRYPTION_KEY
            ).toString(CryptoJS.enc.Utf8) : "",
        }))

        return res.json(teachers);
    } catch(error) {
        console.log(error);
        return res.status(500).json({ status: false });   
    }
})

const list_of_teachers = yup.array().of(
    yup.object().shape({
        name: yup.string().required(),
        email: yup.string().required(),
    })
);

router.post("/import", [
    IsSchoolAuthenticated,
    multerUploader.single("excelFile")
], async (req, res) => {

    try {

        let teachers = await convertToJson(
            req.file.buffer,
            {
                A: "name",
                B: "email",
            },
            list_of_teachers
        )


        // generate the teachers object here then push it using updateMany

        teachers = await Promise.all(teachers.map(async teacher => {
            let unhashed_password = nanoid(8) // for password
            let encryptedPassword = CryptoJS.AES.encrypt(unhashed_password, process.env.AES_ENCRYPTION_KEY).toString();

            let salt = await bcrypt.genSalt(10)
            let password = await bcrypt.hash(unhashed_password, salt);

            return ({
                name: teacher.name, email: teacher.email, password, 
                schoolID: req.school._id,
                encryptedPassword
            })
        }));

        await TeacherModel.insertMany(teachers);
        return res.json({ status: true })
    } catch(error) {
        console.log(error)

        return res.status(500).json({
            status: false,
            message: error instanceof ZoeziBaseError ? error.message : "Unknown Error!"
        })
    }
})

// updating a teacher :)
router.put("/:teacherId", [ IsSchoolAuthenticated ], async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        if (password) {
            let salt = await bcrypt.genSalt(10)
            pasword = await bcrypt.hash(password, salt)
        }

        await TeacherModel.findOneAndUpdate({ _id: req.params._id }, {
            $set: {
                name: name || req.teacher.name,
                email: email || req.teacher.email,
                password: password || req.teacher.password
            }
        })

        return res.json({ status: true })
    } catch(error) {
        console.log(error)
        return res.status(500).json({ status: false })
    }
})

// deleting a teacher from the system
// what if the teacher is a class teacher :(
// lets hold off on that for now

router.post("/login", [rateLimiter],async (req, res) => {
    try {
        const { email, password } = req.body;

        let teacher = await TeacherModel.findOne({ email })

        if (!teacher) {
            return res.json({
                status: false,
                message: "Account does not exist. Please check your credentials and try again"
            })
        }

        let isMatch = await bcrypt.compare(password, teacher.password);

        if (!isMatch) {
            return res.json({
                status: false,
                message: "Account does not exist. Please check your credentials and try again"
            })
        }

        // JWT_SECRET ( we are signing with this )
        // create the jwt and return it
        let token = jwt.sign({ _id: teacher._id, school: false }, process.env.JWT_SECRET, {
            expiresIn: '72h' // after 3 days is more than enough for me
        });

        return res.json({ status: true, token });
    } catch(error) {
        console.log(error);

        return res.status(500).json({
            status: false,
            message: error instanceof ZoeziBaseError ? error.message : "Uknown Error!"
        })
    }
})


module.exports = router