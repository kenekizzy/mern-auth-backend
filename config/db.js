const mongoose = require("mongoose")
require("dotenv").config()

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true
        })
        console.log("MongoDb Connected .......")
    } catch (error) {
        console.error(error.message)
        //Exit Process on failure to connect to the DB
        process.exit(1)
    }
}

module.exports = connectDB