import React from 'react';
// import ReactDOM from "react-dom";
import {observer} from "mobx-react";
import {observable, action, makeObservable} from "mobx";
import { EventObj, Track_old, Track } from './Types';

export enum CurrentPlace {HOME, TRACK, ABOUT, EVENT, CONTACT, ALL_TRACKS, CALENDAR, RECAPS}

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
  public goHome = (e: React.MouseEvent): void => {
  	this.currentPlace = CurrentPlace.HOME;
    this.currentTrack = null;
    this.currentEvent = null;
  }

  @action
  public goToAllTracksPage = (e: React.MouseEvent): void => {
    this.currentPlace = CurrentPlace.ALL_TRACKS;
    this.currentTrack = null;
    this.currentEvent = null;
  }

  @action
  public goToCalendar = (e: React.MouseEvent): void => {
    this.currentPlace = CurrentPlace.CALENDAR;
    this.currentTrack = null;
    this.currentEvent = null
  };

  @action
  public goToRecapsPage = (e: React.MouseEvent): void => {
    this.currentPlace = CurrentPlace.RECAPS;
    this.currentTrack = null;
    this.currentEvent = null;
  };

  @action
  public goToAboutPage = (e: React.MouseEvent): void => {
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

  @action
  public goToContactPage = (): void => {
    this.currentPlace = CurrentPlace.CONTACT;
    this.currentEvent = null;
    this.currentTrack = null;
  }
}
