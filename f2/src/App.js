import React, { useEffect, useState } from 'react';
import './App.css';
import InputFields from './components/InputFields';
import RelationTable from './components/RelationTable';
import SearchPlane from './components/SearchPlane';


const relations = ["Father", "Mother", "Son", "Daughter", "Husband", "Wife", "Brother", "Sister", "Grandfather", "Grandmother", "Grandson", "Granddaughter", "Uncle", "Aunt", "Nephew", "Niece", "Cousin"];

function App() {
  const [error, setError] = useState();
  const [userArray, setUserArray] = useState([]);
  const [relationsArray, setRelationArray] = useState([]);
  //add new Relation
  const addNewRelation = (firstUser, secondUser, relation) => {
    if (firstUser.trim().length === 0 || secondUser.trim().length === 0 || relation.length === 0) {
      setError(`Please fill the required fields`);
      console.log(error);
    } else {
      fetch('http://localhost:9000/newrelation',
        {
          method: "post",
          body: JSON.stringify(
            {
              firstUser: capitaliseFirst(firstUser),
              secondUser: capitaliseFirst(secondUser),
              relation,
              found: false
            }
          ),
          headers: { 'content-type': "application/json" },
        })
        .then((res) => res.json())
        .then((res) => {
          if (res.error !== undefined) {
            console.log(res.error)
            setError(res.error);
          } else {
            setRelationArray([...relationsArray, res]);

            const exsistFirst = userArray.includes(capitaliseFirst(firstUser));
            const exsistSecond = userArray.includes(capitaliseFirst(secondUser));
            console.log("first ", exsistFirst);
            if (!exsistFirst) {
              userArray.push(capitaliseFirst(firstUser));
            }
            if (!exsistSecond) {
              userArray.push(capitaliseFirst(secondUser));
            }
            setError();
          }
        });
    }
  }
  // capitalise the first latter of users
  function capitaliseFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  useEffect(() => {
    fetch('http://localhost:9000/resetdb');
  }, []);

  return (
    <div className="App">
      <div className="header">Relation Builder</div>
      <InputFields relations={relations} addNewRelation={addNewRelation} error={error} />
      <RelationTable relations={relations} setRelationArray={setRelationArray} relationsArray={relationsArray} />
      <SearchPlane userArray={userArray} />
    </div>
  );
}

export default App;
