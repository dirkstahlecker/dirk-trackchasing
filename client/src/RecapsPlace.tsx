import React, { SyntheticEvent } from 'react';
import {observer} from "mobx-react";
import {observable, action, makeObservable, runInAction} from "mobx";
import { NavigationMachine } from './NavigationMachine';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarPlace.css';
import { EventObj, Track, TrackName } from './Types';

type EventWithTrackObj = {eventObj: EventObj, trackObj: Track};

export class RecapsPlaceMachine
{
  @observable public eventsWithRecap: EventWithTrackObj[] = [];

  constructor()
  {
    makeObservable(this);
  }

  public async fetchEventsWithRecap(): Promise<void>
  {
    const recapRaw = await fetch(`/recaps`);
    const recapJson: EventObj[] = await recapRaw.json();

    recapJson.forEach(async(eventObj: EventObj) => {
      const trackObjRaw = await this.fetchTrackObj(eventObj.trackName);
      const trackObj: Track = new Track(
        new TrackName(trackObjRaw.trackNameObj.baseName, trackObjRaw.trackNameObj.configuration, 
          trackObjRaw.trackNameObj.isConfiguration), 
        trackObjRaw.state, trackObjRaw.trackType, 
        trackObjRaw.latitude, trackObjRaw.longitude, trackObjRaw.count, trackObjRaw.flips);
      runInAction(() => this.eventsWithRecap.push({eventObj, trackObj}))
    });

    console.log(this.eventsWithRecap);
  }

  public async fetchTrackObj(trackName: TrackName): Promise<Track>
  {
    const trackNameObj: TrackName = new TrackName(trackName.baseName, trackName.configuration, trackName.isConfiguration);
    const trackObjRaw = await fetch(`/tracks/trackObjForName/${trackNameObj.print()}`)
    const trackObjJson: Track  = await trackObjRaw.json();

    console.log(trackObjJson);
    return trackObjJson
  }
}

export interface RecapsPlaceProps
{
  machine: RecapsPlaceMachine;
  navMachine: NavigationMachine;
}

@observer
export class RecapsPlace extends React.Component<RecapsPlaceProps>
{
  componentDidMount()
  {
    this.props.machine.fetchEventsWithRecap();
  }

  render()
  {
    return <div className="recaps-place" style={{height: "100%"}}>
      <button onClick={this.props.navMachine.goHome}>Go Home</button>
      {
        this.props.machine.eventsWithRecap?.map((event: EventWithTrackObj) => {
          return <div key={event.eventObj.date.toString() + event.eventObj.classes}>
            <button onClick={() => this.props.navMachine.goToEventPage(event.trackObj, event.eventObj)}>
              {event.eventObj.date.toString()}: {event.trackObj.trackNameObj.print()}
            </button>
          </div>;
        })
      }
    </div>;
  }
}
