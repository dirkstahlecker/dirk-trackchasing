import React from 'react';
import {observer} from "mobx-react";
import {observable, action, makeObservable} from "mobx";

class StatsObj
{
  public totalRaces: number;
  public totalFacilities: number;
  public countableTracks: number;
  public totalStates: number;
  public pavedTracks: number;
  public dirtTracks: number;
  public mixedTracks: number;

  constructor(totalRaces: number, totalFacilities: number, countableTracks: number, totalStates: number, 
    pavedTracks: number, dirtTracks: number, mixedTracks: number)
  {
    this.totalRaces = totalRaces;
    this.totalFacilities = totalFacilities;
    this.countableTracks = countableTracks;
    this.totalStates = totalStates;
    this.pavedTracks = pavedTracks;
    this.dirtTracks = dirtTracks;
    this.mixedTracks = mixedTracks; 
  }

  static fromJson()
  {

  }
}

export class StatsMachine
{

  constructor()
  {
    makeObservable(this);
  }

  public async fetchStats()
  {
    const statsRaw = await fetch('/stats');
    const stats = await statsRaw.json();
  }
}

export interface StatsProps
{

}

@observer
export class Stats extends React.Component<StatsProps>
{
  render()
  {
    return <></>;
  }
}
