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

class AppMachine
{
  public trackInfoMachine: TrackInfoMachine;
  public navMachine: NavigationMachine = new NavigationMachine();
  public mapMachine: MapMachine = new MapMachine();

  constructor() 
  {
    // makeObservable(this);
    this.trackInfoMachine = new TrackInfoMachine();
    this.trackInfoMachine.fetchInfo();
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

  render()
  {
    return (
      <div className="App">
        <header className="App-header">
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
        </header>
      </div>
    );
  }
}

export default App;
