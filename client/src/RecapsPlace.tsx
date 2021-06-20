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

  private recapObjects: {href: string; title: string}[] = [
    {href: "/recaps/2-01-20_Boardwalk_Hall.pdf", title: "2-01-20: Boardwalk Hall"},
    {href: "/recaps/6-19-20_Tri-State_Speedway.pdf", title: "6-19-20: Tri-State Speedway"},
    {href: "/recaps/7-03-20_Big_Diamond.pdf", title: "7-03-20: Big Diamond Speedway"},
    {href: "/recaps/8-21-20_Lucas_Oil_Raceway.pdf", title: "8-21-20: Lucas Oil Raceway"},
    {href: "/recaps/8-23-20_Indiana_State_Fairgrounds.pdf", title: "8-23-20: Indiana State Fairgrounds"},
    {href: "/recaps/3-26-21_Boyds_Speedway.pdf", title: "3-26-21: Boyd's Speedway"},
    {href: "/recaps/5-23-21.pdf", title: "5-23-21: Central Cycle Club and Pomfret Speedway"},
    {href: "/recaps/5-29-21_Fulton_Speedway.pdf", title: "5-29-21: Fulton Speedway"},
    {href: "/recaps/6-13-21_ActionTrackUSA.pdf", title: "6-13-21: Action Track USA"},
    {href: "/recaps/6-14-21_Wayne_County_Speedway.pdf", title: "6-14-21: Wayne County Speedway"},
    {href: "/recaps/6-19-21_Path_Valley_Speedway_Park.pdf", title: "6-19-21: Path Valley Speedway Park"},
  ]

  render()
  {
    return <div className="recaps-place" style={{height: "100%"}}>
      {/* <button onClick={this.props.navMachine.goHome}>Go Home</button>
      {
        this.props.machine.eventsWithRecap?.map((event: EventWithTrackObj) => {
          return <div key={event.eventObj.date.toString() + event.eventObj.classes}>
            <button onClick={() => this.props.navMachine.goToEventPage(event.trackObj, event.eventObj)}>
              {event.eventObj.date.toString()}: {event.trackObj.trackNameObj.print()}
            </button>
          </div>;
        })
      } */}

      <h2>Event Recaps</h2>      
      {
        this.recapObjects.map((recapObj: {href: string, title: string}) => {
          return <>
            <a href={recapObj.href} target="_blank">{recapObj.title}</a>
            <br/>
          </>
        })
      }

    </div>;
  }
}
