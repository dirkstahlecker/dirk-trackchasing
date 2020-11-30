import React from 'react';
import {observer} from "mobx-react";
import {observable, action, makeObservable} from "mobx";
import { Track } from '../tracks/TrackInfoMachine';
import { NavigationMachine } from '../NavigationMachine';
import './TrackTile.css'; // Tell webpack that Button.js uses these styles

export class TrackTileMachine
{

}

export interface TrackTileProps
{
  track: Track;
  navMachine: NavigationMachine;
}

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
