var express = require('express');
var request = require('request');
var app = express();

var server = app.listen(process.env.PORT, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('app listening at http://%s:%s', host, port);
});

app.get('/', function (req, res) {
  
  var city = req.query.city;
  var state = req.query.state;
  var handleCoords = function(err, data){ getWeather(data.lat, data.lon, handleWeather) };
  var handleWeather = function(err, data){ formatWeather(data, handleMessage) };
  var handleMessage = function(message){ res.send(message)};
  
  getCoords(city, state, handleCoords);
  
});

var formatWeather = function(weather, cb){
  var messageItems = [
      'Here is your weather report. ',
      'The current temperature is ',
      weather.currentobservation.Temp,
      ' degrees, weather is currently described as ',
      weather.currentobservation.Weather,
      '. The weather will be ',
      weather.data.text[0]
    ];
  
  cb(messageItems.join(""));
}

var getCoords = function(city, state, cb) {
  var apiUrl = 'http://nominatim.openstreetmap.org/search?format=json&q=' + city + ',' + state + '&addressdetails=1';
  var requestParams = {
    'url': apiUrl,
    // 'proxy': 'http://62.201.200.17:80',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    }
  };
  request(requestParams, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var location = (JSON.parse(body))[0];
        cb(error, location);
    }
  });
}

var getWeather = function(lat, lng, cb) {
  var apiUrl = "http://forecast.weather.gov/MapClick.php?lat="+lat+"&lon="+lng+"&site=okx&unit=0&lg=en&FcstType=json";
  var requestParams = {
    'url': apiUrl,
    // 'proxy': 'http://62.201.200.17:80',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    }
  };
  request(requestParams, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var weather = JSON.parse(body);
        cb(error, weather);
    }
  });
}