import React from 'react';
import {observer} from "mobx-react";
import {observable, action, makeObservable} from "mobx";

export interface AboutPlaceProps
{

}

@observer
export class AboutPlace extends React.Component<AboutPlaceProps>
{
  render()
  {
    return <div className="about-place">
      {/* <button onClick={this.props.navMachine.goHome}>Go Home</button> */}
      <h2>What is Trackchasing?</h2>
      {/* <p>Trackchasing is a hobby for those who enjoy </p> */}

      <a href="http://roamingtheraceways.com/trackchasermainmenu.html" target="_blank">Trackchasing Home Page</a>

      {/* <h3>About Flips:</h3>
      <p>
        Racing comes with inherent risks and no one likes to see cars torn up or drivers put in 
        danger. I don't wish for any particular driver to flip. But, if a flip is going to happen, 
        I definitely want to be there to see it. I think it's a natural human attraction to spectacle 
        - nothing to
        do with malice, flips are just a wild event that stick in my mind and are fascinating to watch
        as long as no one gets hurt. It's with that spirit that I post videos of the flips I've seen 
        (I will never post video of a fatal crash)
      </p> */}
    </div>;
  }
}