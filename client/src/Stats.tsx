import React from 'react';
import {observer} from "mobx-react";
import {observable, action, makeObservable} from "mobx";
import { BasicStats, StateStats, Track } from './Types';
import { TrackInfoMachine } from './tracks/TrackInfoMachine';

// class StatsObj
// {
//   public totalRaces: number;
//   public totalFacilities: number;
//   public countableTracks: number;
//   public totalStates: number;
//   public pavedTracks: number;
//   public dirtTracks: number;
//   public mixedTracks: number;

//   constructor(totalRaces: number, totalFacilities: number, countableTracks: number, totalStates: number, 
//     pavedTracks: number, dirtTracks: number, mixedTracks: number)
//   {
//     this.totalRaces = totalRaces;
//     this.totalFacilities = totalFacilities;
//     this.countableTracks = countableTracks;
//     this.totalStates = totalStates;
//     this.pavedTracks = pavedTracks;
//     this.dirtTracks = dirtTracks;
//     this.mixedTracks = mixedTracks; 
//   }

//   static fromJson()
//   {

//   }
// }

export class StatsMachine
{
  @observable basicStats: BasicStats | null = null;

  constructor()
  {
    makeObservable(this);
  }

  public async fetchStats()
  {
    const statsRaw = await fetch('/basicStats');
    this.basicStats = await statsRaw.json();

    const racesPerYear2021Raw = await fetch(`/races/perYear/2021`);
    const racesPerYear2021 = await racesPerYear2021Raw.json();
    console.log(racesPerYear2021);
  }
}

export interface StatsProps
{
  machine: StatsMachine;
  trackInfoMachine: TrackInfoMachine;
}

@observer
export class Stats extends React.Component<StatsProps>
{
  componentDidMount()
  {
    this.props.machine.fetchStats();
  }

  private get machine(): StatsMachine
  {
    return this.props.machine;
  }

  render()
  {
    return <div className="recaps-place" style={{height: "100%"}}>
      <h2>Stats</h2>
      {
        this.machine.basicStats != null &&
        <>
          Total Races: {this.machine.basicStats.total_races}
          <br/>
          Total Facilities: {this.machine.basicStats.total_facilities}
          <br/>
          Countable Tracks: {this.machine.basicStats.countable_tracks}
          <br/>
          Total Days: {this.machine.basicStats.total_days}
          <br/>
          New Tracks in 2021: {this.props.trackInfoMachine.getNewTracksInYear(2021).map((t: Track) => {
            return <>{t.name}, </>;
          })}
          <br/>
          Races in 2021: 
          <br/>
          <br/>
          States: <table><tbody>
            <tr>
              <td>State</td>
              <td>Facilities</td>
              <td>Configurations</td>
            </tr>
            {this.machine.basicStats.states.map((state: StateStats) => {
              return <tr>
                <td>{state.state}</td>
                <td>{state.facilities}</td>
                <td>{state.configs}</td>
              </tr>
            })}
          </tbody></table>
        </>
      }
    </div>;
  }
}
