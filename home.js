const countryGrid = document.getElementById("countryGrid");
const modal = document.getElementById("countryModal");
const modalCountryName = document.getElementById("modalCountryName");
const modalCountryDetails = document.getElementById("modalCountryDetails");
const modalWeatherDetails = document.getElementById("modalWeatherDetails");

async function fetchCountryData() {
  const countryInput = document.getElementById("countryInput").value;
  if (!countryInput) {
    alert("Please enter a country name.");
    return;
  }

  try {
    const response = await fetch(`https://restcountries.com/v3.1/name/${countryInput}`);
    const countries = await response.json();
    countryGrid.innerHTML = "";

    countries.forEach(country => {
      const card = document.createElement("div");
      card.className = "country-card";

      card.innerHTML = `
        <img src="${country.flags.svg}" alt="${country.name.common} flag">
        <h3>${country.name.common}</h3>
        <button onclick='showMoreDetails(${JSON.stringify(country)}, ${country.latlng[0]}, ${country.latlng[1]})'>
          More Details
        </button>
      `;

      countryGrid.appendChild(card);
    });
  } catch (error) {
    alert("Error fetching country data. Please check your input.");
    console.error(error);
  }
}

async function showMoreDetails(country, lat, lon) {
  modal.style.display = "flex";
  modalCountryName.textContent = country.name.common;
  modalCountryDetails.innerHTML = `
    <img src="${country.flags.svg}" width="100">
    <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
    <p><strong>Region:</strong> ${country.region}</p>
    <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
  `;

  try {
    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
    const weatherData = await weatherRes.json();
    const weather = weatherData.current_weather;

    modalWeatherDetails.innerHTML = `
      <h4>Weather</h4>
      <p><strong>Temperature:</strong> ${weather.temperature}°C</p>
      <p><strong>Wind Speed:</strong> ${weather.windspeed} km/h</p>
      <p><strong>Weather Code:</strong> ${weather.weathercode}</p>
    `;
  } catch (error) {
    modalWeatherDetails.innerHTML = "<p>Weather data unavailable.</p>";
  }
}

function closeModal() {
  modal.style.display = "none";
  modalCountryName.textContent = "";
  modalCountryDetails.innerHTML = "";
  modalWeatherDetails.innerHTML = "";
}
