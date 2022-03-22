import React, { SyntheticEvent } from 'react';
import {observer} from "mobx-react";
import {observable, action, makeObservable, runInAction} from "mobx";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarPlace.css';
import { EventObj, TrackName } from './Types';

export abstract class RecapsDataMachine
{
  private static internalData: {trackName: string, dates: string[]}[] = [
    {trackName: "Boardwalk Hall", dates: ["2-01-20"]},
    {trackName: "Tri-State Speedway", dates: ["6-19-20"]},
    {trackName: "Big Diamond Speedway", dates: ["7-03-20"]},
    {trackName: "Lucas Oil Raceway", dates: ["8-21-20"]},
    {trackName: "Indiana State Fairgrounds", dates: ["8-23-20"]},
    {trackName: "Boyd's Speedway", dates: ["3-26-21"]},
    {trackName: "Fulton Speedway", dates: ["5-29-21"]},
    {trackName: "Action Track USA", dates: ["6-13-21"]}, //TODO
    {trackName: "Wayne County Speedway", dates: ["6-14-21"]},
    {trackName: "Path Valley Speedway Park", dates: ["6-19-21"]},
    {trackName: "Selinsgrove Raceway Park", dates: ["6-20-21"]},
    {trackName: "Bloomsburg Fairgrounds Speedway", dates: ["6-20-21"]},
    {trackName: "Riverhead Raceway", dates: ["6-26-21"]},
    {trackName: "KRA Speedway", dates: ["7-08-21"]},
    {trackName: "ERX Motor Park", dates: ["7-10-21"]},
    {trackName: "Mason City Motor Speedway", dates: ["7-11-21"]},
    {trackName: "Clyde Martin Memorial Speedway", dates: ["8-07-21"]},
    {trackName: "Perris Auto Speedway", dates: ["8-21-21"]},
    {trackName: "Huset's Speedway", dates: ["9-10-21"]},
    {trackName: "Talladega Superspeedway", dates: ["10-02-21"]},
    {trackName: "Talladega Short Track", dates: ["10-02-21"]},
    {trackName: "Arizona Speedway", dates: ["11-12-21"]},
    {trackName: "Cocopah Speedway", dates: ["1-27-22"]},
    {trackName: "Irwindale Speedway", dates: ["2-05-22"]},
    {trackName: "Los Angeles Memorial Coliseum", dates: ["2-06-22"]},
    {trackName: "Hickory Motor Speedway and Carolina Speedway", dates: ["3-18-22"]},
  ];

  /**
   * internalData has an array of dates for each track to make filtering and
   * displaying by track easier. This is a helper to flatten them out to
   * make it easier to map in the renderer.
   */
  public static recapsData(): {trackName: string, date: string}[]
  {
    const ret: {trackName: string, date: string}[] = [];
    this.internalData.forEach((value: {trackName: string, dates: string[]}) => {
      value.dates.forEach((date: string) => {
        ret.push({trackName: value.trackName, date: date});
      });
    });
    return ret;
  }

  //TODO: how to represent this?
  private recapObjects: {href: string; title: string}[] = [
    {href: "/recaps/5-23-21.pdf", title: "5-23-21: Central Cycle Club and Pomfret Speedway"},
  ]

  // public static getTracks(): string[]
  // {
  //   return Object.keys(this.data);
  // }

  public static recapDatesForTrack(trackName: string): string[] | undefined
  {
    return this.internalData.find((value: {trackName: string, dates: string[]}) => {
      return value.trackName === trackName;
    })?.dates;
  }

  public static makeUrl(trackName: string, date: string): string
  {
    const trackNameFixed = trackName.replaceAll(" ", "_").replaceAll("'", "");
    return `/recaps/${date}_${trackNameFixed}.pdf`;
  }

  public static makeDisplayName(trackName: string, date: string): string
  {
    return `${date}: ${trackName}`;
  }

  public static renderLink(recapObj: {trackName: string, date: string}): JSX.Element
  {
    return <a href={RecapsDataMachine.makeUrl(recapObj.trackName, recapObj.date)} target="_blank">
      {RecapsDataMachine.makeDisplayName(recapObj.trackName, recapObj.date)}
    </a>
  }

// Cocopah Speedway|1-27-22;
// Boardwalk Hall|2-01-20;
// Irwindale Speedway|2-05-22;
}

export class RecapsPlaceMachine
{
  // @observable public eventsWithRecap: EventWithTrackObj[] = [];

  constructor()
  {
    // makeObservable(this);
  }

  // public async fetchEventsWithRecap(): Promise<void>
  // {
  //   const recapRaw = await fetch(`/recaps`);
  //   const recapJson: EventObj[] = await recapRaw.json();

  //   recapJson.forEach(async(eventObj: EventObj) => {
  //     const trackObjRaw = await this.fetchTrackObj(eventObj.trackName);
  //     const trackObj: Track_old = new Track_old(
  //       new TrackName(trackObjRaw.trackNameObj.baseName, trackObjRaw.trackNameObj.configuration, 
  //         trackObjRaw.trackNameObj.isConfiguration), 
  //       trackObjRaw.state, trackObjRaw.trackType, 
  //       trackObjRaw.latitude, trackObjRaw.longitude, trackObjRaw.count, trackObjRaw.flips);
  //     runInAction(() => this.eventsWithRecap.push({eventObj, trackObj}))
  //   });

  //   console.log(this.eventsWithRecap);
  // }

  // public async fetchTrackObj(trackName: TrackName): Promise<Track_old>
  // {
  //   const trackNameObj: TrackName = new TrackName(trackName.baseName, trackName.configuration, trackName.isConfiguration);
  //   const trackObjRaw = await fetch(`/tracks/trackObjForName/${trackNameObj.print()}`)
  //   const trackObjJson: Track_old  = await trackObjRaw.json();

  //   console.log(trackObjJson);
  //   return trackObjJson
  // }
}

export interface RecapsPlaceProps
{
  machine: RecapsPlaceMachine;
}

@observer
export class RecapsPlace extends React.Component<RecapsPlaceProps>
{
  componentDidMount()
  {
    // this.props.machine.fetchEventsWithRecap();
  }



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
        RecapsDataMachine.recapsData().map((recapObj: {trackName: string, date: string}) => {
          return <>
            {RecapsDataMachine.renderLink(recapObj)}
            <br/>
          </>
        })
      }

    </div>;
  }
}
