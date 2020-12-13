import React from 'react';
// import ReactDOM from "react-dom";
import {observer} from "mobx-react";
import {observable, action, makeObservable} from "mobx";
import { Track } from './Types';

export enum CurrentPlace {HOME, TRACK, ABOUT}

export class NavigationMachine
{
  @observable public currentPlace: CurrentPlace = CurrentPlace.HOME;
  @observable public currentTrack: Track | null = null;

  constructor() 
  {
    makeObservable(this);
  }

  @action
  public goToTrackPage(track: Track): void
  {
    this.currentTrack = track;
    this.currentPlace = CurrentPlace.TRACK;
  }

  @action
  public goHome(): void
  {
  	this.currentPlace = CurrentPlace.HOME;
  	this.currentTrack = null;
  }

  @action
  public goToAboutPage(): void
  {
    this.currentPlace = CurrentPlace.ABOUT;
    this.currentTrack = null;
  }
}
