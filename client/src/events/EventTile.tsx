import React from 'react';
import {observer} from "mobx-react";
import {observable, action, makeObservable, runInAction} from "mobx";
import { EventObj, Track, Flip } from '../Types';

export interface EventTileProps
{
  event: EventObj;
}

@observer
export class EventTile extends React.Component<EventTileProps>
{
  render()
  {
    return <div className="event-place">
      {this.props.event.date.toString()}: {this.props.event.classes}
    </div>;
  }
}
