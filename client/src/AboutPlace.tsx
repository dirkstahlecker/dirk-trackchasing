import React from 'react';
import {observer} from "mobx-react";
import {observable, action, makeObservable} from "mobx";
import { NavigationMachine } from './NavigationMachine';

export interface AboutPlaceProps
{
  navMachine: NavigationMachine;
}

export class AboutPlace extends React.Component<AboutPlaceProps>
{
  render()
  {
    return <div className="about-place">
      <button onClick={() => this.props.navMachine.goHome()}>Go Home</button>
      About: TODO text here
    </div>;
  }
}