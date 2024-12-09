import axios from "axios";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const baseUrl = "https://api.openweathermap.org/data/2.5";

const get = (city) =>
  axios
    .get(`${baseUrl}/weather?q=${city}&appid=${API_KEY}&units=metric`)
    .then((response) => response.data);

export default { get };
