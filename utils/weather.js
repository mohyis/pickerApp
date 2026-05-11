const weatherModel = require('../models/weather')
const axios = require('axios')

exports.weatherLocation = async(req,res)=>{
    try {
        const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress
        const ip = rawIp === '::1' ? '105.113.99.42' : rawIp
        
        // const weather  = await axios.get(`http://ip-api.com/json/${ip}`)
        // const latitude = weather.data.lat
        // const longitude = weather.data.lon

        // const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.weather_API}`
        // const apiUrl = `https://my-server.tld/v1/forecast?latitude=${latitude}&longitude=${longitude}`
        const apiUrl = `http://api.weatherapi.com/v1/current.json?key=${process.env.weather}&q=${ip}`
        const getWeather = await axios.get(apiUrl)
         console.log(getWeather);
         
   const weatherData = {
    lat: getWeather.data.location.lat,
    lon: getWeather.data.location.lon,
    temp: `${getWeather.data.current.temp_c}⁰C`
   };

   const display = await weatherModel.create(weatherData);
   res.status(200).json({
    message: "Today's weather",
    display
   })
        
    } catch (error) {
       next({
        message: error.message, 
        statusCode: 500
      })
    }
}