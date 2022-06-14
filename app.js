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
    res.sendFile(__dirname + "/index.html");
  })
  .post((req, res) => {
    const apiKey = process.env.API_KEY;
    const query = req.body.cityName;
    const unit = "imperial"
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit
    https.get(url, function(response) {
      console.log(response.statusCode);

      response.on("data", function(data) {
        const weatherData = JSON.parse(data);
        const temp = weatherData.main.temp;
        const description = weatherData.weather[0].description;
        const icon = weatherData.weather[0].icon;
        const imgURL = 'http://openweathermap.org/img/wn/' + icon + '@2x.png'
        res.write("<h1>The temperature in " + _.startCase(query) + " is " + temp + " degrees Fahrenheit.</h1>")
        res.write("<h3>The weather is currently " + description + ".</h3>")
        res.write("<img src=" + imgURL + ">");
        res.send();
      })
    });
  })



app.listen(port, function() {
  console.log("Server is running on port 3000.");
});