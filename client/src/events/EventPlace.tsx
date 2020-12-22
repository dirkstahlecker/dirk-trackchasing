import React from 'react';
import {observer} from "mobx-react";
import {observable, action, makeObservable, runInAction} from "mobx";
import { EventObj, Track, Flip } from '../Types';
import {FlipTile} from "./FlipTile";
import { NavigationMachine } from '../NavigationMachine';

export class EventPlaceMachine
{
  constructor()
  {
    makeObservable(this);
  }

  @observable public recapString: string | null = null;

  public async fetchEventRecap(dateStr: string, trackNameStr: string): Promise<void>
  {
    const recapRaw = await fetch(`/recap/${dateStr}/${trackNameStr}`);
    const recapJson = await recapRaw.json();
    const recapStr = recapJson["recap"];

    runInAction(() => this.recapString = recapStr);
  }
}

export interface EventPlaceProps
{
  machine: EventPlaceMachine;
  navMachine: NavigationMachine;
  event: EventObj;
  track: Track;
}

@observer
export class EventPlace extends React.Component<EventPlaceProps>
{
  componentDidMount()
  {
    this.props.machine.fetchEventRecap(this.props.event.date, this.props.track.trackNameObj.print());
  }

  render()
  {
    const event: EventObj = this.props.event;
    return <div className="event-place">
      <button onClick={() => this.props.navMachine.goToTrackPage(this.props.track)}>Back</button>
      <div>Event at {this.props.track.trackNameObj.print()} on {this.props.event.date}</div>
      <br/>
      <div>Classes: {event.classes}</div>
      <div>
        {event.flips.length} Flips:
        {event.flips.map((flip: Flip) => {
          return <FlipTile
            key={flip.flipId}
            flip={flip}
          />;
        })}
      </div>
      {
        this.props.machine.recapString != null &&
        <div>
          Event Recap:
          {this.props.machine.recapString}
        </div>
      }
    </div>;
  }
}
