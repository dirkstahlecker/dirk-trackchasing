import React from 'react';
// import ReactDOM from "react-dom";
import {observer} from "mobx-react";
// import {observable, action, makeObservable} from "mobx";
import './App.css';
import {TrackPlace, TrackPlaceMachine} from "./tracks/TrackPlace";
import {TrackInfoMachine} from "./tracks/TrackInfoMachine";
import { Track } from './Types';
import {Map, MapMachine} from "./Map";
import {NavigationMachine, CurrentPlace} from "./NavigationMachine";
import {TrackTile} from './tracks/TrackTile';
import {AboutPlace} from "./AboutPlace";
import { EventPlace, EventPlaceMachine } from './events/EventPlace';

// class QuickStats
// {
//   public totalRaces: number;
//   public totalFacilities: number;
//   public totalCountableTracks: number;
//   public totalStates: number;

//   constructor(totalRaces: number, totalFacilities: number, totalCountableTracks: number, totalStates: number)
//   {
//     this.totalRaces = totalRaces;
//     this.totalFacilities = totalFacilities;
//     this.totalCountableTracks = totalCountableTracks;
//     this.totalStates = totalStates;
//   }

//   static fromJson(json: any): QuickStats
//   {
//     return new QuickStats(json["totalRaces"], json["totalFacilities"], json["totalCountableTracks"], 
//       json["totalStates"]);
//   }
// }

class AppMachine
{
  public trackInfoMachine: TrackInfoMachine;
  public navMachine: NavigationMachine = new NavigationMachine();
  public mapMachine: MapMachine = new MapMachine();
  
  // @observable public quickStats: QuickStats | null = null;

  constructor() 
  {
    // makeObservable(this);
    this.trackInfoMachine = new TrackInfoMachine();
    this.trackInfoMachine.fetchInfo();
  }

  // public async fetchQuickStats(): Promise<void>
  // {
  //   const statsRaw = await fetch('/quickStats');
  //   const stats = await statsRaw.json();
  //   // this.quickStats = QuickStats.fromJson(stats);
  // }

  public async test(): Promise<void>
  {
    const testInfo = await fetch("/recaps");
    const infos = await testInfo.json();
    
    console.log(infos);
  }
}

// { process.env.NODE_ENV === 'production' ?
//   <p>
//     This is a production build from create-react-app.
//   </p>
// : <p>
//     Edit <code>src/App.js</code> and save to reload.
//   </p>
// }

export interface AppProps
{

}

@observer
class App extends React.Component<AppProps>
{
  private machine: AppMachine;

  constructor(props: AppProps)
  {
    super(props);
    this.machine = new AppMachine();
  }

  componentDidMount()
  {
    // this.machine.fetchQuickStats(); //no need to await
  }

  private get navMachine(): NavigationMachine
  {
    return this.machine.navMachine;
  }

  private renderAbout(): JSX.Element
  {
    return <AboutPlace navMachine={this.machine.navMachine}/>;
  }

  private renderHome(): JSX.Element
  {
    return <>
      <h1>Dirk Stahlecker - Trackchaser</h1>
      <div>
        <button onClick={() => this.machine.navMachine.goToAboutPage()}>About</button>
      </div>
      <br/>
      <button onClick={() => this.machine.test()}>TEST</button>
      {
        this.machine.trackInfoMachine.tracks != null && 
        <div>
          <Map
            trackInfoMachine={this.machine.trackInfoMachine}
            machine={this.machine.mapMachine}
            navMachine={this.machine.navMachine}
          />
          <div className="quick-stats-area">
            Quick Stats: 
          </div>
          {
            this.machine.trackInfoMachine.tracks.map((track: Track) => {
              return <TrackTile
                key={track.print()}
                track={track}
                navMachine={this.machine.navMachine}
              />;
            })
          }
        </div>
      }
    </>
  }

  private renderTrack(): JSX.Element
  {
    return <TrackPlace
      machine={new TrackPlaceMachine() /* TODO: look at this */}
      trackInfo={this.machine.trackInfoMachine}
      navMachine={this.machine.navMachine}
    />;
  }

  private renderEvent(): JSX.Element
  {
    if (this.navMachine.currentEvent == null || this.navMachine.currentTrack == null)
    {
      throw new Error("To render event page, currentEvent and currentTrack must be defined");
    }

    return <EventPlace
      machine={new EventPlaceMachine()}
      navMachine={this.navMachine}
      event={this.machine.navMachine.currentEvent!}
      track={this.machine.navMachine.currentTrack!}
    />;
  }

  private renderFooter(): JSX.Element
  {
    return <>
      Contact: <a href="mailto:TrackchaserDirk@gmail.com">TrackchaserDirk@gmail.com</a>
      &nbsp;&nbsp;&nbsp;
      Site copyright Dirk Stahlecker &#169; {new Date().getFullYear()}
    </>;
  }

  render()
  {
    return (
      <div className="App">
        <div className="App-body">
          {
            this.machine.navMachine.currentPlace === CurrentPlace.ABOUT &&
            this.renderAbout()
          }
          {
            this.machine.navMachine.currentPlace === CurrentPlace.HOME &&
            this.renderHome()
          }
          {
            this.machine.navMachine.currentPlace === CurrentPlace.TRACK &&
            this.renderTrack()
          }
          {
            this.machine.navMachine.currentPlace === CurrentPlace.EVENT &&
            this.renderEvent()
          }
        </div>
        <div className="footer">
          {this.renderFooter()}
        </div>
      </div>
    );
  }
}

export default App;

//TODO: trackchaserDirk email doesn't forward to me properly
//TODO: events don't work when there's no date (like with Pocatello)