const apiKey = "f7a12f0635833998bbe8a4dd1f472454";
const btn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const result = document.getElementById("result");
const body = document.body;

let bgInterval; // store slideshow interval

btn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) getWeather(city);
});

cityInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") btn.click();
});

async function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    btn.disabled = true;
    result.innerHTML = `<p>⏳ Loading...</p>`;

    let response = await fetch(url);
    if (!response.ok) {
      result.innerHTML = `<p>❌ City not found</p>`;
      return;
    }

    let data = await response.json();

    // 🌈 Background based on weather
    const weatherMain = data.weather[0].main.toLowerCase();
    let keywords = ["sky", "clouds"]; // default

    if (weatherMain.includes("rain")) keywords = ["rain", "storm"];
    else if (weatherMain.includes("cloud")) keywords = ["cloudy", "overcast"];
    else if (weatherMain.includes("clear")) keywords = ["sunny", "blue-sky"];
    else if (weatherMain.includes("snow")) keywords = ["snow", "winter"];
    else if (weatherMain.includes("storm")) keywords = ["storm", "lightning"];

    startSlideshow(keywords);

    result.innerHTML = `
      <h3>📍 ${data.name}, ${data.sys.country}</h3>
      <h2>🌡️ ${data.main.temp} °C</h2>
      <p>☁️ Weather: ${data.weather[0].description}</p>
      <p>💧 Humidity: ${data.main.humidity}%</p>
      <p>🌬 Wind: ${data.wind.speed} m/s</p>
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="weather-icon" />
    `;
  } catch (error) {
    result.innerHTML = `<p>⚠️ Something went wrong. Try again later.</p>`;
    console.error(error);
  } finally {
    btn.disabled = false;
  }
}

// 🌌 Live background slideshow with fallback
function startSlideshow(keywords) {
  let i = 0;

  // clear old interval if running
  if (bgInterval) clearInterval(bgInterval);

  function changeBackground() {
    const query = keywords[i % keywords.length];
    const url = `https://source.unsplash.com/1600x900/?${query}`;
    console.log("Background changing to:", url);

    // Preload image first → then apply
    const img = new Image();
    img.onload = () => {
      body.style.background = `url('${url}') no-repeat center/cover`;
    };
    img.onerror = () => {
      // fallback in case Unsplash fails
      body.style.background = "url('https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1600&q=80') no-repeat center/cover";
    };
    img.src = url;

    i++;
  }

  changeBackground(); // show first background immediately
  bgInterval = setInterval(changeBackground, 20000); // every 20 sec
}
