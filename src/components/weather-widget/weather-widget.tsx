import { useState, useEffect } from "react";
import type { WeatherData } from "../../models/weather-data";
import "./weather-widget.css";

export default function WeatherWidget() {
  const API_KEY = import.meta.env.VITE_API_KEY;
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchWeatherData() {
    try {
      setLoading(true);

      const [weatherRes, forecastRes] = await Promise.all([
        fetch(`${BASE_URL}/weather?q=Halifax&units=metric&appid=${API_KEY}`),
        fetch(`${BASE_URL}/forecast?q=Halifax&units=metric&appid=${API_KEY}`),
      ]);

      const weatherJson = await weatherRes.json();
      const forecastJson = await forecastRes.json();

      const forecast = forecastJson.list
        .filter((item: any) => item.dt_txt.includes("12:00:00"))
        .slice(0, 5)
        .map((item: any) => ({
          day: new Date(item.dt_txt).toLocaleDateString("en-US", {
            weekday: "short",
          }),
          temp: `${Math.round(item.main.temp)}°C`,
        }));

      const data: WeatherData = {
        city: weatherJson.name,
        temp: `${Math.round(weatherJson.main.temp)}°C`,
        condition: weatherJson.weather[0].description,
        humidity: `${weatherJson.main.humidity}%`,
        wind: `${weatherJson.wind.speed} km/h`,
        forecast,
      };

      setWeatherData(data);
    } catch (err) {
      setError("Failed to fetch weather :(");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchWeatherData();
  }, []);

  if (loading) {
    return (
      <div className="spinner-border mt-5" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-100 text-center mt-4">
        <p>{error}</p>
      </div>
    );
  }

  if (!weatherData) return null;

  return (
    <div className="weather-widget">
      <h3 className="weather-title">SYSTEM WEATHER NODE</h3>
      <p className="weather-city">Location: {weatherData.city}</p>

      <div className="weather-main">
        <div className="weather-temp">{weatherData.temp}</div>
        <div className="weather-cond">{weatherData.condition}</div>
      </div>

      <div className="weather-meta">
        <span>Humidity: {weatherData.humidity}</span>
        <span>Wind: {weatherData.wind}</span>
      </div>

      <div className="weather-forecast">
        {weatherData.forecast.map((f) => (
          <div key={f.day} className="forecast-item">
            <span>{f.day}</span>
            <span>{f.temp}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
