const apiKey = '15e8eef35aa52c93aeef1018b9732a74';
const baseUrl = "https://api.openweathermap.org/data/2.5/";
const city = "Stockholm,Sweden";
const units = "metric";
const apiUrl = `${baseUrl}weather?q=${city}&units=${units}&APPID=${apiKey}`;
const forecastApiUrl = `${baseUrl}forecast?q=${city}&units=${units}&APPID=${apiKey}`;

function convertTo24HourTime(timestamp, timezoneOffset) {
  return new Date((timestamp + timezoneOffset) * 1000)
    .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}

function capitalizeFirstLetter(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

async function checkWeather() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    console.log(data);

    document.getElementById('city').innerHTML = data.name;
    document.getElementById('temp').innerHTML = `${data.main.temp.toFixed(1)}°C`;
    
    document.getElementById('sunrise').innerHTML = convertTo24HourTime(data.sys.sunrise, data.timezone);
    document.getElementById('sunset').innerHTML = convertTo24HourTime(data.sys.sunset, data.timezone);
    document.getElementById('time').innerHTML = `Local Time: ${convertTo24HourTime(data.dt, data.timezone)}`;
  
    document.getElementById('weather-condition').innerHTML = capitalizeFirstLetter(data.weather[0].description);
    const weatherIcon = document.getElementById('weather-icon').querySelector('img');
    weatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherIcon.alt = data.weather[0].description;  

  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  checkWeather();
  getWeatherForecast();
});

// Fetch and process the weather forecast
async function getWeatherForecast() {
  try {
    const response = await fetch(forecastApiUrl);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const forecastData = await response.json();
    console.log('Forecast API Response:', forecastData);

    // Group forecasts by date, considering only mid-day values (around 12:00 PM)
    const dailyForecasts = {};

    forecastData.list.forEach(item => {
      const date = item.dt_txt.split(' ')[0];
      const time = item.dt_txt.split(' ')[1];
      
      if (time === '12:00:00') {
        dailyForecasts[date] = {
          date: new Date(date).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' }),
          min: item.main.temp_min.toFixed(1),
          max: item.main.temp_max.toFixed(1),
          icon: item.weather[0].icon,
          description: capitalizeFirstLetter(item.weather[0].description)
        };
      }
    });

    // Convert object to array and limit to the next 4 days
    const forecastArray = Object.values(dailyForecasts).slice(0, 4);

    displayForecast(forecastArray);
  } catch (error) {
    console.error('Error fetching forecast data:', error);
  }
}

// Display the forecast data
function displayForecast(dailyForecasts) {
  const forecastContainer = document.getElementById('forecast');
  forecastContainer.innerHTML = ''; 

  dailyForecasts.forEach(day => {
    const forecastCard = `
      <div class="forecast-day">
        <div class="day">${day.date}</div>
        <img src="http://openweathermap.org/img/wn/${day.icon}.png" alt="${day.description}">
        <div class="temp">Min: ${day.min}°C / Max: ${day.max}°C</div>
        <div class="description">${day.description}</div>
      </div>
    `;
    
    forecastContainer.innerHTML += forecastCard;
  });
}

// Call the function to get the forecast
getWeatherForecast();