const express = require('express')
const todoRoutes = require("./routes/todo.routes")
const app = express()
const mongodb = require("./mongodb/mongodb.connect")
const dotenv = require("dotenv")

dotenv.config()

mongodb.connect()

app.use(express.json())

app.use("/todos", todoRoutes)

app.get('/', (req, res) => {
    res.send('express test')
})

module.exports = app