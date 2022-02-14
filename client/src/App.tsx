import React from 'react';
// import ReactDOM from "react-dom";
import {observer} from "mobx-react";
// import {observable, action, makeObservable} from "mobx";
import './App.css';
import {TrackPlace, TrackPlaceMachine, TrackPlaceProps} from "./tracks/TrackPlace";
import {TrackInfoMachine} from "./tracks/TrackInfoMachine";
import {Map, MapMachine} from "./Map";
import {TrackTile} from './tracks/TrackTile';
import {AboutPlace} from "./AboutPlace";
import { EventPlace, EventPlaceMachine } from './events/EventPlace';
import { ContactPlace } from './ContactPlace';
import { AllTracksPlace } from './tracks/AllTracks';
import { CalendarPlace } from './CalendarPlace';
import { RecapsPlace, RecapsPlaceMachine } from './RecapsPlace';
import {Stats, StatsMachine} from "./Stats";
import {Routes, Route, Link, BrowserRouter, useParams} from "react-router-dom";

class AppMachine
{
  public trackInfoMachine: TrackInfoMachine;
  public mapMachine: MapMachine = new MapMachine();
  public statsMachine: StatsMachine = new StatsMachine();
  
  // @observable public quickStats: QuickStats | null = null;

  constructor() 
  {
    // makeObservable(this);
    this.trackInfoMachine = new TrackInfoMachine();
    this.trackInfoMachine.fetchAllTracks();
  }

  // public async fetchQuickStats(): Promise<void>
  // {
  //   const statsRaw = await fetch('/quickStats');
  //   const stats = await statsRaw.json();
  //   // this.quickStats = QuickStats.fromJson(stats);
  // }
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

  private renderAbout(): any
  {
    return <AboutPlace/>;
  }

  private renderHome(): React.ReactNode
  {
    return <div>
      <h1>Dirk Stahlecker - Trackchaser</h1>
      {
        this.machine.trackInfoMachine.tracks != null && 
        <div>
          <Map
            trackInfoMachine={this.machine.trackInfoMachine}
            machine={this.machine.mapMachine}
          />
          {/* <div className="quick-stats-area">
            Quick Stats: 
          </div> */}
        </div>
      }
    </div>
  }

  private renderContact(): JSX.Element
  {
    return <ContactPlace/>;
  }

  private renderStats(): JSX.Element
  {
    return <Stats machine={this.machine.statsMachine} trackInfoMachine={this.machine.trackInfoMachine}/>;
  }

  private renderAllTracks(): JSX.Element
  {
    return <AllTracksPlace 
      trackInfoMachine={this.machine.trackInfoMachine}
    />;
  }
  
  private renderRecaps(): JSX.Element
  {
    return <RecapsPlace
      machine={new RecapsPlaceMachine()}
    />;
  }

  private renderCalendar(): JSX.Element
  {
    return <CalendarPlace
    />;
  }

  private renderEvent(): JSX.Element
  {
    return <></>;
    //TODO: fix
    // if (this.navMachine.currentEvent == null || this.navMachine.currentTrack == null)
    // {
    //   throw new Error("To render event page, currentEvent and currentTrack must be defined");
    // }

    // return <EventPlace
    //   machine={new EventPlaceMachine()}
    //   event={this.machine.navMachine.currentEvent!}
    //   track={this.machine.navMachine.currentTrack!}
    // />;
  }

  private renderFooter(): JSX.Element
  {
    return <>
      Contact: <a href="mailto:TrackchaserDirk@gmail.com">TrackchaserDirk@gmail.com</a>
      &nbsp;&nbsp;&nbsp;
      Site copyright Dirk Stahlecker &#169; {new Date().getFullYear()}
    </>;
  }

  private renderToolbar(): JSX.Element
  {
    return <div id="navbar" className="sticky">
      <Link to="/">Home</Link>
      <Link to="/tracks">Tracks</Link>
      <Link to="/recaps">Race Recaps</Link>
      <Link to="/stats">Stats</Link>
      <Link to="/about">About</Link>
      <Link to="/contact">Contact</Link>
      {/* <a onClick={this.navMachine.goToCalendar}>Calendar</a> */}
    </div>
  }

  componentDidMount()
  {
    //Necessary for the toolbar, copied from https://www.w3schools.com/howto/howto_js_navbar_sticky.asp
    window.onscroll = () => myFunction();
    let navbar = document.getElementById("navbar");
    let sticky = navbar!!.offsetTop;

    function myFunction() {
      // if (window.pageYOffset >= sticky) {
      //   navbar!!.classList.add("sticky")
      // } else {
      //   navbar!!.classList.remove("sticky");
      // }
    }

    // fetch("/races/uniqueEvents"); //why was this here?
  }

  render()
  {
    return (
      <div className="App">

        {this.renderToolbar()}
        <div className="App-body">
          <Routes>
            <Route path="/" element={this.renderHome()}/>
            <Route path="/about" element={this.renderAbout()}/>
            <Route path="/tracks" element={this.renderAllTracks()}/>
            <Route path="/track/:id" element={<RenderTrack trackInfoMachine={this.machine.trackInfoMachine}/>}/>
            <Route path="/recaps" element={this.renderRecaps()}/>
            <Route path="/stats" element={this.renderStats()}/>
            <Route path="/contact" element={this.renderContact()}/>
            {/* TODO: individual track, event */}
          </Routes>

          {/*
          {
            this.machine.navMachine.currentPlace === CurrentPlace.EVENT &&
            this.renderEvent()
          } */}
        </div>
        <div className="footer">
          {this.renderFooter()}
        </div>
      </div>
    );
  }
}

export default App;

//TODO: events don't work when there's no date (like with Pocatello)
//TODO: I think heroku think's it's running as a test so it shows the wrong recap
//TODO: event dates still are time zone dependent (see on events page)
//TODO: URLs in navigation machine

//TODO: need to have configurations on track page, or some other way to get to the configuration track page

interface RenderTrackProps {
  trackInfoMachine: TrackInfoMachine;
}
const RenderTrack = (props: RenderTrackProps): JSX.Element => {
  const { id } = useParams();
  if (!id)
  {
    throw Error("Invalid track URL")
  }
  const parsedId: number = Number.parseInt(id);

  return <TrackPlace
    machine={new TrackPlaceMachine() /* TODO: look at this */}
    trackInfo={props.trackInfoMachine}
    trackId={parsedId}
  />;
}
