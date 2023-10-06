var apikey = "b82beadaf2428e27794315f09f4f6b24";
var today = moment().format("L");
var searchList = [];

function currentCond(city) {
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&APPID=${apikey}`;
    
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

          var lat = cityWeatherRes.coord.lat;
          var lon = cityWeatherRes.coord.lon;
          var uviqueryURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&exlclude={part}&APPID=${apikey}`;

        $.ajax({
            url: uviqueryURL,
            method: "GET"
        }).then(function(uviRes) {
            var uvIndex = uviRes.value;
            var uvIndexP = $(`
                <p>UV Index:
                    <span id="uvIndexColor" class="px-2 py-2 rounded">${uvIndex}</span>
                </p>
                `);

            $("#cityDetail").append(uvIndexP);

            fiveday(lat, lon);

            if (uvIndex >= 0 && uvIndex <= 2) {
                $("#uvIndexColor").css("background-color", "#3EA72D").css("color", "white");
            } else if (uvIndex >= 3 && uvIndex <= 5) {
                $("#uvIndexColor").css("background-color", "#FFF300");
            } else if (uvIndex >= 6 && uvIndex <= 7) {
                $("#uvIndexColor").css("background-color", "#F18B00");
            } else if (uvIndex >= 8 && uvIndex <= 10) {
                $("#uvIndexColor").css("background-color", "#E53210").css("color", "white");
            } else {
                $("#uvIndexColor").css("background-color", "#B567A4").css("color", "white");
            };         
        });
    });
}

function fiveday(city) {
    var fivedayURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apikey}`;

    $.ajax({
        url: fivedayURL,
        method: "GET"
    }).then(function(fivedayRes) {
        $("#fiveDay").empty();

        for (let i = 1; i < 6; i++) {
            var cityData = {
                date: fivedayRes.daily[i].dt,
                icon: fivedayRes.daily[i].weather[0].icon,
                temp: fivedayRes.daily[i].temp.day,
                humidity: fivedayRes.daily[i].humidity
            };

            var currentDate = moment.unix(cityData.date).format("MM/DD/YYYY");
            var iconIMG = `<img src="https://openweathermap.org/img/w/${cityData.icon}.png" alt="${fivedayRes.daily[i].weather[0].main}" />`;

            var fivedayCard = $(`
                <div class="pl-3">
                    <div class="card pl-3 pt-3 mb-3 bg-primary text-light" style="width: 12rem">
                        <div class="card-body">
                            <h5>${currentDate}</h5>
                            <p>${iconIMG}</p>
                            <p>Temperature: ${cityData.temp} °F</p>
                            <p>Humidity: ${cityData.humidity}\%</p>
                        </div>
                    </div>
                </div>
            `);

            $("#fiveDay").append(fivedayCard);
        }
    });
}

        $("#searchBtn").on("click", function(event) {
            event.preventDefault();

            var city = $("#inputCity").val().trim();
            currentCond(city);
            if (!searchList.includes(city)) {
                searchList.push(city);
                searchedCity = $(`
                    <li class="list-group-item">${city}</li>
                    `);
                $("#searchHistory").append(searchedCity);
            };

            localStorage.setItem("city", JSON.stringify(searchList));
        });        

        $(document).on("click", ".list-item", function() {
            var listCity = $(this).text();
            currentCond(listCity);
        });

        $(document).ready(function() {
            var searchArr = JSON.parse(localStorage.getItem("city"));

            if (searchArr !== null) {
                var lastSearched = searchArr.length - 1;
                var lastCity = searchArr[lastSearched];
                currentCond(lastCity);
            }
        });

        

