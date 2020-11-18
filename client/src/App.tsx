import React from 'react';
// import ReactDOM from "react-dom";
import {observer} from "mobx-react";
import {observable, action, isObservable, runInAction, makeObservable} from "mobx";
import './App.css';

class AppMachine
{
  @observable public tracksList: string[] | null = null;

  @observable public isLoaded = false;

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
    console.log(tracksRaw);
    const tracks = await tracksRaw.json();
    console.log(tracks)
    this.setTracksList(tracks.message);
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

    console.log(isObservable(this.machine.tracksList))

    runInAction(() => this.machine.isLoaded = true);
  }

  render()
  {
    // if (this.machine.tracksList == null)
    // {
    //   return <></>;
    // }

    if (!this.machine.isLoaded)
    {
      return <>Not Loaded</>
    }

    return (
      <div className="App">
        <header className="App-header">
          {
            this.machine.tracksList == null ? "NULL" : this.machine.tracksList
          }
          {
            this.machine.tracksList != null && 
            this.machine.tracksList.map((track: string) => {
              return <div>{track}</div>;
            })
          }
        </header>
      </div>
    );
  }

}

export default App;
