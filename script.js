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
  
    document.getElementById('weather-condition').innerHTML = data.weather[0].description;
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
    const forecastData = await response.json();
    
    // Group forecasts by date and calculate min/max temperatures
    const dailyTemps = {};

    forecastData.list.forEach(item => {
      const date = item.dt_txt.split(' ')[0]; // Extract YYYY-MM-DD

      if (!dailyTemps[date]) {
        dailyTemps[date] = {
          min: item.main.temp,
          max: item.main.temp,
          icon: item.weather[0].icon,
          description: item.weather[0].description
        };
      } else {
        dailyTemps[date].min = Math.min(dailyTemps[date].min, item.main.temp);
        dailyTemps[date].max = Math.max(dailyTemps[date].max, item.main.temp);
      }
    });

    // Convert to an array and take the next 4 days (excluding today)
    const dailyForecasts = Object.keys(dailyTemps).slice(1, 5).map(date => ({
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' }),
      min: dailyTemps[date].min.toFixed(1),
      max: dailyTemps[date].max.toFixed(1),
      icon: dailyTemps[date].icon,
      description: dailyTemps[date].description
    }));

    displayForecast(dailyForecasts);
  } catch (error) {
    console.error('Error fetching forecast data:', error);
  }
}

// Display the forecast data
function displayForecast(dailyForecasts) {
  const forecastContainer = document.getElementById('forecast');
  forecastContainer.innerHTML = ''; // Clear any previous content

  dailyForecasts.forEach(day => {
    // Create forecast day card
    const forecastCard = `
      <div class="forecast-day">
        <div class="day">${day.date}</div>
        <img src="http://openweathermap.org/img/wn/${day.icon}.png" alt="${day.description}">
        <div class="temp">Min: ${day.min}°C / Max: ${day.max}°C</div>
        <div class="description">${day.description}</div>
      </div>
    `;
    
    // Append to forecast container
    forecastContainer.innerHTML += forecastCard;
  });
}

// Call the function to get the forecast
getWeatherForecast();