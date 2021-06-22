import React from 'react';
import {observer} from "mobx-react";
import {observable, action, makeObservable, runInAction} from "mobx";
import { EventObj, Track_old, Flip, Race } from '../Types';

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
      {this.props.race.date}: {this.props.race.classes}
    </div>;
  }
}
