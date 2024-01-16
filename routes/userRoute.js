const express = require("express")

const router = express.Router()

const { authUser, registerUser, logOutUser, getUserProfile, updateUserProfile } = require("../controller/userController")

const protectRoute = require(("../utils/generateToken"))

router.post("/auth", authUser)

router.post("/register", registerUser)

router.post("/logout", logOutUser)

router.get("/get-user", protectRoute, getUserProfile)

router.put("/update-user", protectRoute, updateUserProfile)

module.exports = router