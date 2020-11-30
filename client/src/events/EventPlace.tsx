import React from 'react';
import {observer} from "mobx-react";
import {observable, action, makeObservable, runInAction} from "mobx";

export class EventPlaceMachine
{

}

export interface EventPlaceProps
{
  machine: EventPlaceMachine;
}

@observer
export class EventPlace extends React.Component<EventPlaceProps>
{
  render()
  {
    return <>Event Place</>;
  }
}
