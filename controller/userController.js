const User = require("../model/userModel")
const bcrypt = require("bcryptjs")
const generateJWTToken = require("../utils/generateToken")

//auth User and Set Token
const authUser = async (req, res) => {
    const { email, password} = req.body

    if(!email || !password) return res.status(400).json({ errors: [ { message: "Invalid Form Details"}]})

    try {
        const userExists = await User.findOne({ email })
        console.log(userExists)
        
        if(!userExists) return res.status(400).json({ errors: [ { message: "Invalid Credential Details"}]})

        const comparePassword = await bcrypt.compare(password, userExists.password)
        console.log(comparePassword)

        if(!comparePassword) return res.status(400).json({ errors: [ { message: "Invalid Credential Details"}]})

        //const {userDetails} = user

        console.log(userExists)

        generateJWTToken(res, userExists._id)

        res.status(200).json({ success: [ {message: "Successful", user: userExists}]})
    } catch (error) {
        return res.status(500).json({errors: [ {message: error}]})
    }
}

//Create a User
const registerUser = async (req, res) => {
    const {name, email, password} = req.body

    if(!name || !email || !password) return res.status(400).json({ errors: [ { message: "Invalid form details" } ]})
    try {
        const userExists = await User.findOne({email})
        if(userExists) return res.status(400).json({errors: [ {message: "User Exists already"}]})

        const salt = await bcrypt.genSalt(10)
        let hashedPassword = await bcrypt.hash(password, salt)
        const newUser = await User.create({name, email, password: hashedPassword})

        if(newUser) generateJWTToken(res, newUser._id)

        // const {userPassword: password, ...userDetails} = newUser
        //Prevent the password from being sent
        res.status(201).json({ success: [ { message: "User Created Successfully", user: newUser } ]})

    } catch (error) {
        console.log(error)
        return res.status(500).json({errors: [ {message: error}]})
    }

}

const logOutUser = async (req, res) => {
    try {
        res.cookie('jwt', '', {
            httpOnly: true,
            expires: new Date(0)
        })

        res.status(200).json({ success: [ { message: "User logged out Successfully"} ]})
    } catch (error) {
        return res.status(500).json({errors: [ {message: error}]})
    }

}

const getUserProfile = async (req, res) => {
    try {
        const userProfile = await User.findById(req.user._id)

        if(!userProfile) return res.status(400).json({ errors: [ {message: "Invalid User"}]})

        res.status(200).json({ success: [ { message: "Successful", user: userProfile}]})
    } catch (error) {
        return res.status(500).json({errors: [ {message: error}]})
    }
}

const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        
        if(!user) return res.status(404).json({ errors: [{message: "User Not Found"}]})

        user.name = req.body.name || user.name
        user.email = req.body.email || user.email

        let hashedPassword
        if(req.body.password){
            const salt = await bcrypt.genSalt(10)
            hashedPassword = await bcrypt.hash(req.body.password, salt)
        }
        user.password = hashedPassword || user.password

        const updatedUser = await user.save()

        res.status(200).json({ success: [ {message: "Successful", user: updatedUser}]})
    } catch (error) {
        return res.status(500).json({errors: [ {message: error}]})
    }
}

module.exports = { authUser, registerUser, logOutUser, getUserProfile, updateUserProfile}