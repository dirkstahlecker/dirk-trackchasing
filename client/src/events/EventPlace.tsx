import React from 'react';
import {observer} from "mobx-react";
import {observable, action, makeObservable, runInAction} from "mobx";
import { EventObj, Track, Flip, TrackName } from '../Types';
import {FlipTile} from "./FlipTile";
import { NavigationMachine } from '../NavigationMachine';
import { TrackInfoMachine } from '../tracks/TrackInfoMachine';

export class EventPlaceMachine
{
  constructor()
  {
    makeObservable(this);
  }

  @observable public recapString: string | null = null;

  public async fetchEventRecap(date: Date, trackNameStr: string): Promise<void>
  {
    //TODO: date??
    const recapRaw = await fetch(`/recap/${date}/${trackNameStr}`);
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

  private renderFlipVideo(flip: Flip): JSX.Element
  {
    return <video width="320" height="240" controls>
      <source src={`assets/flips/mp4/${flip.flipId}.mp4`} type="video/mp4"/>
      Your browser does not support the video tag.
    </video>;

    //TODO: multiple videos, like texas (onboard and outside)
  }

  render()
  {
    const event: EventObj = this.props.event;
    return <div className="event-place">
      <button onClick={() => this.props.navMachine.goToTrackPage(this.props.track)}>Back</button>
      <div>Event at {this.props.track.trackNameObj.print()} on {this.props.event.date.toString()}</div>
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
        this.props.track.flips.map((flip: Flip) => {
          if (TrackName.equals(flip.trackNameObj, this.props.track.trackNameObj))
          {
            return <div key={flip.flipId}>
              {this.renderFlipVideo(flip)}
            </div>
          }
          return undefined;
        })
      }

      {/* {
        this.props.track.flips.map((flip: Flip) => {
          return <img //TODO: this needs work
            src={TrackInfoMachine.flipGifPath(this.props.track.trackNameObj.print(), flip.flipId)}
            key={flip.flipId}
          />
        })
      } */}

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
