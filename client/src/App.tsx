import React from 'react';
// import ReactDOM from "react-dom";
import {observer} from "mobx-react";
import {observable, action, makeObservable} from "mobx";
import './App.css';

class AppMachine
{
  @observable public tracksList: string[] | null = null;

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
    const tracksRaw = await fetch("/tracksList");
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

  componentDidMount()
  {
    this.machine.makeTracks();
  }

  render()
  {
    return (
      <div className="App">
        <header className="App-header">
          {
            this.machine.tracksList != null && 
            this.machine.tracksList.map((track: string) => {
              return <div key={track}>
                <button onClick={() => this.machine.getRaceNum(track)}>{track}</button>
              </div>;
            })
          }
        </header>
      </div>
    );
  }
}

export default App;
