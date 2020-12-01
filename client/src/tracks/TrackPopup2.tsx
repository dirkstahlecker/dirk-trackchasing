import { Popup } from "react-mapbox-gl";
import React from 'react';
import {observer} from "mobx-react";
import {observable, action, makeObservable, runInAction} from "mobx";
import { Track } from "./TrackInfoMachine";

export interface TrackPopup2Props
{
  track: Track;
}

@observer
export class TrackPopup2 extends React.Component<TrackPopup2Props>
{
  render()
  {
    const track = this.props.track;
    return (
      <Popup
        key={track.name}
        coordinates={track.coordinates}
        
      >
        {track.name}
      </Popup>
    )
  }
}
