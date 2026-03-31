const mongoose = require('mongoose')
const { log } = require('node:console')

mongoose.connect(process.env.DB_URI).then(()=>{console.log('database connected successfully')}).catch((error)=>{console.log(`error connecting to database, ${error.message}`);
})