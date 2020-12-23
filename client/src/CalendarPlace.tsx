import React from 'react';
import {observer} from "mobx-react";
import {observable, action, makeObservable} from "mobx";
import { NavigationMachine } from './NavigationMachine';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarPlace.css';

export interface CalendarPlaceProps
{
  navMachine: NavigationMachine;
}

@observer
export class CalendarPlace extends React.Component<CalendarPlaceProps>
{
  render()
  {
    const localizer = momentLocalizer(moment)
    const events: any = [];

    return <div className="contact-place" style={{height: "100%"}}>
      <button onClick={this.props.navMachine.goHome}>Go Home</button>
      <div className="calendar-wrapper">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
        />
      </div>
    </div>;
  }
}

