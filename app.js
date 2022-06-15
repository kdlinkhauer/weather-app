require('dotenv').config()

const express = require("express");
const {
  write
} = require("fs");
const https = require("https");
const ejs = require('ejs');
const _ = require('lodash');

const app = express();

const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({
  extended: true
}));

app.route('/')
  .get((req, res) => {
    res.render('home');
  })
  .post((req, res) => {
    // variables (location, units)
    const apiKey = process.env.API_KEY;
    const city = req.body.cityName;
    const state = req.body.stateName;
    const country = req.body.countryName;
    const unit = "imperial"
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${state},${country}&appid=${apiKey}&units=${unit}`

    https.get(url, function(response) {
      response.on("data", function(data) {

        const weatherData = JSON.parse(data);
        if (weatherData.cod === "404") {
          res.render('error');
        } else {
          const temp = Math.round(weatherData.main.temp);
          const feelsLike = Math.round(weatherData.main.feels_like);
          const description = weatherData.weather[0].description;
          const icon = weatherData.weather[0].icon;
          const imgURL = `http://openweathermap.org/img/wn/${icon}@2x.png`

          res.render('weather', {
            temp: temp,
            city: _.startCase(city),
            description: description,
            feelsLike: feelsLike,
            imgURL: imgURL
          });
        }
      });
    });
  })



app.listen(port, function() {
  console.log(`Server is running on port ${port}.`);
});