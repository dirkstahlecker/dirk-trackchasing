import React from 'react';
import {observer} from "mobx-react";
import {observable, action, makeObservable, runInAction} from "mobx";
import { BasicStats, StateStats, Track } from './Types';
import { TrackInfoMachine } from './tracks/TrackInfoMachine';
import { networkInterfaces } from 'os';

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
  @observable racesCurrentYear: number | null = null;

  constructor()
  {
    makeObservable(this);
  }

  public async fetchStats()
  {
    const statsRaw = await fetch('/basicStats');
    this.basicStats = await statsRaw.json();

    const currentYear = 2016 //new Date().getFullYear();
    const racesPerYearRaw = await fetch(`/races/perYear/${currentYear}`);
    const racesPerYear = await racesPerYearRaw.json();
    console.log(racesPerYear);
    runInAction(() => this.racesCurrentYear = racesPerYear);
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
    const currentYear: number = new Date().getFullYear();
    const newTracksInYear: Track[] = this.props.trackInfoMachine.getNewTracksInYear(currentYear);
    let newTracksInYearSection: JSX.Element;
    if (newTracksInYear.length === 0)
    {
      newTracksInYearSection = <>None</>;
    }
    else
    {
      newTracksInYearSection = <>
        {newTracksInYear.map((t: Track) => {
          return <>{t.name}, </>;
        })}
      </>;
    }

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
          New Tracks in {currentYear}: {newTracksInYearSection}
          
          <br/>
          Races in {currentYear}: {this.props.machine.racesCurrentYear}
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
