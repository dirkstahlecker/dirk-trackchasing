import React from 'react';
// import ReactDOM from "react-dom";
import {observer} from "mobx-react";
import {observable, action, makeObservable} from "mobx";
import { EventObj, Track } from './Types';

export enum CurrentPlace {HOME, TRACK, ABOUT, EVENT}

export class NavigationMachine
{
  @observable public currentPlace: CurrentPlace = CurrentPlace.HOME;
  @observable public currentTrack: Track | null = null;
  @observable public currentEvent: EventObj | null = null;

  constructor() 
  {
    makeObservable(this);
  }

  @action
  public goToTrackPage(track: Track): void
  {
    this.currentTrack = track;
    this.currentPlace = CurrentPlace.TRACK;
    this.currentEvent = null;
  }

  @action
  public goHome(): void
  {
  	this.currentPlace = CurrentPlace.HOME;
    this.currentTrack = null;
    this.currentEvent = null;
  }

  @action
  public goToAboutPage(): void
  {
    this.currentPlace = CurrentPlace.ABOUT;
    this.currentTrack = null;
    this.currentEvent = null
  }

  @action
  public goToEventPage(track: Track, event: EventObj): void
  {
    this.currentPlace = CurrentPlace.EVENT;
    this.currentEvent = event;
    this.currentTrack = track;
  }
}
