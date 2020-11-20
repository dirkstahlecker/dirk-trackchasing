import React from 'react';
// import ReactDOM from "react-dom";
import {observer} from "mobx-react";
import {observable, action, makeObservable} from "mobx";

export enum CurrentPlace {HOME, TRACK, MAP}

export class NavigationMachine
{
  @observable public currentPlace: CurrentPlace = CurrentPlace.HOME;
  @observable public currentTrackName: string | null = null;

  constructor() 
  {
    makeObservable(this);
  }

  @action
  public goToTrackPage(trackName: string): void
  {
    this.currentTrackName = trackName;
    this.currentPlace = CurrentPlace.TRACK;
  }

  @action
  public goHome(): void
  {
  	this.currentPlace = CurrentPlace.HOME;
  	this.currentTrackName = null;
  }
}
