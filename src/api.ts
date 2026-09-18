import { GeocodingResponse, WeatherResponse } from "./types";

const GEOCODING_API_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_API_URL = "https://api.open-meteo.com/v1/forecast";

export async function searchCity(query: string): Promise<GeocodingResponse> {
  const response = await fetch(`${GEOCODING_API_URL}?name=${encodeURIComponent(query)}&count=1`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch city data.");
  }
  
  return response.json();
}

export async function fetchCitySuggestions(query: string): Promise<GeocodingResponse> {
  const response = await fetch(`${GEOCODING_API_URL}?name=${encodeURIComponent(query)}&count=5`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch city suggestions.");
  }
  
  return response.json();
}

export async function getWeather(lat: number, lon: number): Promise<WeatherResponse> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum",
    timezone: "auto"
  });

  const response = await fetch(`${FORECAST_API_URL}?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch weather data.");
  }
  
  return response.json();
}
