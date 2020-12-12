import React from 'react';
// import ReactDOM from "react-dom";
import {observer} from "mobx-react";
import {observable, action, makeObservable} from "mobx";
import './App.css';
import {TrackPlace, TrackPlaceMachine} from "./tracks/TrackPlace";
import {TrackInfoMachine, Track} from "./tracks/TrackInfoMachine";
import {Map, MapMachine} from "./Map";
import {NavigationMachine, CurrentPlace} from "./NavigationMachine";
import {TrackTile} from './components/TrackTile';

class QuickStats
{
  public totalRaces: number;
  public totalFacilities: number;
  public totalCountableTracks: number;
  public totalStates: number;

  constructor(totalRaces: number, totalFacilities: number, totalCountableTracks: number, totalStates: number)
  {
    this.totalRaces = totalRaces;
    this.totalFacilities = totalFacilities;
    this.totalCountableTracks = totalCountableTracks;
    this.totalStates = totalStates;
  }

  static fromJson(json: any): QuickStats
  {
    return new QuickStats(json["totalRaces"], json["totalFacilities"], json["totalCountableTracks"], 
      json["totalStates"]);
  }
}

class AppMachine
{
  public trackInfoMachine: TrackInfoMachine;
  public navMachine: NavigationMachine = new NavigationMachine();
  public mapMachine: MapMachine = new MapMachine();
  
  @observable public quickStats: QuickStats | null = null;

  constructor() 
  {
    makeObservable(this);
    this.trackInfoMachine = new TrackInfoMachine();
    this.trackInfoMachine.fetchInfo();
  }

  public async fetchQuickStats(): Promise<void>
  {
    const statsRaw = await fetch('/quickStats');
    const stats = await statsRaw.json();
    this.quickStats = QuickStats.fromJson(stats);
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
    this.machine.fetchQuickStats(); //no need to await
  }

  render()
  {
    return (
      <div className="App">
        <div className="App-body">
          {
            this.machine.navMachine.currentPlace === CurrentPlace.HOME &&
            <>
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
                        key={track.name}
                        track={track}
                        navMachine={this.machine.navMachine}
                      />;
                    })
                  }
                </div>
              }
            </>
          }
          {
            this.machine.navMachine.currentPlace === CurrentPlace.TRACK &&
            <TrackPlace
              machine={new TrackPlaceMachine() /* TODO: look at this */}
              trackInfo={this.machine.trackInfoMachine}
              navMachine={this.machine.navMachine}
            />
          }
        </div>
        <div className="footer">
          Contact: <a href="mailto:TrackchaserDirk@gmail.com">TrackchaserDirk@gmail.com</a>
          &nbsp;&nbsp;&nbsp;
          Site copyright Dirk Stahlecker &#169; {new Date().getFullYear()}
        </div>
      </div>
    );
  }
}

export default App;

//TODO: trackchaserDirk email doesn't forward to me properly
