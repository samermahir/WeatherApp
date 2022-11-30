let input = document.querySelector('#input')


input.addEventListener('keyup', function(event) {
    console.log(event.target.value)
    if (event.key === 'Enter') {
        createWeatherDisplay(event.target.value)
        console.log(event.key)
    }
})

let previousSearchHistory = localStorage.getItem('history')
if (previousSearchHistory) {
    previousSearchHistory = JSON.parse(previousSearchHistory)
}else {
    previousSearchHistory = []
}

for (let i = 0; i < previousSearchHistory.length; i++) {
    let historyBtn = document.createElement('button')
    let historyItem = previousSearchHistory[i]
    historyBtn.textContent = historyItem
    historyBtn.addEventListener('click', function(event) {
        createWeatherDisplay(event.target.textContent)
    })

    document.body.appendChild(historyBtn)
}

let API_KEY = '0c459077329a9c1df0e90650659da6f0'

function getGeoLocation(query, limit = 5) {
    return fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=${limit}&appid=${API_KEY}`)
}

function getCurrentWeather({lat, lon, units}) {
    return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`)
}

function addHistory(location) {
    let searchHistory = localStorage.getItem('history')
    if (searchHistory) {
        searchHistory = JSON.parse(searchHistory)
        
        if(searchHistory.includes(location)) {
                return
            }
        
        searchHistory.push(location)
        localStorage.setItem('history', JSON.stringify(searchHistory))
    } else {
        searchHistory = [location]}
        localStorage.setItem('history', JSON.stringify(searchHistory))
    }

function createWeatherDisplay(location){
    console.log(location)
    getGeoLocation(location)
    .then(function(response) {
        console.log(response)
        return response.json()
    })
    .then(data => {
        console.log(data)
        // let weather = data.weather[0]
        if (data.length === 0) {
            let erroEl = document.createElement('p')
            erroEl.textContent = `${location} not found`
            document.body.appendChild(erroEl)
        } else {

        console.log(data)
        let { lat, lon } = data[0]
        getCurrentWeather({ lat, lon })
            .then(weatherReponse => weatherReponse.json())
            .then(weatherData => {
                console.log(weatherData)
                let weatherPic = document.createElement('img')
                weatherPic.src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`
                let currentWeatherStatement = document.createElement('p')
                let container = document.createElement('div')
                container.classList.add('current-weather-statement')
                currentWeatherStatement.textContent = `${weatherData.weather[0].main}: currently ${weatherData.weather[0].description}`
                container.appendChild(weatherPic)
                container.appendChild(currentWeatherStatement)
                document.body.appendChild(container)
                addHistory(location)
            })

    function futureWeather(lat, lon) {
        let futureUrl= (`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`)
            fetch(futureUrl)
            .then(function (response) {
                return response.json(); 
            })
            .then(function(data) {
                console.log(data);
                for (i=0;i<5;i++) {
                    console.log(data);
                };
                let weatherEl = document.createElement('div')
                weatherEl.classList.add('future-weather')
                let futureWeatherPic = document.createElement('img')
                futureWeatherPic.src = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`
                weatherEl.textContent = `${day.weather[0].main}: ${index.weather[0].description}` 
                futureContainer.appendChild(weatherEl)
                futureContainer.appendChild(futureWeatherPic)
                console.log(data)
            })
        
            
        
            
            .catch(error => {
                document.body.textcontent = error.message
            })
            
        
   
    .catch(error => {
        document.body.textcontent = error.message
    })  
}}}
,
    )}