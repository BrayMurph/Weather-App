var apikey = "";
var today = moment().format("L");
var searchHistory = [];

function currentCond(city) {
    var queryURL = "";
    
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(cityWeatherRes) {
          console.log(cityWeatherRes);
          $("#weatherCont").css("display", "block");
          $("#cityDetail").empty();

          var iconCode = cityWeatherRes.weather[0].icon;
          var iconIMG = `https://openweathermap.org/img/w/${iconCode}.png`;
          var currentCity = $(`
            <h2 id="currentCity">
                ${cityWeatherRes.name} ${today} <img src="${iconIMG}" alt="${cityWeatherRes.weather[0].description}" />
            </h2>
            <p>Temperature: ${cityWeatherRes.main.temp} °F</p>
            <p>Humidity: ${cityWeatherRes.main.humidity}\%</p>
            <p>Wind Speed: ${cityWeatherRes.wind.speed} MPH</p>
          `);
          $("#cityDetail").append(currentCity);

          var 
    }
}
