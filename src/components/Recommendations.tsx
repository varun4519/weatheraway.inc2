import { Map, Lightbulb, Umbrella, ThermometerSun, Snowflake } from "lucide-react";
import { CurrentWeather, DailyForecast } from "../types";

interface RecommendationsProps {
  current: CurrentWeather;
  daily: DailyForecast;
}

export function Recommendations({ current, daily }: RecommendationsProps) {
  // Logic to determine the best advice based on current conditions and today's forecast
  const getRecommendation = () => {
    const todayMaxTemp = daily.temperature_2m_max[0];
    const isRaining = current.precipitation > 0 || [51,53,55,56,57,61,63,65,66,67,80,81,82,95,96,99].includes(current.weather_code);

    if (isRaining) {
      return {
        title: "Wet Conditions",
        message: "It's raining or expected to rain. Don't forget your umbrella and wear waterproof shoes!",
        icon: Umbrella,
        color: "text-blue-500",
        bg: "bg-blue-50",
      };
    }

    if (todayMaxTemp > 30) {
      return {
        title: "Heat Advisory",
        message: "It's going to be quite hot today. Stay hydrated, wear sunscreen, and avoid strenuous outdoor activities during peak hours.",
        icon: ThermometerSun,
        color: "text-orange-500",
        bg: "bg-orange-50",
      };
    }

    if (todayMaxTemp < 10) {
      return {
        title: "Chilly Weather",
        message: "It's chilly outside. Dress warmly in layers, and grab a hot beverage on your way!",
        icon: Snowflake,
        color: "text-indigo-500",
        bg: "bg-indigo-50",
      };
    }

    if (current.weather_code === 0 && todayMaxTemp > 18 && todayMaxTemp < 28) {
      return {
        title: "Perfect Weather",
        message: "Clear skies and mild temperatures. It's a great day for outdoor activities, walking, or a picnic!",
        icon: Map,
        color: "text-green-500",
        bg: "bg-green-50",
      };
    }

    return {
      title: "Typical Conditions",
      message: "Expect standard seasonal weather. Enjoy your day and proceed with your normal plans.",
      icon: Lightbulb,
      color: "text-yellow-500",
      bg: "bg-yellow-50",
    };
  };

  const advice = getRecommendation();
  const Icon = advice.icon;

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-100 flex flex-col justify-center h-full">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-3 rounded-2xl ${advice.bg}`}>
          <Icon className={`w-6 h-6 ${advice.color}`} />
        </div>
        <h3 className="text-xl font-bold text-neutral-800">{advice.title}</h3>
      </div>
      <p className="text-neutral-600 leading-relaxed text-lg">
        {advice.message}
      </p>
    </div>
  );
}
