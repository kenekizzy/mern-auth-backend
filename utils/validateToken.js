const jwt = require("jsonwebtoken")
require("dotenv").config()

const protectRoute = async (req, res, next) => {
    let token;

    try {
        token = req.cookies.jwt

        if(!token) return res.status(401).json({errors: [ {message: "Unauthorized User"}]})

        const verifyUser = jwt.verify(token, process.env.JWT_SECRET)

        if(!verifyUser) return res.status(403).json({errors: [ {message: "Invalid Token"}]})

        req.user = verifyUser
        next()
    } catch (error) {
        res.status(500).json({ errors: [{ message: error}]})
    }
}

module.export = protectRoute