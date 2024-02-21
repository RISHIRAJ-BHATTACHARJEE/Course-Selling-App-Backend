const { Router } = require("express");
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../../04-mongo-with-jwt-auth/db");
const router = Router();
const jwt = require("jsonwebtoken");
const {JWT_KEY} = require("../jwtSecret")

// User Routes
router.post('/signup', (req, res) => {
    // Implement user signup logic
    const username = req.body.username
    const password = req.body.password

    User.create({
        username,
        password
    })

    res.json({
        msg: "User Created Successfully"
    })
});

router.post('/signin', async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username
    const password = req.body.password

    const user = await User.findOne({
        username,
        password
    })

    if (user) {
        const token = jwt.sign({
            username
        },JWT_KEY)

        res.json({
            token: `Bearer ${token}`
        })
    }else{
        res.status(403).json({
            msg: "Invalid User Credentials"
        })
    }
    
});

router.get('/courses', async (req, res) => {
    // Implement listing all courses logic
    const response = await Course.find({})
    res.json({
        response
    })
});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    // Implement course purchase logic
    const username = req.username
    const courseId = req.params.courseId

    await User.updateOne({
        username

    },{
        "$push":{
            "purchasedCourses": courseId
        }
    })

    res.json({
        msg:`User ${username} bought the course with id=${courseId}`
    })
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    // Implement fetching purchased courses logic
    const username = req.username
    
    const user = await User.findOne({
        username: username
    })

    const courses = await Course.find({
        _id:{
            "$in": user.purchasedCourses,
        }
    })

    res.json({
        courses 
    })
});

module.exports = router;
