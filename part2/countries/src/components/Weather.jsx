import { useEffect, useState } from "react";
import weatherService from "../services/weather";

const Weather = ({ city }) => {
  const [weather, setWeather] = useState({});

  useEffect(() => {
    weatherService.get(city).then((data) => setWeather(data));
  }, [city]);

  return (
    <div>
      <h2>Weather in {city}</h2>
      <p>temperature {weather.main?.temp} Celcius</p>
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather?.[0].icon}@2x.png`}
      />
      <p>wind {weather.wind?.speed} m/s</p>
    </div>
  );
};

export default Weather;
