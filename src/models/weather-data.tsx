export interface WeatherData {
  city: string;
  temp: string;
  condition: string;
  humidity: string;
  wind: string;
  forecast: { day: string; temp: number }[];
}
