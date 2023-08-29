import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from './components/SearchBar';
import './App.css';

function App() {
  const apiKey = '6a245621503bfcb08400248d491fca20';

  const [searchResults, setSearchResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  const kelvinToCelsius = (kelvin) => (kelvin - 273.15).toFixed(2);

  const fetchWeatherData = (url) => {
    axios
      .get(url)
      .then((response) => {
        const { data } = response;
        console.log('API response:', data);
        setSearchResults([data]);
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
      ? `https://api.openweathermap.org/data/2.5/weather?lat=${query}&APPID=${apiKey}`
      : `https://api.openweathermap.org/data/2.5/weather?q=${query}&APPID=${apiKey}`;

    fetchWeatherData(url);
  };

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${apiKey}`;
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
  }, []);

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
            <p className="weather-description">Weather: {result.weather[0].description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
