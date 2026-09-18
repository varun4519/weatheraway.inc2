import { AlertTriangle } from "lucide-react";
import { CurrentWeather } from "../types";

interface WeatherAlertsProps {
  current: CurrentWeather;
}

export function WeatherAlerts({ current }: WeatherAlertsProps) {
  const alerts: string[] = [];

  // Temperature alerts
  if (current.temperature_2m >= 35) {
    alerts.push("Extreme Heat Advisory: Temperatures exceed 35°C (95°F). Limit outdoor activities.");
  } else if (current.temperature_2m <= -10) {
    alerts.push("Extreme Cold Warning: Temperatures are below -10°C (14°F). Risk of frostbite.");
  }

  // Wind alerts
  if (current.wind_speed_10m >= 50) {
    alerts.push(`High Wind Warning: Sustained winds at ${Math.round(current.wind_speed_10m)} km/h.`);
  }

  // Severe Weather Codes (WMO Codes)
  const code = current.weather_code;
  if ([95, 96, 99].includes(code)) {
    alerts.push("Thunderstorm Warning: Severe electrical storms detected in the area.");
  }
  if ([65, 67, 82].includes(code)) {
    alerts.push("Heavy Rainfall Advisory: High precipitation rates. Risk of localized flooding.");
  }
  if ([75, 77, 86].includes(code)) {
    alerts.push("Heavy Snow Warning: Heavy snowfall expected. Reduced visibility.");
  }
  if ([66, 67].includes(code)) {
    alerts.push("Freezing Rain Advisory: Watch for icy roads and slippery surfaces.");
  }

  if (alerts.length === 0) return null;

  return (
    <div className="w-full bg-red-50 border border-red-200 rounded-3xl p-6 mb-6 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <AlertTriangle className="w-6 h-6 text-red-600" />
        <h3 className="text-lg font-bold text-red-900">Active Weather Alerts</h3>
      </div>
      <ul className="space-y-2">
        {alerts.map((alert, index) => (
          <li key={index} className="flex items-start gap-2 text-red-800 font-medium">
            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
            <span>{alert}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
