import { format, parseISO } from "date-fns";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DailyForecast } from "../types";
import { convertTemp, getWeatherCondition } from "../lib/weatherUtils";
import { motion } from "motion/react";

interface ForecastProps {
  daily: DailyForecast;
  unit: 'C' | 'F';
}

export function Forecast({ daily, unit }: ForecastProps) {
  // Format data for Recharts and Cards
  const forecastData = daily.time.map((dateStr, index) => {
    return {
      date: dateStr,
      displayDate: index === 0 ? "Today" : format(parseISO(dateStr), "EEE, MMM d"),
      shortDate: index === 0 ? "Today" : format(parseISO(dateStr), "EEE"),
      minTemp: Math.round(convertTemp(daily.temperature_2m_min[index], unit)),
      maxTemp: Math.round(convertTemp(daily.temperature_2m_max[index], unit)),
      weatherCode: daily.weather_code[index],
    };
  });

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-100 mt-8">
      <h3 className="text-xl font-bold text-neutral-800 mb-6">7-Day Forecast</h3>
      
      {/* Chart Section */}
      <div className="h-48 w-full mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={forecastData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorMaxTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="shortDate" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#a3a3a3', fontSize: 12 }} 
              dy={10} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#a3a3a3', fontSize: 12 }}
              domain={['dataMin - 5', 'dataMax + 5']}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              labelStyle={{ color: '#525252', fontWeight: 600, marginBottom: '4px' }}
            />
            <Area 
              type="monotone" 
              dataKey="maxTemp" 
              stroke="#3b82f6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorMaxTemp)" 
              name={`Max Temp (°${unit})`}
            />
            <Area 
              type="monotone" 
              dataKey="minTemp" 
              stroke="#93c5fd" 
              strokeWidth={2}
              fill="none" 
              name={`Min Temp (°${unit})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {forecastData.map((day, i) => {
          const condition = getWeatherCondition(day.weatherCode);
          const Icon = condition.icon;
          
          return (
            <motion.div 
              key={day.date} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4, ease: "easeOut" }}
              whileHover={{ 
                scale: 1.05, 
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
              }}
              className="flex flex-col items-center p-4 rounded-2xl bg-neutral-50 border border-neutral-100 hover:bg-white hover:border-blue-100 transition-colors cursor-default"
            >
              <span className="text-sm font-medium text-neutral-500 mb-3">{day.shortDate}</span>
              <Icon className="w-8 h-8 text-neutral-700 mb-3" strokeWidth={1.5} />
              <div className="flex items-center gap-2">
                <span className="font-bold text-neutral-900">{day.maxTemp}°</span>
                <span className="text-neutral-400 font-medium text-sm">{day.minTemp}°</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
