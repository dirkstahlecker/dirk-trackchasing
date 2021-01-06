import React from 'react';
import {observer} from "mobx-react";
import {observable, action, makeObservable} from "mobx";
import { NavigationMachine } from './NavigationMachine';

export interface AboutPlaceProps
{
  navMachine: NavigationMachine;
}

@observer
export class AboutPlace extends React.Component<AboutPlaceProps>
{
  render()
  {
    return <div className="about-place">
      <button onClick={this.props.navMachine.goHome}>Go Home</button>
      <h2>About: TODO text here</h2>

      <h2>What is Trackchasing?</h2>

      <h3>About Flips:</h3>
      <p>
        Racing comes with inherent risks and no one likes to see cars torn up or drivers put in 
        danger. I don't wish for any driver to flip. But, if a flip is going to happen, I definitely
        want to be there to see it. I think it's a natural human attraction to spectacle - nothing to
        do with malice, flips are just a wild event that stick in my mind and are fascinating to watch
        as long as no one gets hurt. It's with that spirit that I post videos of the flips I've seen.
      </p>
    </div>;
  }
}