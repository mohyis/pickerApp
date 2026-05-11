const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport')
const User = require('../models/pickerModel')
const jwt = require('jsonwebtoken')

passport.use(new GoogleStrategy({
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: process.env.callbackURL,
    passReqToCallback: true
  },
  async function(request, accessToken, refreshToken, profile, done) {

    console.log(profile);
    
    const checkUser = await User.findOne({ email: profile._json.email });
    let token;

    if(checkUser){
        token = await jwt.sign({id: checkUser._id}, process.env.JWT_SECRET,{expiresIn: "1day"})
    } else {
        const createUser = await User.create({
            name: profile._json.name,
            email: profile._json.email,
            isVerified: profile._json.email_verified,
            role: "user"
        })
        token = await jwt.sign({id: createUser._id}, process.env.JWT_SECRET,{expiresIn: "1day"})

    }

    // console.log(token);

    return done(null, token)

  },
    passport.serializeUser((token, done)=>{
    return done(null, token)
}),

passport.deserializeUser((token, done)=>{
    return done(null, token)
})

));

