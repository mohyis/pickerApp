const express = require('express')
require('dotenv').config()
const PORT = 8899
const passport = require('passport')
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc')
const expressSession = require('express-session')
const redisClient = require('./redisConfig/redis')
const cors = require('cors');
const morgan = require('morgan')
const redis = require('redis')
const app = express();
app.use(morgan('dev'));

// Allow cors for all origins
// app.use(cors({origin: '*'}))

// Allow cors for specific origins - localhost
// app.use(cors({origin: 'http://localhost:3000'}));
// Allow cors for specific origins - localhost and hosted
// app.use(cors({origin: ['http://localhost:3000', 'https://pickerapp.onrender.com']}));

const allowedOrigins = ['http://localhost:3000', 'https://pickerapp.onrender.com'];
app.use(cors({origin: allowedOrigins}));


app.use(express.json())

const userRouter = require('./router/userRouter')
const restaurantRouter = require('./router/restaurantRouter')
const orderRouter = require('./router/orderRouter')
const locationRouter = require('./router/locationRouter')
const weatherRouter = require('./router/weatherRouter')
const rateLimiter = require('./middleware/rateLimiter');



app.use(expressSession({secret: "mohyis", saveUninitialized: false, resave: false}))
app.use(passport.initialize())
app.use(passport.session())
app.use(rateLimiter)
app.use('/api/location', locationRouter)
app.use("/api/v1/user", userRouter)
app.use("/api/restaurant", restaurantRouter)
app.use("/api", orderRouter)
app.use('/api/v1/weather', weatherRouter)

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Picker Web App',
        version: '2.0.0',
        description: 
            `This is a REST API application made with Express. It retrieves data from JSONPlaceholder.
             The base URL is: http://localhost:8899`,
        license: {
            name: 'Official URL',
            url: 'https://google.com',
        },
        contact: {
            name: 'JSONPlaceholder',
            url: 'https://jsonplaceholder.typicode.com',
        },
    },
    servers: [
        {
            url: 'https://pickerapp.onrender.com',
            description: 'development server',
        },
    ],
    security: [
        {
            bearerAuth: []
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        }
    }
};

const options = {
    swaggerDefinition,
    apis: ['./router/*.js']
}

const swaggerSpec = swaggerJsdoc(options);
app.use('/api/v1/documentation', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use((req, res , next)=>{
    res.status(500).json({
        message: `route ${req.originalUrl} and ${req.method} not found`
    })
})

// app.use((error, req, res , next)=>{
//     res.status(error.statusCode).json({
//         message: error.message, 
//         status: error.statusCode
//     })
// })
app.use((error, req, res , next)=>{
    if (error.name === 'MulterError'){
        return res.status(400).json({
            message: 'file upload failed'
        })

    }
    if (error.name === 'JsonWebTokenError'){
        return res.status(401).json({
            message: 'session expired, please login again'
        })

    }
   return res.status(500).json({
        message: error.message
    })
})


const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URI).then(()=>{
    redisClient.connect().then(()=>{
    console.log('redis client connected successfully')
}).catch((err)=>{
    console.log('redis client connection error', err)
})
    console.log('database connected successfully'),
     app.listen(PORT, ()=>{
    console.log('app is listening to port', PORT)
})}).catch((error)=>{console.log(`error connecting to database, ${error.message}`);
})

