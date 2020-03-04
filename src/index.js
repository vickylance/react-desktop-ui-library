import React, { useEffect, useRef, useState, useCallback } from "react";
import ReactDOM from "react-dom";
// import styled from "@emotion/styled";

import "./styles.scss";

function map(x, in_min, in_max, out_min, out_max) {
  return ((x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
}

function clamp(x, minimum, maximum) {
  return Math.max(minimum, Math.min(x, maximum));
}

function ValueSLider({ label, valueRange, defaultValue }) {
  const [value, setValue] = useState(
    (defaultValue || valueRange.min).toFixed(2)
  );
  const elem = useRef(null);
  const fillElem = useRef(null);

  const calculateRange = useCallback(
    (element, evt) => {
      const rect = element.getBoundingClientRect();
      const x = evt.clientX - rect.left; //x position within the element.
      // const y = evt.clientY - rect.top; //y position within the element.
      setValue(
        clamp(
          map(x, 0, rect.width, valueRange.min, valueRange.max),
          valueRange.min,
          valueRange.max
        ).toFixed(2)
      );
    },
    [valueRange.min, valueRange.max]
  );

  const handleValueInput = e => {
    const str = e.target.value;
    if (str.match(/[.]/g) && str.match(/[.]/g).length > 1) {
      return;
    }
    if (str.charAt(str.length - 1) === ".") {
      setValue(str);
      return;
    }
    setValue(clamp(str, valueRange.min, valueRange.max));
  };

  useEffect(() => {
    let element = elem.current;
    let started;
    let downListener = e => {
      console.log("Started");
      started = true;
      calculateRange(element, e);
    };
    element.addEventListener("mousedown", downListener);

    let moveListener = e => {
      if (started) {
        calculateRange(element, e);
      }
    };
    window.addEventListener("mousemove", moveListener);

    let upListener = () => {
      if (started) {
        started = false;
        console.log("Move Ended");
      }
    };
    window.addEventListener("mouseup", upListener);

    return () => {
      // release memory
      element.removeEventListener("mousedown", downListener);
      window.removeEventListener("mousemove", moveListener);
      window.removeEventListener("mouseup", upListener);
    };
  }, [calculateRange]);

  useEffect(() => {
    let fillElement = fillElem.current;
    fillElement.style.width =
      map(value, valueRange.min, valueRange.max, 0, 100) + "%";
  }, [value, valueRange.min, valueRange.max]);

  return (
    <div className="value-slider noselect">
      <div className="value-slider__label">{label}</div>
      <div className="value-slider__container" ref={elem}>
        <div className="value-slider__background" />
        <div className="value-slider__fill" ref={fillElem} />
        <input
          className="value-slider__value"
          value={value}
          type="text"
          onChange={handleValueInput}
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <div className="set">
        <ValueSLider
          label="X"
          valueRange={{ min: 0, max: 10 }}
          defaultValue={0}
        />
        <ValueSLider
          label="Y"
          valueRange={{ min: 0, max: 10 }}
          defaultValue={0}
        />
        <ValueSLider
          label="Z"
          valueRange={{ min: 0, max: 10 }}
          defaultValue={0}
        />
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
