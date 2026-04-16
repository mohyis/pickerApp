const GitHubStrategy = require('passport-github').Strategy;
const passport = require('passport')
const User = require('../models/pickerModel')
const jwt = require('jsonwebtoken')

passport.use(new GitHubStrategy({
    clientID: process.env.ghClientID,
    clientSecret: process.env.ghClientSecret,
    callbackURL: process.env.ghCallbackURL
  },
  async function(request, accessToken, refreshToken, profile, done) {
    console.log(profile)
    const checkUser = await User.findOne({ username: profile.username });
    let token;
    if(checkUser){
        token = await jwt.sign({id:checkUser._id}, process.env.JWT_SECRET, {expiresIn: "1day"})
    }else{
        const createUser = await User.create({
            name: profile.username,
            role: "user"
        })

        token = await jwt.sign({id:createUser._id}, process.env.JWT_SECRET, {expiresIn: "1day"})
    }
    return done(null, token)

  },

   passport.serializeUser((token, done)=>{
        return done(null, token)
        }),
  
        passport.deserializeUser((token, done)=>{
            return done(null, token)
        })

));