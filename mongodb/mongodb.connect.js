const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config()

const MONGO_URI = process.env.MONGO_URI

async function connect() {
    try {
        await mongoose.connect(
            MONGO_URI,
            { useNewUrlParser: true }
        )
    } catch (err) {
        console.error("no connection to mongodb")
        console.error(err)
    }
}

module.exports = { connect }