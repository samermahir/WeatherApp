let input = document.querySelector('#input')

input.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        createWeatherDisplay(event.target.value)
    }
})

let API_KEY = 'e8713c748b04d201a89283e4f62cfbe5'

function getGeoLocation(query, limit = 5) {
    return fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=${limit}&appid=${API_KEY}`)
}

function getWeather({arguments}) {
    return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${arguments.lat}&lon=${arguments.lon}&units=${units}&appid=${API_KEY}`)
}
function createWeatherDisplay(location){
getGeoLocation(location)
.then(function(response) {
    return  response.json()
})
.then(data => {
    // console.log(data)
    // let { lat, lon } = data[0]
    getWeather({lat: data[0].lat, lon: data[0].lon})
    .then(weatherReponse => weatherReponse.json())
    .then(weatherData => {
        let weatherPic = document.createElement('img')
        weatherPic.src = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`
        let currentWeatherStatement = document.createElement('p')
        currentWeatherStatement.textContent = `${weatherData.weather[0].main}: currently ${weatherData.weather[0].description}`
        document.body.appendChild(weatherPic)
        document.body.appendChild(currentWeatherStatement)
    })
    
    .catch(error => {
        document.body.textcontent = error.message})
})
.catch(error => {
    document.body.textcontent = error.message
})    

}