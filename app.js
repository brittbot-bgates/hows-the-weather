require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const https = require("https");
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// -- Routing info
app.get("/", (req, res) => {
  res.render("index");
});

app.post("/result", (req, res) => {
  const city = req.body.cityName;
  const state = "us-" + req.body.stateName;
  const apiKey = process.env.API_KEY;
  const units = "imperial";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "," + state + "&appid=" + apiKey + "&units=" + units;

  https.get(url, function(response) {
    response.on("data", function(data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const desc = weatherData.weather[0].description;
      const humidity = weatherData.main.humidity;
      const wind = weatherData.wind.speed;
      res.render("result", {
        city: city.charAt(0).toUpperCase() + city.slice(1),
        state: state.charAt(3).toUpperCase() + state.slice(4).toUpperCase(),
        temp: temp.toFixed(),
        humidity: humidity,
        wind: wind.toFixed(),
        desc: desc.charAt(0).toUpperCase() + desc.slice(1),
      })
    })
  })
});

// -- Port info
app.listen(port, () => {
  console.log("App listening at http://localhost:" + port);
});
