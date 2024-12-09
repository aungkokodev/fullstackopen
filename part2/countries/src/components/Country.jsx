const Country = ({ country }) => (
  <div>
    <h2>{country.name.common}</h2>
    <p>capital {country.capital.join(", ")}</p>
    <p>area {country.area}</p>
    <h3>languages:</h3>
    <ul>
      {Object.values(country.languages).map((language) => (
        <li key={language}>{language}</li>
      ))}
    </ul>
    <img src={country.flags.png} alt={country.flags.alt} />
  </div>
);

export default Country;
