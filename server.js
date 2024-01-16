const express = require("express")

const cookieParser = require("cookie-parser")

const userRoutes = require("./routes/userRoute")

const connectDB = require("./config/db")

require("dotenv").config()

connectDB()

const app = express()

app.use(express.json({
    extended: false
}))

app.use(express.urlencoded({ extended: true}))

app.use(cookieParser())

app.use("/api/users", userRoutes)


const PORT = process.env.PORT || 7000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})