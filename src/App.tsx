/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { CloudRain } from "lucide-react";
import { getWeather, searchCity } from "./api";
import { SearchBox } from "./components/SearchBox";
import { CurrentWeatherDisplay } from "./components/CurrentWeatherDisplay";
import { Recommendations } from "./components/Recommendations";
import { Forecast } from "./components/Forecast";
import { WeatherAlerts } from "./components/WeatherAlerts";
import { WeatherResponse, CityResult } from "./types";
import { cn } from "./lib/utils";

const RECENT_SEARCHES_KEY = "weather_away_recent_searches";

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [cityName, setCityName] = useState<string>("");
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse recent searches", e);
      }
    }
  }, []);

  const saveRecentSearch = (name: string) => {
    const updated = [name, ...recentSearches.filter((item) => item.toLowerCase() !== name.toLowerCase())].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  const handleSearch = async (query: string | CityResult) => {
    setIsLoading(true);
    setError(null);
    setWeatherData(null);

    try {
      let location: CityResult;

      if (typeof query === 'string') {
        const geoData = await searchCity(query);
        
        if (!geoData.results || geoData.results.length === 0) {
          setError(`We couldn't find a city named "${query}". Please check the spelling and try again.`);
          setIsLoading(false);
          return;
        }
        location = geoData.results[0];
      } else {
        location = query;
      }

      const nameParts = [location.name, location.admin1, location.country].filter(Boolean);
      const fullName = nameParts.join(", ");
      
      setCityName(fullName);
      saveRecentSearch(fullName);

      const weather = await getWeather(location.latitude, location.longitude);
      setWeatherData(weather);

    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching the weather data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 text-neutral-900 font-sans selection:bg-blue-100">
      <div className="max-w-5xl mx-auto px-4 py-12 md:py-20">
        
        {/* Header section */}
        <header className="flex flex-col items-center mb-12 text-center relative">
          
          <div className="absolute top-0 right-0 flex items-center bg-white p-1 rounded-full shadow-sm border border-neutral-200">
            <button
              onClick={() => setUnit('C')}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                unit === 'C' ? "bg-blue-600 text-white shadow-md" : "text-neutral-500 hover:text-neutral-900"
              )}
            >
              °C
            </button>
            <button
              onClick={() => setUnit('F')}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                unit === 'F' ? "bg-blue-600 text-white shadow-md" : "text-neutral-500 hover:text-neutral-900"
              )}
            >
              °F
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6 mt-14 md:mt-0">
            <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-500/20">
              <CloudRain className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-neutral-900">WeatherAway.Inc</h1>
          </div>
          <p className="text-neutral-500 font-medium max-w-lg mb-8">
            Intelligent forecasting and personalized recommendations to help you plan your day.
          </p>
          <SearchBox onSearch={handleSearch} isLoading={isLoading} recentSearches={recentSearches} />
        </header>

        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto bg-red-50 border border-red-100 rounded-2xl p-6 text-center animate-in fade-in zoom-in-95 duration-300">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        {/* Empty State / Loading State Placeholder */}
        {!weatherData && !error && !isLoading && (
          <div className="max-w-2xl mx-auto border-2 border-dashed border-neutral-200 rounded-3xl p-12 text-center text-neutral-400">
            <p>Search for a city above to get your intelligent weather forecast.</p>
          </div>
        )}

        {/* Weather Content */}
        {weatherData && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            <WeatherAlerts current={weatherData.current} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              <CurrentWeatherDisplay weather={weatherData.current} cityName={cityName} unit={unit} />
              <Recommendations current={weatherData.current} daily={weatherData.daily} />
            </div>
            <Forecast daily={weatherData.daily} unit={unit} />
          </div>
        )}

      </div>
    </div>
  );
}

