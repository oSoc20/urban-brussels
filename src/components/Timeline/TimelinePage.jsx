import React, { useState } from "react";
import HorizontalTimeline from "react-horizontal-timeline"
import "./TimelinePage.css"

const dates = ["5 january 1923", "26 april 1970", "14 december 2018"];
const names = ["Eiffel Tower","Collégiale Saints-Pierre-et-Guidon", "Taj Mahal"]
const streetName =["Rue de Praetere 24", "Boulevard Anspach 153-153a-153b", "Rue de la Vénerie 54-56-58"]
const architects = ["Jean VAN RUYSBROECK", "J.-J. VAN YSENDIJCK", "Georges HAUPT"]
const pictures = ["/src/assets/pic1.jpg","/images/pic2.jpg","/images/pic3.jpg"]

const Timeline = () => {
  const [value, setValue] = useState(0);
  //const [previous, setPrevious] = useState(0);

    return (
      <div>
        {/* Bounding box for the Timeline */}
        <div style={{ width: '80%', height: '100px', margin: '0 auto' }}>
          <HorizontalTimeline
            index={value}
            indexClick={(index) => {
              setValue(index)
              //setPrevious(value);
            }}
            values={ dates } />
        </div>
        <div className='urbanproperty'>
          {/* any arbitrary component can go here */}
          <h2>{names[value]}</h2>
          <p></p>
          <h4>{streetName[value]}</h4>
          <p>{architects[value]}</p>
          <div>
            <img src={pictures[value]} alt={names[value]}/>
          </div>
        </div>
      </div>
    );
};

export default Timeline;