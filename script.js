let API_KEY = 'e8713c748b04d201a89283e4f62cfbe5'

function getGeoLocation(query, limit = 5) {
    return fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=${limit}&appid=${API_KEY}`)
}

function getWeather(lat, lon) {
    return fetch(`https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}`)
}

getGeoLocation('Buena Park')
.then(response => response.json())
.then(data => {
    document.body.textcontent = JSON.stringify(data, null, 2)
})
.catch(error => {
    document.body.textcontent = error.message
})    