const jwt = require('jsonwebtoken')

const userModel = require('../models/user');
const pickerModel = require('../models/user');

exports.verifyLogin = async(req,res,next)=>{
   try {
     const token = req.headers.authorization.split(' ')[1]

     await jwt.verify(token, process.env.JWT_SECRET, (error, result)=>{
        if(error){
            return res.status(400).json({
                message: 'login required'
            })
        }
        req.user = result

        next()
        
    })
    
   } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
        return next({
            message: 'session expired, login to continue',
            statusCodel: 400
        })
    }
    next(error)
   }
};


exports.checkAdmin = async(req,res,next)=>{
    const token = req.headers.authorization.split(' ')[1]

    if(!token){
        return next({
            message: 'auth required',
            statusCode: 400
        })
    }

     await jwt.verify(token, process.env.JWT_SECRET, async(error, result)=>{
        if(error){
            return next({
                message: error.message,
                statusCode: 400
            })
        }
        const findUser = await pickerModel.findById(result.id)
        if(!findUser){
            return next({
                message: 'user not found',
                statusCode: 404
            })
        }

        const role = findUser.role

        if (role !== 'admin'){
            return next({
                message: 'unauthorized access',
                statusCode: 403
            })
        }
        req.user = result

        next()
        
    })

};
