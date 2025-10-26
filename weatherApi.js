import axios from 'axios';

// Geocoding API
export const geocodeLocation = async (location) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search`,
      {
        params: {
          q: location,
          format: 'json',
          limit: 1
        }
      }
    );
    return response.data[0];
  } catch (error) {
    throw new Error('Location not found');
  }
};

// Elevation API
export const getElevation = async (lat, lon) => {
  try {
    const response = await axios.get(
      `https://api.open-elevation.com/api/v1/lookup`,
      {
        params: {
          locations: `${lat},${lon}`
        }
      }
    );
    return response.data.results[0].elevation;
  } catch (error) {
    console.warn('Elevation API failed, continuing without elevation data');
    return null;
  }
};

// Weather API - UPDATED to include current weather
export const getWeatherData = async (lat, lon) => {
  try {
    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast`,
      {
        params: {
          latitude: lat,
          longitude: lon,
          current: 'temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m', // Add current weather
          daily: 'temperature_2m_max,precipitation_sum',
          past_days: 10,
          forecast_days: 7,
          timezone: 'Africa/Johannesburg'
        }
      }
    );
    return response.data;
  } catch (error) {
    throw new Error('Weather data unavailable');
  }
};