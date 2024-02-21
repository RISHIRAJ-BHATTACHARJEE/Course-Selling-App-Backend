const jwt = require("jsonwebtoken")
const {JWT_KEY} = require("../jwtSecret")
function userMiddleware(req, res, next) {
    // Implement user auth logic
    // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
    const token = req.headers.authorization
    const words = token.split(" ")
    const jwtToken = words[1]
    try {
        const decodedVal = jwt.verify(jwtToken, JWT_KEY)
        if (decodedVal.username) {
            req.username = decodedVal.username
            next()
        }else{
            res.status(403).json({
                msg: "User not found"
            })
        }
    } catch (error) {
        res.status(403).json({
            msg: "Invalid Credentials"
        })
        
    }

}

module.exports = userMiddleware;