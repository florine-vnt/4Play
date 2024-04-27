import { useState, useEffect } from "react";
import "./motif.css";
import ColorLegend from "./ColorLegend";
import MotifGame from "./MotifGame";
import KeyboardContainer from "../keyboard/KeyboardContainer";

function Motif() {
  const [solution, setSolution] = useState("");
  const [input, setInput] = useState("");
  const [historicArray, setHistoricArray] = useState([]);
  const [attempt, setAttempt] = useState(0);

  // gereration of array with 10 empty elements
  function generateEmptyArray() {
    const rowTemp = [];
    for (let i = 0; i < 10; i += 1) {
      rowTemp.push("");
    }
    return rowTemp;
  }
  const [row, setRow] = useState(generateEmptyArray());

  // fetching the API
  useEffect(() => {
    fetch(
      "https://my-json-server.typicode.com/florine-vnt/words-api/coiffeurs-10"
    )
      .then((response) => response.json())
      .then((data) => {
        // random a number between 0 & 29 (size of the array)
        const randomSolution = data[Math.floor(Math.random() * data.length)];
        setSolution(randomSolution.nom);
      });
  }, [setSolution]);

  // use colors to determine if letter is at the right place, or in the word, or isn't included
  const validationWordColors = (lettre, index) => {
    if (solution[index] === lettre) {
      return "#2cbfe2"; // blue color
    }
    if (solution[index] !== lettre && solution.includes(lettre)) {
      return "#ffb703"; // orange color
    }
    return "white";
  };

  // copy the input into the grid & check the colors once the row is complete
  useEffect(() => {
    for (let i = 0; i < 10; i += 1) {
      setRow((prevValue) => {
        const copy = [...prevValue];
        copy.splice(i, 1, input[i]);
        return copy;
      });
    }

    if (input.length === 10 && attempt <= 5) {
      const array = input.split("");
      const arrayLettersWithStatus = array.map((l, index) => ({
        lettre: l,
        status: validationWordColors(l, index),
      }));

      setHistoricArray((currentValue) => [
        ...currentValue,
        ...arrayLettersWithStatus,
      ]);
      setRow(generateEmptyArray());
      setInput("");
      setAttempt((prevCount) => prevCount + 1);
    }
  }, [input, attempt]);

  // condition to end the game. Idea: put these lines in return & add a component EndMessage
  if (
    (input.length === 10 && attempt === 5) ||
    (input.length === 10 && input === solution)
  ) {
    // console.log("game is over");
  }

  // add the color generated to the status
  const generateColor = (el) => {
    if (el.status === "#2cbfe2") {
      return "#2cbfe2"; // blue color
    }
    if (el.status === "#ffb703") {
      return "#ffb703"; // orange color
    }
    return "white";
  };

  return (
    <section className="motif-game">
      <header>
        <h3>Mo'tif</h3>
        <img src="./src/assets/images/thierry.png" alt="Thierry Beccaro" />
      </header>
      <div className="grille-jeux">
        {historicArray.map((el) => (
          <div
            key={Math.random() * 1000}
            style={{
              backgroundColor: generateColor(el),
            }}
          >
            {el.lettre}
          </div>
        ))}
        {attempt <= 5 &&
          row.map((el) => <div key={Math.random() * 1000}>{el}</div>)}
      </div>
      <ColorLegend />
      <MotifGame solution={solution} />
      <KeyboardContainer input={input} setInput={setInput} limit={10} />
    </section>
  );
}

export default Motif;
