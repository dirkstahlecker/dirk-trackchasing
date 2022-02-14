import React from 'react';
import {observer} from "mobx-react";
import {observable, action, makeObservable} from "mobx";
import { Track } from '../Types';
import './TrackTile.css'; // Tell webpack that Button.js uses these styles
import { Link } from 'react-router-dom';

export interface TrackTileProps
{
  track: Track;
}

@observer
export class TrackTile extends React.Component<TrackTileProps>
{
  render()
  {
    const track = this.props.track;

    return (
      <div className={"track-tile"}>
        <Link to={`/track/${track.track_id}`}>{track.name}</Link>
      </div>
    );
  }
}
