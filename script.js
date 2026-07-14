

async function getWeather() {
    const input = document.querySelector('.input');
    const location = input.value.trim();
    if (!location) {
        showResult("Please enter a location.");
        return;
    }

    showResult("Loading...");

    try {
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`);
        const geoData = await geoRes.json();
        if (!geoData.results || geoData.results.length === 0) {
            showResult("Location not found.");
            return;
        }
        const { latitude, longitude, name, country } = geoData.results[0];

        const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );
        const weatherData = await weatherRes.json();
        if (!weatherData.current_weather) {
            showResult("Weather data not available.");
            return;
        }
        const w = weatherData.current_weather;
        showResult(`
            <b>${name}, ${country}</b><br>
            Temperature: ${w.temperature}°C<br>
            Wind Speed: ${w.windspeed} km/h<br>
            Time: ${w.time.replace("T", " ")}
        `);
    } catch (e) {
        showResult("Error fetching weather data.");
    }
}

function showResult(html) {
    let result = document.getElementById('weather-result');
    if (!result) {
        result = document.createElement('div');
        result.id = 'weather-result';
        result.style.textAlign = 'center';
        result.style.fontSize = '18px';
        result.style.margin = "25px" ;
        result.style.fontFamily= "sans-serif" ;
        document.querySelector('.info').appendChild(result);
    }
    result.innerHTML = html;
}