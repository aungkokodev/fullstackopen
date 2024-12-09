const CountryList = ({ countries }) => (
  <div>
    {countries.map((c) => (
      <p key={c.name.common}>{c.name.common}</p>
    ))}
  </div>
);

export default CountryList;
