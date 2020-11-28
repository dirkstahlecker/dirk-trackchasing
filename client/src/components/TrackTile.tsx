import React from 'react';
import {observer} from "mobx-react";
import {observable, action, makeObservable} from "mobx";
import { Track } from '../TrackInfoMachine';
import { NavigationMachine } from '../NavigationMachine';

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
      <div key={track.name}>
        <button onClick={() => this.props.navMachine.goToTrackPage(track)}>
          {track.name}
        </button>
      </div>
    );
  }
}
