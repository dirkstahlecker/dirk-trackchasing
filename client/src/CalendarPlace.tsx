import React, { SyntheticEvent } from 'react';
import {observer} from "mobx-react";
import {observable, action, makeObservable} from "mobx";
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarPlace.css';

export interface CalendarPlaceProps
{

}

interface CalendarEvent
{
  title: string,
  start: Date,
  end: Date,
  allDay?: boolean
  resource?: any,
  popup?: boolean,
  tooltipAccessor: string | ((event: Object) => string),
  onSelectEvent: (event: Object, e: SyntheticEvent) => any,
  onDoubleClickEvent: (event: Object, e: SyntheticEvent) => void,
}

@observer
export class CalendarPlace extends React.Component<CalendarPlaceProps>
{
  private get makeEvents(): CalendarEvent[]
  {
    const selectCallback = (event: Object, e: SyntheticEvent): void => {
      console.log("on drill down");
    };

    const d: Date = new Date("12-24-20");
    const e: CalendarEvent = {
      title: "TEST Event", 
      start: d, 
      end: d, 
      allDay: false,
      popup: true,
      tooltipAccessor: "Test Tooltip",
      onSelectEvent: selectCallback,
      onDoubleClickEvent: selectCallback,
    };
    return [e];
  }

  render()
  {
    const localizer = momentLocalizer(moment)
    const events: CalendarEvent[] = [];

    return <div className="contact-place" style={{height: "100%"}}>
      <div className="calendar-wrapper">
        <Calendar
          localizer={localizer}
          events={this.makeEvents}
          startAccessor="start"
          endAccessor="end"
        />
      </div>
    </div>;
  }
}

