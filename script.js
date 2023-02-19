let future = "";
let input = document.querySelector("#input");

let clearBtn = document.createElement("clearBtn");
clearBtn.textContent = "Clear Search";
document.body.appendChild(clearBtn);
clearBtn.addEventListener("click", function() {
  localStorage.removeItem("history");
  location.reload();
},

input.addEventListener("keyup", function (event) {
  console.log(event.target.value);
  if (event.key === "Enter") {
    createWeatherDisplay(event.target.value);
    console.log(event.key);
  }
}));

let previousSearchHistory = localStorage.getItem("history");
if (previousSearchHistory) {
  previousSearchHistory = JSON.parse(previousSearchHistory);
} else {
  previousSearchHistory = [];
}

for (let i = 0; i < previousSearchHistory.length; i++) {
  let historyBtn = document.createElement("button");
  let historyItem = previousSearchHistory[i];
  historyBtn.textContent = historyItem;
  historyBtn.addEventListener("click", function (event) {
    createWeatherDisplay(event.target.textContent);
  });

  document.body.appendChild(historyBtn);
}

let API_KEY = "0c459077329a9c1df0e90650659da6f0";

function getGeoLocation(query, limit = 5) {
  return fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=${limit}&appid=${API_KEY}`
  );
}

function getCurrentWeather({ lat, lon, units }) {
  return fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`
  );
}

function getFutureWeather({ lat, lon, units }) {
  return fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`
  );
}

function addHistory(location) {
  let searchHistory = localStorage.getItem("history");
  if (searchHistory) {
    searchHistory = JSON.parse(searchHistory);

    if (searchHistory.includes(location)) {
      return;
    }

    searchHistory.push(location);
    localStorage.setItem("history", JSON.stringify(searchHistory));
  } else {
    searchHistory = [location];
  }
  localStorage.setItem("history", JSON.stringify(searchHistory));
}

function createWeatherDisplay(location) {
  console.log(location);
  getGeoLocation(location)
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then((data) => {
      console.log(data);
      // let weather = data.weather[0]
      if (data.length === 0) {
        let erroEl = document.createElement("p");
        erroEl.textContent = `${location} not found`;
        document.body.appendChild(erroEl);
      } else {
        console.log(data);
        let { lat, lon, units } = data[0];
        getCurrentWeather({ lat, lon, units })
          .then((weatherReponse) => weatherReponse.json())
          .then((weatherData) => {
            console.log(weatherData);
            document
              .querySelectorAll(".currentweatherstatement")
              .forEach((el) => el.remove());
            let weatherPic = document.createElement("img");

            weatherPic.src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;

            let currentWeatherStatement = document.createElement("p");

            let container = document.createElement("div");
            container.classList.add("currentweatherstatement");
            currentWeatherStatement.textContent = `${weatherData.weather[0].main}: currently ${weatherData.weather[0].description}`;

            let windEl = document.createElement("p");
            windEl.textContent = `Wind: ${weatherData.wind.speed} mph`;

            let humidityEl = document.createElement("p");
            humidityEl.textContent = `Humidity: ${weatherData.main.humidity}%`;

            container.appendChild(weatherPic);
            container.appendChild(currentWeatherStatement);
            container.appendChild(windEl);
            container.appendChild(humidityEl);
            document.body.appendChild(container);
            addHistory(location);

            futureForecast(weatherData);
          });
      }
    });

  function futureForecast(weatherData) {
      let lat = weatherData.coord.lat;
      let lon = weatherData.coord.lon;
      let units = "imperial";

      getFutureWeather({ lat, lon, units })
      .then((forecastResponse) => forecastResponse.json())
      .then((forecastData) => {
        console.log(forecastData);
        let forecastEl = document.createElement("div");
        forecastEl.classList.add("futureWeatherStatement");
        
        for (let i = 0; i < 5; i++) {
          let forecast = forecastData.list[i * 8]; 
          let forecastDate = new Date(forecast.dt * 1000);
          let forecastDay = forecastDate.toLocaleDateString("en-US", {
            weekday: "short",
          });
          let forecastTemp = Math.round(forecast.main.temp);
          let forecastIcon = forecast.weather[0].icon;
  
          let forecastDayEl = document.createElement("p");
          forecastDayEl.textContent = `${forecastDay}: ${forecastTemp}°F`;
  
          let forecastIconEl = document.createElement("img");
          forecastIconEl.src = `https://openweathermap.org/img/wn/${forecastIcon}.png`;
          
  
          forecastEl.appendChild(forecastDayEl);
          forecastEl.appendChild(forecastIconEl);
        }
  
        document.body.appendChild(forecastEl);
      });
  }
}
