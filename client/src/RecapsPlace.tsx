import React, { SyntheticEvent } from 'react';
import {observer} from "mobx-react";
import {observable, action, makeObservable, runInAction} from "mobx";
import { NavigationMachine } from './NavigationMachine';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarPlace.css';
import { EventInfo, TrackName } from './Types';

export class RecapsPlaceMachine
{
  @observable public eventsWithRecap: EventInfo[] | null = null;

  constructor()
  {
    makeObservable(this);
  }

  public async fetchEventsWithRecap(): Promise<void>
  {
    const recapRaw = await fetch(`/recaps`);
    const recapJson = await recapRaw.json();

    runInAction(() => this.eventsWithRecap = recapJson);
  }

  //copied in server in eventRecaps.ts
//   public decodeEventFromString(inputStr: string): {date: Date, track: TrackName}
//   {
//     // const {date: Date, track: TrackName} = 
//     const pieces: string[] = inputStr.split(":");
//     if (pieces.length != 2)
//     {
//       throw new Error("input string isn't decodable to date and trackName");
//     }
//     const date: Date = new Date(pieces[0]);
//     const track: TrackName = TrackName.parse(pieces[1]);

//     console.log(date);
//     console.log(track.print());
//     return {date, track};
//   }
// }

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
        this.props.machine.eventsWithRecap?.map((eventStr: string) => {
          const {date, track} = this.props.machine.decodeEventFromString(eventStr);
          return <div key={eventStr}>
            {/* <button onClick={() => this.props.navMachine.goToEventPage(track,)}>{date.toString()}: {track.print()}</button> */}
          </div>;
        })
      }
    </div>;
  }
}
