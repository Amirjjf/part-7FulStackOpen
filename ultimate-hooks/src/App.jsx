/* eslint-disable no-unused-vars */

import { useState, useEffect } from "react";
import axios from "axios";

const useField = (type) => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const reset = () => setValue("");

  return {
    type,
    value,
    onChange,
    reset,
  };
};

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    const fetchResources = async () => {
      const response = await axios.get(baseUrl);
      setResources(response.data);
    };
    fetchResources();
  }, [baseUrl]);

  const create = (resource) => {
    axios
      .post(baseUrl, resource)
      .then((response) => {
        setResources(resources.concat(response.data));
      })
      .catch((error) => {
        console.error("Error creating resource:", error);
      });
  };

  const service = {
    create,
  };

  return [resources, service];
};

const App = () => {
  const content = useField("text");
  const name = useField("text");
  const number = useField("text");

  const { reset: resetContent, ...contentInput } = content;
  const { reset: resetName, ...nameInput } = name;
  const { reset: resetNumber, ...numberInput } = number;

  const [notes, noteService] = useResource("http://localhost:3005/notes");
  const [persons, personService] = useResource("http://localhost:3005/persons");

  const handleNoteSubmit = (event) => {
    event.preventDefault();
    noteService.create({ content: content.value });
    content.reset();
  };

  const handlePersonSubmit = (event) => {
    event.preventDefault();
    personService.create({ name: name.value, number: number.value });
    name.reset();
    number.reset();
  };

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...contentInput} />
        <button>create</button>
      </form>
      {notes.map((n) => (
        <p key={n.id}>{n.content}</p>
      ))}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...nameInput} /> <br />
        number <input {...numberInput} />
        <button>create</button>
      </form>
      {persons.map((n) => (
        <p key={n.id}>
          {n.name} {n.number}
        </p>
      ))}
    </div>
  );
};

export default App;
