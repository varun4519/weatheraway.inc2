import { Droplets, Wind } from "lucide-react";
import { CurrentWeather as CurrentWeatherType } from "../types";
import { convertTemp, getWeatherCondition, getWeatherAnimationClass } from "../lib/weatherUtils";
import { cn } from "../lib/utils";

interface CurrentWeatherProps {
  weather: CurrentWeatherType;
  cityName: string;
  unit: 'C' | 'F';
}

export function CurrentWeatherDisplay({ weather, cityName, unit }: CurrentWeatherProps) {
  const condition = getWeatherCondition(weather.weather_code);
  const animationClass = getWeatherAnimationClass(weather.weather_code);
  const Icon = (weather.is_day === 0 && condition.nightIcon) ? condition.nightIcon : condition.icon;

  const displayTemp = Math.round(convertTemp(weather.temperature_2m, unit));

  return (
    <div className={cn(
      "bg-white rounded-3xl p-8 shadow-sm border border-neutral-100 flex flex-col items-center text-center transition-colors duration-1000",
      animationClass
    )}>
      <h2 className="text-2xl font-bold text-neutral-800 mb-1 relative z-10">{cityName}</h2>
      <p className="text-neutral-500 font-medium mb-6 relative z-10">Current Conditions</p>
      
      <div className="flex items-center justify-center gap-6 mb-8 relative z-10">
        <Icon className="w-20 h-20 text-blue-500" strokeWidth={1.5} />
        <div className="flex flex-col items-start">
          <span className="text-6xl font-black text-neutral-900 tracking-tighter">
            {displayTemp}°{unit}
          </span>
          <span className="text-lg text-neutral-600 font-medium capitalize">
            {condition.description}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full relative z-10">
        <div className="bg-neutral-50 rounded-2xl p-4 flex items-center justify-center gap-3">
          <Droplets className="w-5 h-5 text-blue-400" />
          <div className="text-left">
            <p className="text-sm text-neutral-500 font-medium">Humidity</p>
            <p className="text-lg font-bold text-neutral-800">{weather.relative_humidity_2m}%</p>
          </div>
        </div>
        <div className="bg-neutral-50 rounded-2xl p-4 flex items-center justify-center gap-3">
          <Wind className="w-5 h-5 text-blue-400" />
          <div className="text-left">
            <p className="text-sm text-neutral-500 font-medium">Wind</p>
            <p className="text-lg font-bold text-neutral-800">{Math.round(weather.wind_speed_10m)} km/h</p>
          </div>
        </div>
      </div>
    </div>
  );
}
