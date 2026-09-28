import { useEffect, useRef, useState } from "react";
import "./App.css";
import weatherBg from "./assets/bg.jpg";
import axios from "axios";

function App() {
  const inputRef = useRef();
  const [city, setCity] = useState("Tbilisi");
  const [weather, setWeather] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const { VITE_WEATHER_API_KEY } = import.meta.env;
      try {
        // http://api.openweathermap.org/geo/1.0/direct?q={city name}&appid={API key}
        const responce = await axios.get(
          "http://api.openweathermap.org/geo/1.0/direct",
          {
            params: {
              q: city,
              appid: VITE_WEATHER_API_KEY,
            },
          },
        );
        const data = responce.data[0];
        const { lat, lon } = data;

        const weatherResponce = await axios.get(
          "https://api.openweathermap.org/data/2.5/weather",
          {
            params: {
              lat: lat,
              lon: lon,
              appid: VITE_WEATHER_API_KEY,
              units: "metric",
            },
          },
        );
        console.log(weatherResponce.data);
        setWeather(weatherResponce.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [city]);

  const handleSearch = () => {
    const value = inputRef.current.value;
    setCity(value);
  };

  return (
    <section
      className="relative h-screen flex justify-center items-start"
      style={{
        backgroundImage: `url(${weatherBg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-stone-900/30 backdrop-blur-md" />
      <div>
        <div className="relative z-10 flex gap-4 mt-10 p-6 bg-stone-900/50 rounded-lg">
          <input
            type="text"
            placeholder="Search Location..."
            className="w-200 p-4 rounded-lg text-md outline-none bg-gray-100/50"
            ref={inputRef}
          />
          <button
            onClick={handleSearch}
            className="p-4 text-md font-medium text-blue-700 rounded-lg bg-gray-100/50 cursor-pointer "
          >
            Search
          </button>
        </div>
        {weather && (
          <>
            <div className="relative z-10 flex items-center justify-between gap-4 mt-8 p-6 bg-stone-900/50 rounded-lg text-white">
              <div className="flex flex-col gap-3">
                <h2 className="text-4xl">{city}</h2>
                <h2 className="text-3xl">{Math.round(weather.main.temp)}°</h2>
              </div>
              <div>
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                />
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-2 gap-4 mt-4">
              <div className="p-4 bg-stone-900/50 rounded-lg text-white text-center">
                <p className="text-lg text-gray-300">Feels like</p>
                <p className="text-xl font-bold">
                  {Math.round(weather.main.feels_like)}°
                </p>
              </div>

              <div className="p-4 bg-stone-900/50 rounded-lg text-white text-center">
                <p className="text-lg text-gray-300">Humidity</p>
                <p className="text-xl font-bold">{weather.main.humidity}%</p>
              </div>

              <div className="p-4 bg-stone-900/50 rounded-lg text-white text-center">
                <p className="text-lg text-gray-300">Wind Speed</p>
                <p className="text-xl font-bold">{weather.wind.speed} m/s</p>
              </div>

              <div className="p-4 bg-stone-900/50 rounded-lg text-white text-center">
                <p className="text-lg text-gray-300">Visibility</p>
                <p className="text-xl font-bold">{weather.visibility} km</p>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default App;
