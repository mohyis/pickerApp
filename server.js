const express = require('express')
require('dotenv').config()
require('./controller/passportController')
require('./controller/facebookController')
require('./controller/githubController')
const passport = require('passport')
const expressSession = require('express-session')
const app = express()
const PORT = 8899
const pickerRouter = require('./router/pickerRouter')
const restaurantRouter = require('./router/restaurantRouter')
app.use(express.json())
app.use(expressSession({secret: "mohyis"}))
app.use(passport.initialize())
app.use(passport.session())
app.use("/api/user", pickerRouter)
app.use("/api/restaurant", restaurantRouter)

const mongoose = require('mongoose')

mongoose.connect(process.env.DB_URI).then(()=>{
    console.log('database connected successfully'), app.listen(PORT, ()=>{
    
    console.log('app is listening to port', PORT)
})}).catch((error)=>{console.log(`error connecting to database, ${error.message}`);
})

