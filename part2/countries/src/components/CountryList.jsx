const CountryList = ({ countries, handleShow }) => (
  <div>
    {countries.map((c) => (
      <p key={c.name.common}>
        {c.name.common} <button onClick={() => handleShow(c)}>show</button>
      </p>
    ))}
  </div>
);

export default CountryList;
