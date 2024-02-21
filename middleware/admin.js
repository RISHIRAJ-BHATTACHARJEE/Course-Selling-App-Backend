// Middleware for handling auth
const jwt = require("jsonwebtoken")
const {JWT_KEY} = require("../jwtSecret")
function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    const token = req.headers.authorization
    const words = token.split(" ")
    const jwtToken = words[1]
    try {
        const decodedJwt = jwt.verify(jwtToken, JWT_KEY)
        if(decodedJwt.username){
            next()
        }else{
            res.status(403).json({
                msg: "Admin not found"
            })
        }
    } catch (error) {
        res.json({
            msg: "Incorrect inputs"
        })
    }
    

}

module.exports = adminMiddleware;