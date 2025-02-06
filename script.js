const apiKey = "15e8eef35aa52c93aeef1018b9732a74D";
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=Stockholm,Sweden&units=metric&APPID=${apiKey}`;
const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=Stockholm,Sweden&units=metric&APPID=${apiKey}`;

async function checkWeather() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    console.log(data); // Debugging output

    document.getElementById("city").innerHTML = data.name;
    document.getElementById("temp").innerHTML = `${data.main.temp.toFixed(1)}°C`;

    // Convert UNIX timestamp to local time
    document.getElementById("sunrise").innerHTML = convertToLocalTime(data.sys.sunrise, "Europe/Stockholm");
    document.getElementById("sunset").innerHTML = convertToLocalTime(data.sys.sunset, "Europe/Stockholm");

  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

const apiKey = "15e8eef35aa52c93aeef1018b9732a74D";
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=Stockholm,Sweden&units=metric&APPID=${apiKey}`;
const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=Stockholm,Sweden&units=metric&APPID=${apiKey}`;

async function checkWeather() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    document.getElementById("city").innerHTML = data.name;
    document.getElementById("temp").innerHTML = `${data.main.temp.toFixed(1)}°C`;

    // Convert UNIX timestamps to local time
    document.getElementById("sunrise").innerHTML = convertToLocalTime(data.sys.sunrise, "Europe/Stockholm");
    document.getElementById("sunset").innerHTML = convertToLocalTime(data.sys.sunset, "Europe/Stockholm");
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

// Convert UNIX timestamp to local time
function convertToLocalTime(utcSeconds, timeZone) {
  return new Date(utcSeconds * 1000).toLocaleTimeString("en-US", { 
    hour: "2-digit", 
    minute: "2-digit", 
    timeZone: timeZone 
  });
}

document.addEventListener("DOMContentLoaded", () => {
  checkWeather();
  getWeatherForecast();
});

// Fetch and process the weather forecast
async function getWeatherForecast() {
  try {
    const response = await fetch(forecastApiUrl);
    const forecastData = await response.json();

    // Group forecasts by date
    const dailyTemps = {};

    forecastData.list.forEach(item => {
      const date = item.dt_txt.split(" ")[0]; // Extract YYYY-MM-DD

      if (!dailyTemps[date]) {
        dailyTemps[date] = { 
          min: item.main.temp,  // Start with first temperature
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
      date,
      min: dailyTemps[date].min.toFixed(1),
      max: dailyTemps[date].max.toFixed(1),
      icon: dailyTemps[date].icon,
      description: dailyTemps[date].description
    }));

    displayForecast(dailyForecasts);
  } catch (error) {
    console.error("Error fetching forecast data:", error);
  }
}

// Display the forecast data
function displayForecast(dailyForecasts) {
  const forecastContainer = document.getElementById("forecast");
  forecastContainer.innerHTML = ""; // Clear previous content

  dailyForecasts.forEach(day => {
    const formattedDate = new Date(day.date).toLocaleDateString('en-US', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'short' 
    });

    // Create forecast day card
    const forecastCard = `
      <div class="forecast-day">
        <div class="day">${formattedDate}</div>
        <img src="http://openweathermap.org/img/wn/${day.icon}.png" alt="${day.description}">
        <div class="temp">Min: ${day.min}°C / Max: ${day.max}°C</div>
        <div class="description">${day.description}</div>
      </div>
    `;

    // Append to forecast container
    forecastContainer.innerHTML += forecastCard;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  checkWeather();
  getWeatherForecast();
});

// Fetch and process the weather forecast
async function getWeatherForecast() {
  try {
    const response = await fetch(forecastApiUrl);
    const forecastData = await response.json();

    // Group forecasts by date
    const dailyTemps = {};

    forecastData.list.forEach(item => {
      const date = item.dt_txt.split(" ")[0]; // Extract YYYY-MM-DD
      if (!dailyTemps[date]) {
        dailyTemps[date] = { 
          min: item.main.temp_min, 
          max: item.main.temp_max, 
          icon: item.weather[0].icon, 
          description: item.weather[0].description 
        };
      } else {
        dailyTemps[date].min = Math.min(dailyTemps[date].min, item.main.temp_min);
        dailyTemps[date].max = Math.max(dailyTemps[date].max, item.main.temp_max);
      }
    });

    // Convert to an array and take the next 4 days (excluding today)
    const dailyForecasts = Object.keys(dailyTemps).slice(1, 5).map(date => ({
      date,
      min: dailyTemps[date].min.toFixed(1),
      max: dailyTemps[date].max.toFixed(1),
      icon: dailyTemps[date].icon,
      description: dailyTemps[date].description
    }));

    displayForecast(dailyForecasts);
  } catch (error) {
    console.error("Error fetching forecast data:", error);
  }
}

// Display the forecast data
function displayForecast(dailyForecasts) {
  const forecastContainer = document.getElementById("forecast");
  forecastContainer.innerHTML = ""; // Clear previous content

  dailyForecasts.forEach(day => {
    const formattedDate = new Date(day.date).toLocaleDateString('en-US', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'short' 
    });

    // Create forecast day card
    const forecastCard = `
      <div class="forecast-day">
        <div class="day">${formattedDate}</div>
        <img src="http://openweathermap.org/img/wn/${day.icon}.png" alt="${day.description}">
        <div class="temp">Min: ${day.min}°C / Max: ${day.max}°C</div>
        <div class="description">${day.description}</div>
      </div>
    `;

    // Append to forecast container
    forecastContainer.innerHTML += forecastCard;
  });
}
g