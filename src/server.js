import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import { initDriver, getDriver, closeDriver } from './config/db.js'

const app = express()

//connect to database
await initDriver(process.env.NEO4J_URI, process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)

//allow cross-origin requests
app.use(cors())


app.listen(process.env.PORT, (req, res) => {
    console.log(`listening on port ${process.env.PORT}`)
})

