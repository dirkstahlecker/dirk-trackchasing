import React from 'react';
import {observer} from "mobx-react";
import {observable, action, makeObservable, runInAction} from "mobx";
import { EventObj, Track, Flip } from '../Types';
import {FlipTile} from "./FlipTile";

export class EventTileMachine
{

}

export interface EventTileProps
{
  machine: EventTileMachine;
  track: Track;
  event: EventObj;
}

@observer
export class EventTile extends React.Component<EventTileProps>
{
  render()
  {
    const event: EventObj = this.props.event;
    return <div className="event-place">
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
    </div>;
  }
}
