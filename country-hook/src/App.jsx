import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://studies.cs.helsinki.fi/restcountries/api/name/";

const useField = (type) => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };

  return {
    type,
    value,
    onChange,
  };
};

const useCountry = (name) => {
  const [country, setCountry] = useState({
    found: false,
    data: null,
  });

  useEffect(() => {
    if (name) {
      axios
        .get(`${API_URL}${name}`)
        .then((response) => {
          setCountry({
            found: true,
            data: response.data,
          });
        })
        .catch(() => {
          setCountry({
            found: false,
            data: null,
          });
        });
    } else {
      setCountry({ found: false, data: null });
    }
  }, [name]);

  return country;
};

const Country = ({ country }) => {
  if (!country || !country.data) {
    return null;
  }

  if (!country.found) {
    return <div>not found...</div>;
  }

  const { name, capital, population, flags } = country.data;

  return (
    <div>
      <h3>{name?.common || "Unknown"} </h3>
      <div>capital {capital && capital.length > 0 ? capital[0] : "N/A"} </div>
      <div>population {population || "N/A"}</div>
      {flags?.png && (
        <img
          src={flags.png}
          height="100"
          alt={`flag of ${name?.common || "country"}`}
        />
      )}
    </div>
  );
};

const App = () => {
  const nameInput = useField("text");
  const [name, setName] = useState("");
  const country = useCountry(name);

  const fetch = (e) => {
    e.preventDefault();
    setName(nameInput.value);
  };

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button type="submit">find</button>
      </form>
      <Country country={country} />
    </div>
  );
};

export default App;
