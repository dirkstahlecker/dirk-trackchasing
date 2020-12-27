import React, { SyntheticEvent } from 'react';
import {observer} from "mobx-react";
import {observable, action, makeObservable, runInAction} from "mobx";
import { NavigationMachine } from './NavigationMachine';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarPlace.css';
import { TrackName } from './Types';

// export class SingleRecapsPlaceMachine
// {
//   @observable public eventsWithRecap: string[] | null = null;

//   constructor()
//   {
//     makeObservable(this);
//   }
// }

//TODO: I don't think this is necessary (just use the events place)

export interface SingleRecapsPlaceProps
{
  // machine: SingleRecapsPlaceMachine;
  navMachine: NavigationMachine;
  recapText: string;
  date: Date;
  trackName: TrackName;
}

@observer
export class SingleRecapsPlace extends React.Component<SingleRecapsPlaceProps>
{
  render()
  {
    return <div className="recaps-place" style={{height: "100%"}}>
      <button onClick={this.props.navMachine.goToRecapsPage}>Go Back</button>
      {this.props.date.toString()}: {this.props.trackName.print()}
      <br/>
      {this.props.recapText}
    </div>;
  }
}
