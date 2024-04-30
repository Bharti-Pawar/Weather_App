import React, { useEffect, useState } from 'react';
import './WApp.css';
import s_icon from '../Assets/search.png';
import c_icon from '../Assets/clear.png';
import cl_icon from '../Assets/cloud.png';
import d_icon from '../Assets/drizzle.png';
import r_icon from '../Assets/rain.png';
import sn_icon from '../Assets/snow.png';
import w_icon from '../Assets/wind.png';
import h_icon from '../Assets/humidity.png';
import p_icon from '../Assets/pressure.png';
import wt_icon from '../Assets/weather.png';
import sr_icon from '../Assets/sunrise.png';
import ss_icon from '../Assets/sunset.png';
import a from '../Assets/A.png';
import b from '../Assets/B.png';
import c from '../Assets/C.png';
import d from '../Assets/D.png';
import e from '../Assets/E.png';
import f from '../Assets/F.png';
import g from '../Assets/G.png';
import bg from './bg.jpg';

const WApp = () => {
  let api_key = "35b35d99eaf2622a3f6c3e693dd04ddf";

  const [wicon, setwicon] = useState(cl_icon);
  const [ticon, setticon] = useState(null);
  const [wd, setwd] = useState(null);
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [sevenDaysForecast, setSevenDaysForecast] = useState([]);
  const [thirtyDaysForecast, setThirtyDaysForecast] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false); // State to control visibility of recent searches dropdown

  useEffect(() => {
    // Function to fetch weather data based on user's current location
    const fetchWeatherDataByLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
      } else {
        console.error('Geolocation is not supported by this browser.');
        setErrorMessage('Geolocation is not supported by this browser.');
      }
    };

    // Success callback for geolocation
    const success = async (position) => {
      const { latitude, longitude } = position.coords;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${api_key}`;
      const response = await fetch(url);
      const data = await response.json();
      setCity(data.name);
      setWeatherData(data);
      fetchForecastData(data.coord.lat, data.coord.lon);
      fetchHourlyForecast(data.coord.lat, data.coord.lon);
    };

    // Error callback for geolocation
    const error = (err) => {
      console.error('Error retrieving geolocation:', err);
      setErrorMessage('Geolocation access denied. Please enter your city manually.');
    };

    fetchWeatherDataByLocation();
  }, []);

  useEffect(() => {
    // Function to fetch 30 days forecast data based on user's current location
    const fetchThirtyDaysForecastData = async () => {
      if (weatherData) {
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&cnt=30&units=metric&appid=${api_key}`;
        const response = await fetch(url);
        const data = await response.json();
        setThirtyDaysForecast(data.list);
      }
    };

    fetchThirtyDaysForecastData();
  }, [weatherData]);

  const fetchForecastData = async (lat, lon) => {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`;
    const response = await fetch(url);
    const data = await response.json();
    setSevenDaysForecast(data.list.filter((item, index) => index % 8 === 0));
  };

  const fetchHourlyForecast = async (lat, lon) => {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`;
    const response = await fetch(url);
    const data = await response.json();
    setHourlyForecast(data.list.slice(0, 8));
  };

  const search = async () => {
    const element = document.getElementsByClassName("city");
    if (element[0].value === "") {
      alert("Please enter a Location");
      setErrorMessage("Please enter a city.");
      return 0;
    }

    let url = `https://api.openweathermap.org/data/2.5/weather?q=${element[0].value}&units=Metric&appid=${api_key}`;
    let response = await fetch(url);
    if (!response.ok) {
      setErrorMessage("City not found. Please enter a valid city.");
      return;
    }
    let data = await response.json();

    setWeatherData(data);
    fetchForecastData(data.coord.lat, data.coord.lon);
    fetchHourlyForecast(data.coord.lat, data.coord.lon);
    setErrorMessage("");

    if (!recentSearches.includes(data.name)) {
      setRecentSearches([data.name, ...recentSearches]);
    }

    const humidity = document.getElementsByClassName("humidity-percent");
    const wind = document.getElementsByClassName("wind-rate");
    const temperature = document.getElementsByClassName("weather-temp");
    const location = document.getElementsByClassName("weather-location");

    const pressure = document.getElementsByClassName("pressure");
    const weather = document.getElementsByClassName("weather");
    const sunrise = document.getElementsByClassName("sunrise");
    const sunset = document.getElementsByClassName("sunset");

    humidity[0].innerHTML = data.main.humidity + " %";
    wind[0].innerHTML = data.wind.speed + " km/h";
    temperature[0].innerHTML = data.main.temp + "°C" + " | " + ((data.main.temp * 9 / 5) + 32).toFixed(2) + "°F";
    location[0].innerHTML = data.name;
    pressure[0].innerHTML = data.main.pressure;
    weather[0].innerHTML = data.weather[0].description;

    const srt = data.sys.sunrise;
    const date = new Date(srt * 1000);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    sunrise[0].innerHTML = `${hours}:${minutes}:${seconds}`;

    const sst = data.sys.sunset;
    const date1 = new Date(sst * 1000);
    const hours1 = date1.getHours().toString().padStart(2, '0');
    const minutes1 = date1.getMinutes().toString().padStart(2, '0');
    const seconds1 = date1.getSeconds().toString().padStart(2, '0');
    sunset[0].innerHTML = `${hours1}:${minutes1}:${seconds1}`;

    if (data.weather[0].icon === "01d" || data.weather[0].icon === "01n") {
      setwicon(c_icon);
    } else if (data.weather[0].icon === "02d" || data.weather[0].icon === "02n") {
      setwicon(cl_icon);
    } else if (data.weather[0].icon === "03d" || data.weather[0].icon === "03n") {
      setwicon(d_icon);
    } else if (data.weather[0].icon === "04d" || data.weather[0].icon === "04n") {
      setwicon(d_icon);
    } else if (data.weather[0].icon === "09d" || data.weather[0].icon === "09n") {
      setwicon(r_icon);
    } else if (data.weather[0].icon === "10d" || data.weather[0].icon === "10n") {
      setwicon(r_icon);
    } else if (data.weather[0].icon === "13d" || data.weather[0].icon === "13n") {
      setwicon(sn_icon);
    } else {
      setwicon(c_icon);
    }

    if (data.main.temp >= 0 && data.main.temp <= 14) {
      setticon(a);
      setwd("cold");
    } else if (data.main.temp >= 15 && data.main.temp <= 28) {
      setticon(b);
      setwd("cool");
    } else if (data.main.temp >= 29 && data.main.temp <= 42) {
      setticon(c);
      setwd("optimal");
    } else if (data.main.temp >= 43 && data.main.temp <= 56) {
      setticon(d);
      setwd("warm");
    } else if (data.main.temp >= 57 && data.main.temp <= 70) {
      setticon(e);
      setwd("heat");
    } else if (data.main.temp >= 71 && data.main.temp <= 87) {
      setticon(f);
      setwd("extreme heat");
    } else {
      setticon(g);
      setwd("hell on earth");
    }
  };

  const handleInputChange = (event) => {
    setCity(event.target.value);
  };

  const handleRecentSearchClick = (cityName) => {
    setCity(cityName);
    search();
    setShowRecentSearches(false);
  };

  const handleInputFocus = () => {
    setShowRecentSearches(true);
  };

  const handleInputBlur = () => {
    // Delay the hiding to check if the click event is on the dropdown
    setTimeout(() => {
      setShowRecentSearches(false);
    }, 200);
  };

  const getForecastContainerClass = (temperature) => {
    if (temperature < 30) {
      return "blue";
    }
    else if (temperature < 60) {
      return "orange";
    } else {
      return "red";
    }
  };

  let d = new Date();
  let date = d.getDate();
  let year = d.getFullYear();
  let month = d.toLocaleString("default", { month: 'long' });
  let day = d.toLocaleString("default", { weekday: 'long' });

  let time = d.toLocaleString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <div>
      <div>
        <div className="card text-white text-center border-0">
          <img src={bg} />
          <div className="card-img-overlay w-10">
            <div className="input-group mb-4 w-50 mx-auto">
              <div className="top-bar">
                <input
                  type="text"
                  className="city"
                  value={city}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  placeholder='Search'
                />
                <div className="search-icon" onClick={() => { search() }}>
                  <img src={s_icon} alt="" />
                </div>
                {recentSearches.length > 0 && (
                  <div className="recent-searches" style={{ display: showRecentSearches ? 'block' : 'none' }}>
                    <h2>Recent Searches</h2>
                    <ul>
                      {recentSearches.map((item, index) => (
                        <li key={index} onClick={() => handleRecentSearchClick(item)}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-dark bg-opacity-50 py-3">
              <div className="weather-image">
                <img src={wicon} alt="" />
              </div>
              {errorMessage && <div className="error-message">{errorMessage}</div>}
              <p className="card-text lead">
                {day}, {month} {date}, {year}
                <br />
                {time}
              </p>
              <hr />
              <img src={ticon} alt="" />
              <div className="data">{wd}</div>
              <div className="weather-temp"></div>
              <div className="weather-location"></div>
              <hr />
              <div className="data-container">
                <div className="A">
                  <div className="element">
                    <img src={h_icon} alt="" />
                    <div className="data">
                      <div className="humidity-percent"></div>
                      <div className="text">Humidity</div>
                    </div>
                  </div>
                  <div className="element">
                    <img src={w_icon} alt="" />
                    <div className="data">
                      <div className="wind-rate"></div>
                      <div className="text">Wind Speed</div>
                    </div>
                  </div>
                </div>
                <div className="B">
                  <div className="element">
                    <img src={p_icon} alt="" />
                    <div className="data">
                      <div className="pressure"></div>
                      <div className="text">Pressure</div>
                    </div>
                  </div>
                  <div className="element">
                    <img src={wt_icon} alt="" />
                    <div className="data">
                      <div className="weather"></div>
                      <div className="text">Weather</div>
                    </div>
                  </div>
                </div>
                <div className="C">
                  <div className="element">
                    <img src={sr_icon} alt="" />
                    <div className="data">
                      <div className="sunrise"></div><p className="text">Am</p>
                      <div className="text">Sunrise</div>
                    </div>
                  </div>
                  <div className="element">
                    <img src={ss_icon} alt="" />
                    <div className="data">
                      <div className="sunset"></div><p className="text">Pm</p>
                      <div className="text">Sunset</div>
                    </div>
                  </div>
                </div>
              </div>
              <hr />
              {hourlyForecast.length > 0 &&
                <div className="forecast">
                  <h2>Per 3-Hourly Forecast Weather Data</h2>
                  <div className="forecast-container">
                    {hourlyForecast.map((item, index) => (
                      <div key={index} className={`forecast-item ${getForecastContainerClass(Math.round(item.main.temp))}`}>
                        <p>{new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        <img src={`https://openweathermap.org/img/w/${item.weather[0].icon}.png`} alt="weather icon" />
                        <p>{`${Math.round(item.main.temp)}°C`}</p>
                        <p>{item.weather[0].description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              }
              <hr />
              {sevenDaysForecast.length > 0 &&
                <div className="forecast">
                  <h2>Next 5-Days Forecast Weather Data</h2>
                  <div className="forecast-container">
                    {sevenDaysForecast.map((item, index) => (
                      <div key={index} className={`forecast-item ${getForecastContainerClass(Math.round(item.main.temp))}`}>
                        <p>{new Date(item.dt * 1000).toLocaleDateString()}</p>
                        <img src={`https://openweathermap.org/img/w/${item.weather[0].icon}.png`} alt="weather icon" />
                        <p>{`${Math.round(item.main.temp)}°C`}</p>
                        <p>{item.weather[0].description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              }
              <hr />
              <div className="forecast">
                <h2>Next 30-Days Forecast Weather Data</h2>
                <div className="forecast-container scroll-container">
                  {thirtyDaysForecast.map((item, index) => (
                    <div key={index} className={`forecast-item ${getForecastContainerClass(Math.round(item.main.temp))}`}>
                      <p>{new Date(item.dt * 1000).toLocaleDateString()}</p>
                      <img src={`https://openweathermap.org/img/w/${item.weather[0].icon}.png`} alt="weather icon" />
                      <p>{`${Math.round(item.main.temp)}°C`}</p>
                      <p>{item.weather[0].description}</p>
                    </div>
                  ))}
                </div>
              </div>
              <hr/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WApp;
