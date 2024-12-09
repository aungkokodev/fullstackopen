import { useEffect, useState } from "react";
import CountryList from "./components/CountryList";
import countryService from "./services/countries";
import Country from "./components/Country";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");

  const handleSearchChange = (e) => {
    setFilter(e.target.value);
  };

  useEffect(() => {
    countryService.getAll().then((data) => setCountries(data));
  }, []);

  const result = filter
    ? countries.filter((c) =>
        c.name.common.toLowerCase().includes(filter.toLowerCase().trim())
      )
    : [];

  return (
    <>
      <div>
        find countries
        <input type="text" value={filter} onChange={handleSearchChange} />
      </div>
      {result.length > 10 ? (
        <p>too many matches, specify another filter</p>
      ) : result.length === 1 ? (
        <Country country={result[0]} />
      ) : (
        <CountryList countries={result} />
      )}
    </>
  );
};

export default App;
