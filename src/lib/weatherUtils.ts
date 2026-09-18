import {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  type LucideIcon,
  Moon,
  CloudMoon
} from "lucide-react";

export interface WeatherCondition {
  description: string;
  icon: LucideIcon;
  nightIcon?: LucideIcon;
}

export function getWeatherCondition(code: number): WeatherCondition {
  // WMO Weather interpretation codes (WW)
  // https://open-meteo.com/en/docs
  switch (true) {
    case code === 0:
      return { description: "Clear sky", icon: Sun, nightIcon: Moon };
    case code === 1:
      return { description: "Mainly clear", icon: CloudSun, nightIcon: CloudMoon };
    case code === 2:
      return { description: "Partly cloudy", icon: CloudSun, nightIcon: CloudMoon };
    case code === 3:
      return { description: "Overcast", icon: Cloud };
    case [45, 48].includes(code):
      return { description: "Fog", icon: CloudFog };
    case [51, 53, 55, 56, 57].includes(code):
      return { description: "Drizzle", icon: CloudDrizzle };
    case [61, 63, 65, 66, 67, 80, 81, 82].includes(code):
      return { description: "Rain", icon: CloudRain };
    case [71, 73, 75, 77, 85, 86].includes(code):
      return { description: "Snow", icon: CloudSnow };
    case [95, 96, 99].includes(code):
      return { description: "Thunderstorm", icon: CloudLightning };
    default:
      return { description: "Unknown", icon: Cloud };
  }
}

export function convertTemp(tempInC: number, unit: 'C' | 'F'): number {
  if (unit === 'F') {
    return tempInC * (9 / 5) + 32;
  }
  return tempInC;
}

export function getWeatherAnimationClass(code: number): string {
  switch (true) {
    case code === 0:
    case code === 1:
      // Sunny / Clear: subtle warm glow pulse
      return "animate-[pulse_4s_ease-in-out_infinite] shadow-[inset_0_0_50px_rgba(253,186,116,0.15)]";
    case [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code):
      // Rain / Drizzle: subtle downward drift / ripple effect
      return "animate-[pulse_3s_ease-in-out_infinite] shadow-[inset_0_0_50px_rgba(96,165,250,0.15)] bg-gradient-to-b from-transparent to-blue-50/30";
    case [71, 73, 75, 77, 85, 86].includes(code):
      // Snow: subtle slow pulse with cold tone
      return "animate-[pulse_5s_ease-in-out_infinite] shadow-[inset_0_0_50px_rgba(191,219,254,0.2)] bg-gradient-to-b from-transparent to-slate-50/50";
    case [95, 96, 99].includes(code):
      // Thunderstorm: infrequent sharp flash
      return "animate-[pulse_1s_ease-in-out_infinite] shadow-[inset_0_0_50px_rgba(148,163,184,0.3)] bg-slate-50/50";
    default:
      // Cloudy / Default: very slow neutral pulse
      return "animate-[pulse_6s_ease-in-out_infinite] shadow-[inset_0_0_50px_rgba(241,245,249,0.5)]";
  }
}
