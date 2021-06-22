import React from 'react';
import {observer} from "mobx-react";
import {observable, action, makeObservable} from "mobx";
import { NavigationMachine } from '../NavigationMachine';
import { Track, TrackDbObj } from '../Types';
import './TrackTile.css'; // Tell webpack that Button.js uses these styles

export class TrackTileMachine
{

}

export interface TrackTileProps
{
  track: TrackDbObj;
  navMachine: NavigationMachine;
}

@observer
export class TrackTile extends React.Component<TrackTileProps>
{
  render()
  {
    const track = this.props.track;

    return (
      <div className={"track-tile"}>
        <button onClick={() => this.props.navMachine.goToTrackPage(track)}>
          {track.name}
        </button>
      </div>
    );
  }
}
