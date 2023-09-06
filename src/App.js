import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from './components/SearchBar';
import './App.css';

function App() {
  const apiKey = process.env.REACT_APP_API_KEY;

  const [searchResults, setSearchResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  const kelvinToCelsius = (kelvin) => (kelvin - 273.15).toFixed(2);

  const fetchWeatherData = (url) => {
    axios
      .get(url)
      .then((response) => {
        setSearchResults([response.data]);
        setErrorMessage(null);
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
        setSearchResults([]);
        setErrorMessage('Error fetching weather data. Location Not Found');
      });
  };

  const handleSearch = (query) => {
    const url = query.match(/^\d+(\.\d+)?,\s?\d+(\.\d+)?$/)
      ? `https://api.openweathermap.org/data/2.5/weather?lat=${query}&lon=${query}&appid=${apiKey}`
      : `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}`;

    fetchWeatherData(url);
  };

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
          fetchWeatherData(url);
        },
        (error) => {
          console.error('Error getting geolocation:', error);
          setErrorMessage('Error getting geolocation. Please enter a location manually.');
        }
      );
    } else {
      setErrorMessage('Geolocation is not supported by your browser. Please enter a location manually.');
    }
  }, [apiKey]);

  return (
    <div className='searchbarresults'>
      <h1>Weather App</h1>
      <SearchBar onSearch={handleSearch} />
      {errorMessage && <p>{errorMessage}</p>}
      <div className="results-container">
        {searchResults.map((result, index) => (
          <div key={index} className="weather-details">
            <h2>{result.name}</h2>
            <p>Temperature: {kelvinToCelsius(result.main.temp)}°C</p>
            <p>Feels Like: {kelvinToCelsius(result.main.feels_like)}°C</p>
            <p>Temp_min: {kelvinToCelsius(result.main.temp_min)}°C</p>
            <p>Temp_max: {kelvinToCelsius(result.main.temp_max)}°C</p>
            <p>Pressure: {result.main.pressure} hPa</p>
            <p>Humidity: {result.main.humidity}%</p>
            <p>Wind Speed: {result.wind.speed} m/s</p>
            <p>Sunrise: {new Date(result.sys.sunrise * 1000).toLocaleTimeString()}</p>
            <p>Sunset: {new Date(result.sys.sunset * 1000).toLocaleTimeString()}</p>
            <p className="weather-description">Weather: {result.weather[0].description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
