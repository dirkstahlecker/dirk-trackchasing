import React from 'react';
import {observer} from "mobx-react";
import {observable, action, makeObservable} from "mobx";
import { NavigationMachine } from '../NavigationMachine';
import { Track } from '../Types';
import { TrackInfoMachine } from './TrackInfoMachine';
import { TrackTile } from './TrackTile';

export interface AllTracksPlaceProps
{
  navMachine: NavigationMachine;
  trackInfoMachine: TrackInfoMachine;
}

@observer
export class AllTracksPlace extends React.Component<AllTracksPlaceProps>
{
  // private get tracks(): Track[]
  // {
  //   return this.props.trackInfoMachine.tracks;
  // }

  // render()
  // {
  //   return <div className="contact-place">
  //     <button onClick={this.props.navMachine.goHome}>Go Home</button>
  //     {
  //       this.tracks.length > 0 &&
  //       <>
  //         {this.tracks.map((track: Track) => {
  //           return <TrackTile
  //             key={track.print()}
  //             track={track}
  //             navMachine={this.props.navMachine}
  //           />;
  //         })}
  //       </>
  //     }
  //   </div>;
  // }

  render()
  {
    return <div>TODO</div>
  }
}
