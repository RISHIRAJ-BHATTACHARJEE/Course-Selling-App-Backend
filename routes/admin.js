const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin, Course } = require("../../04-mongo-with-jwt-auth/db");
const router = Router();
const jwt = require("jsonwebtoken");
const {JWT_KEY} = require("../jwtSecret")

// Admin Routes
router.post('/signup', async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username
    const password = req.body.password

    await Admin.create({
        username,
        password
    })

    res.json({
        msg: "Admin created successfully"
    })
});

router.post('/signin', async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username
    const password = req.body.password

    const user = await Admin.findOne({
        username,
        password
    })

    if (user) {
        const token = jwt.sign({
            username
        }, JWT_KEY)

        res.json({
            token: `Bearer ${token}`
        })
    }else{
        res.status(403).json({
            msg: "Invalid User Details"
        })
    }
    
});

router.post('/courses', adminMiddleware, async (req, res) => {
    // Implement course creation logic
    const title = req.body.title
    const description = req.body.description
    const price = req.body.price
    const imageLink = req.body.imageLink

    const course = await Course.create({
        title,
        description,
        price,
        imageLink
    })

    res.json({
        msg: "Course Created Successfully",
        courseId: course._id
    })
});

router.get('/courses', adminMiddleware, async (req, res) => {
    // Implement fetching all courses logic
    const allCourses = await Course.find({})
    
    res.json({
        allCourses
    })
});

module.exports = router;