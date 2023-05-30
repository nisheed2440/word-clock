import { useEffect, useState } from "react";
import {
  WordClock,
  DEFAULT_INPUT_MATRIX,
  DEFAULT_MATRIX_MAPPED_DATA,
} from "./utils";

const wordClock = new WordClock(
  DEFAULT_INPUT_MATRIX,
  DEFAULT_MATRIX_MAPPED_DATA
);

function App() {
  const [matrix, setMatrix] = useState(wordClock.getTimePhraseGrid(Date.now()));
  useEffect(() => {
    // Set interval
    const interval = setInterval(() => {
      setMatrix(wordClock.getTimePhraseGrid("2021-01-01T12:35:00"));
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <>
      <h2 className="text-2xl font-sans font-medium text-center p-2 my-2">
        Word Clock
      </h2>
      <div className="card flex justify-center">
        <div className="matrix box-content rounded-md border border-gray-200 p-4 shadow-md">
          {matrix.map((row, i) => (
            <div className="flex justify-center row font-mono" key={i}>
              {row.map((col, j) => (
                <div
                  className="flex select-none justify-center items-center w-10 h-10"
                  key={j}
                >
                  <span
                    className={
                      col.active
                        ? "text-gray-950 font-semibold"
                        : "text-gray-950/25 font-medium"
                    }
                  >
                    {col.letter}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
