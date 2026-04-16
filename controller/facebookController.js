const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/pickerModel')
const passport = require('passport')
const jwt = require('jsonwebtoken')

passport.use(new FacebookStrategy({
    clientID: process.env.fbClientID,
    clientSecret: process.env.fbClientSecret,
    callbackURL: process.env.fbCallbackURL
  },
  async function(request, accessToken, refreshToken, profile, done) { 

    console.log(profile)
    const checkUser = await User.findOne({ name: profile._json.name });
    let token;

    if(checkUser){
        token = await jwt.sign({id: checkUser._id}, process.env.JWT_SECRET, {expiresIn: "1day"})
    } else {
         const createUser = await User.create({
            name: profile._json.name,
            role: "user"
        })
         token = await jwt.sign({id: createUser._id}, process.env.JWT_SECRET,{expiresIn: "1day"})
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