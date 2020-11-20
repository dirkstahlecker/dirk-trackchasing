import React from 'react';
// import ReactDOM from "react-dom";
import {observer} from "mobx-react";
import {observable, action, makeObservable} from "mobx";
import './App.css';
import {TrackPlace} from "./TrackPlace";
import {Map} from "./Map";
import {NavigationMachine, CurrentPlace} from "./NavigationMachine";

class AppMachine
{
  @observable public tracksList: string[] | null = null;

  public navMachine: NavigationMachine = new NavigationMachine();

  constructor() 
  {
    makeObservable(this);
  }

  @action
  private setTracksList(list: string[]): void
  {
    this.tracksList = list;
  }

  public async makeTracks(): Promise<void>
  {
    const tracksRaw = await fetch("/tracks");
    const tracks = await tracksRaw.json();
    this.setTracksList(tracks.message);
  }

  public async getRaceNum(trackName: string): Promise<void>
  {
    const numRaw = await fetch("/numRaces/" + trackName);
    const num = await numRaw.json();
    alert(num.message);
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
  private machine: AppMachine = new AppMachine();

  // constructor(props: AppProps)
  // {
  //   super(props);
  //   this.mapContainer = React.createRef();
  // }

  componentDidMount()
  {
    this.machine.makeTracks();

    fetch("/tracks/info");
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
                this.machine.tracksList != null && 
                this.machine.tracksList.map((track: string) => {
                  return <div key={track}>
                    <button onClick={() => this.machine.navMachine.goToTrackPage(track)}>{track}</button>
                  </div>;
                })
              }
            </>
          }
          {
            this.machine.navMachine.currentPlace === CurrentPlace.TRACK &&
            <TrackPlace 
              trackName={this.machine.navMachine.currentTrackName!!}
              navMachine={this.machine.navMachine}
            />
          }
          {
            this.machine.navMachine.currentPlace === CurrentPlace.MAP &&
            <Map
              navMachine={this.machine.navMachine}
            />
          }
        </header>
      </div>
    );
  }
}

export default App;
