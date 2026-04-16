const jwt = require('jsonwebtoken')

const userModel = require('../models/pickerModel');
const pickerModel = require('../models/pickerModel');

exports.verifyLogin = async(req,res,next)=>{
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
};


exports.checkAdmin = async(req,res,next)=>{
    const token = req.headers.authorization.split(' ')[1]

    if(!token){
        return res.status(400).json({
            message: 'auth required'
        })
    }

     await jwt.verify(token, process.env.JWT_SECRET, async(error, result)=>{
        if(error){
            return res.status(400).json({
                message: error.message
            })
        }
        const findUser = await pickerModel.findById(result.id)
        if(!findUser){
            return res.status(404).json({
                message: 'user not found'
            })
        }

        const role = findUser.role

        if (role !== 'admin'){
            return res.status(403).json({
                message: 'unauthorized access'
            })
        }
        req.user = result

        next()
        
    })

}