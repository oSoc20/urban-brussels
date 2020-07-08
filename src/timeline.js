import React from "react";
import HorizontalTimeline from "react-horizontal-timeline"
import "./timeline.css"

const VALUES = [ "2000-01-04", "2001-05-13", "2002-03-08", "2003-09-14", "2004-06-23", "2005"];
const description = ["On the first floor, the front room housed the architect's office. It retains a beamed ceiling, as well as a hood chimney decorated with a female profile in relief. In the central room, used as a dining room, the walls are adorned with imitation tapestries in monochrome, inspired by the works of Teniers (HEYMANS, V., 1994, figs. 224-245). The ceiling is also structured by beams. At the rear, veranda with window decorated with a stained glass window", "Description2","Description3", "Description4","Description5","Description6"];

export default class Timeline extends React.Component {
  state = { value: 0, previous: 0 };

  render() {
    return (
      <div>
        {/* Bounding box for the Timeline */}
        <div style={{ width: '60%', height: '100px', margin: '0 auto', paddingTop: '3%' }}>
          <HorizontalTimeline
            index={this.state.value}
            indexClick={(index) => {
              this.setState({ value: index, previous: this.state.value });
            }}
            values={ VALUES } />
        </div>
        <div className='text-center'>
        
          <p> Name</p>   
          {VALUES[this.state.value]}
          <p>{description[this.state.value]}</p>
          </div>
      </div>
        );
    }
}