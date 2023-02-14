let future = "";
let input = document.querySelector("#input");

input.addEventListener("keyup", function (event) {
  console.log(event.target.value);
  if (event.key === "Enter") {
    createWeatherDisplay(event.target.value);
    console.log(event.key);
  }
});

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
            container.appendChild(weatherPic);
            container.appendChild(currentWeatherStatement);
            document.body.appendChild(container);
            addHistory(location);

            futureForecast(weatherData);
          });
      }
    });

  function futureForecast(weatherData) {

      let forecast = weatherData
      console.log(forecast);
      if (forecast) {
        let futureWeatherStatement = document.createElement("p");

        let forecastEl = document.createElement("div");
        forecastEl.classList.add("futureWeatherStatement");
        let futureWeatherPic = document.createElement("img");
        futureWeatherPic.src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
        forecastEl.textContent = `${response.weather[0].main}: currently ${response.weather[0].description}`;

        forecastEl.appendChild(futureWeatherPic);
        forecastEl.appendChild(futureWeatherStatement);
        document.body.appendChild(forecastEl);
        addHistory(forecast.date);
      
    }
  }
}
