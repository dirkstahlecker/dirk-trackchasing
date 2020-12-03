import React from 'react';
import {observer} from "mobx-react";
import {observable, action, makeObservable, runInAction} from "mobx";
import { EventObj } from './EventObj';

export class EventPlaceMachine
{

}

export interface EventPlaceProps
{
  machine: EventPlaceMachine;
  event: EventObj;
}

@observer
export class EventPlace extends React.Component<EventPlaceProps>
{
  render()
  {
    return <div className="event-place">
      {this.props.event.date}: {this.props.event.classes}
    </div>;
  }
}
