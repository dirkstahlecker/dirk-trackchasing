import React from 'react';
import {observer} from "mobx-react";
import {observable, action, makeObservable, runInAction} from "mobx";
import { Race } from '../Types';
import { printDate } from '../utilities';

export interface RaceTileProps
{
  race: Race;
}

@observer
export class RaceTile extends React.Component<RaceTileProps>
{
  render()
  {
    return <div className="event-place">
      {printDate(this.props.race.date)}: {this.props.race.classes}
    </div>;
  }
}
