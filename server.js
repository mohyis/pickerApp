const express = require('express')
require('dotenv').config()
const app = express()
const PORT = 8899
require('./database/database')
const pickerRouter = require('./router/pickerRouter')
app.use(express.json())
app.use(pickerRouter)


app.listen(PORT, ()=>{
    console.log('app is listening to port', PORT)
})