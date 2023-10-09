// src/MyApp.js
import React, {useState, useEffect} from 'react';
import Table from "./Table";
import Form from './Form';

function MyApp() {
  const [characters, setCharacters] = useState([]);   

  function removeOneCharacter (index) {
    const remove = characters[index];
    fetch(`http://localhost:8000/users/${remove.id}`, {
      method: 'DELETE',
    })
    .then((response) => {
      if (response.status === 204) {
        const updated = characters.filter((character) => character.id !== remove.id);
        console.log("updated: ", updated)
        setCharacters(updated);
      } else if (response.status === 404) {
        console.log('User not found on the server');
      } else {
        console.log('Failed to delete user');
      }
    })
    .catch((error) => {
      console.log('Error with deleting');
    });
  }
 
  function updateList(person) {
    postUser(person)
      .then((response) => {
        if (response.status === 201) {
          return response.json()
        }
        else {
          console.log('Error with updating list')
        }
      })
      .then(() => setCharacters([...characters, person]))
      .catch((error) => {
        console.log(error);
      })
  }

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => { console.log(error); });
  }, [] );

  function postUser(person) {
    const promise = fetch("Http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });

    return promise;
  }

  return (
    <div className="container">
      <Table characterData={characters} 
        removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList}/>
    </div>  
  ) 

}
export default MyApp;