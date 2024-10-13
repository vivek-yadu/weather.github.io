const timeE1 = document.getElementById('time');
const dateE1 = document.getElementById('date');
const currentWeatherItemsE1 = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryE1 = document.getElementById('country');
const weatherForecastE1 = document.getElementById('weather-forecast');
const currentTempE1 = document.getElementById('current-temp');
API_key = '68d9e8a2d65fcecf0ae385b2c888fc47';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Stadurday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12Hrsformat = hour >= 12 ? hour % 12 : hour;
    const minutes = time.getMinutes();
    const ampm = hour >= 12 ? 'Am' : 'Pm';
    timeE1.innerHTML = hoursIn12Hrsformat + ':' + minutes + ' ' + `<span id="am-pm">${ampm}</span>`;
    dateE1.innerHTML = days[day] + ', ' + date + ' ' + months[month];

}, 1000);

getWeatherData();

function getWeatherData() {
    navigator.geolocation.getCurrentPosition((success) => {
        console.log(success);

        let { latitude, longitude } = success.coords;
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_key}`).then(res => res.json()).then(data => {
            console.log(data)
            showWeatherData(data);
        })
    })
}

function showWeatherData(data) {
    let { humidity, pressure, sunrise, sunset, wind_speed, temp } = data.current;
    currentWeatherItemsE1.innerHTML = ` <div class="weather-item">
    <div>Humidity</div>
    <div>${humidity} %</div>
    </div>
    <div class="weather-item">
    <div>Pressure</div>
    <div>${pressure} hPa</div>
    </div>
    <div class="weather-item">
    <div>Wind_speed</div>
    <div>${wind_speed} km/h</div>
    </div>
    <div class="weather-item">
    <div>Sunrise</div>
    <div>${window.moment(sunrise*1000).format('HH:mm a')}</div>
    </div>
    <div class="weather-item">
    <div>Sunset</div>
    <div>${window.moment(sunset*1000).format('HH:mm a')}</div>
    </div>
    <div class="weather-item">
    <div>Temperature</div>
    <div>${temp}&#176;c</div>
    </div>
  
    `;
    let otherDayForecast = ''
    data.daily.forEach((day, idx) => {
        if (idx == 0) {
            currentTempE1.innerHTML = `
            <div class="today" id="current-temp">
            <div class="other">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
                <div class="temp">Night-${day.temp.night}&#176C</div>
                <div class="temp">Day-${day.temp.day}&#176C</div>
            </div>
        </div>

        `
        } else {
            otherDayForecast += ` <div class="weather-forecast-item">
            <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">

            <div class="temp">Night-${day.temp.night}&#176C</div>
            <div class="temp">Day-${day.temp.day}&#176C</div>
        </div>`
        }
    })

    weatherForecastE1.innerHTML = otherDayForecast;

}