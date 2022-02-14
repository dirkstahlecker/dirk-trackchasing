import React from 'react';
// import ReactDOM from "react-dom";
import {observer} from "mobx-react";
// import {observable, action, makeObservable} from "mobx";
import './App.css';
import {TrackPlace, TrackPlaceMachine} from "./tracks/TrackPlace";
import {TrackInfoMachine} from "./tracks/TrackInfoMachine";
import { Track_old } from './Types';
import {Map, MapMachine} from "./Map";
import {NavigationMachine, CurrentPlace} from "./NavigationMachine";
import {TrackTile} from './tracks/TrackTile';
import {AboutPlace} from "./AboutPlace";
import { EventPlace, EventPlaceMachine } from './events/EventPlace';
import { ContactPlace } from './ContactPlace';
import { AllTracksPlace } from './tracks/AllTracks';
import { CalendarPlace } from './CalendarPlace';
import { RecapsPlace, RecapsPlaceMachine } from './RecapsPlace';
import {Stats, StatsMachine} from "./Stats";
import {Routes, Route, Link} from "react-router-dom";
import { isThisTypeNode } from 'typescript';

class AppMachine
{
  public trackInfoMachine: TrackInfoMachine;
  public navMachine: NavigationMachine = new NavigationMachine();
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

  private get navMachine(): NavigationMachine
  {
    return this.machine.navMachine;
  }

  private renderAbout(): any
  {
    return <AboutPlace navMachine={this.machine.navMachine}/>;
  }

  private renderHome(): React.ReactNode
  {
    return <div>
      <h1>Dirk Stahlecker - Trackchaser</h1>
      {/* <button onClick={() => this.machine.test()}>TEST</button> */}
      {
        this.machine.trackInfoMachine.tracks != null && 
        <div>
          <Map
            trackInfoMachine={this.machine.trackInfoMachine}
            machine={this.machine.mapMachine}
            navMachine={this.machine.navMachine}
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
    return <ContactPlace navMachine={this.navMachine}/>;
  }

  private renderStats(): JSX.Element
  {
    return <Stats machine={this.machine.statsMachine} trackInfoMachine={this.machine.trackInfoMachine}/>;
  }

  private renderAllTracks(): JSX.Element
  {
    return <AllTracksPlace 
      navMachine={this.navMachine}
      trackInfoMachine={this.machine.trackInfoMachine}
    />;
  }
  
  private renderRecaps(): JSX.Element
  {
    return <RecapsPlace
      machine={new RecapsPlaceMachine()}
      navMachine={this.navMachine}
    />;
  }

  private renderCalendar(): JSX.Element
  {
    return <CalendarPlace
      navMachine={this.navMachine}
    />;
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

  private renderToolbar(): JSX.Element
  {
    return <div id="navbar" className="sticky">
      <Link to="/">HOME</Link>
      <Link to="/about">ABOUT</Link>
      <a onClick={this.navMachine.goToAllTracksPage}>Tracks</a>
      {/* <a onClick={this.navMachine.goToCalendar}>Calendar</a> */}
      <a onClick={this.navMachine.goToRecapsPage}>Race Recaps</a>
      <a onClick={this.navMachine.goToStatsPage}>Stats</a>
      <a onClick={this.navMachine.goToAboutPage}>About</a>
      <a onClick={this.navMachine.goToContactPage}>Contact</a>
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

    fetch("/races/uniqueEvents");
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
          </Routes>

          {/* {
            this.machine.navMachine.currentPlace === CurrentPlace.ABOUT &&
            this.renderAbout()
          }
          {
            this.machine.navMachine.currentPlace === CurrentPlace.HOME &&
            this.renderHome()
          }
          {
            this.machine.navMachine.currentPlace === CurrentPlace.ALL_TRACKS &&
            this.renderAllTracks()
          }
          {
            this.machine.navMachine.currentPlace === CurrentPlace.CALENDAR &&
            this.renderCalendar()
          }
          {
            this.machine.navMachine.currentPlace === CurrentPlace.RECAPS &&
            this.renderRecaps()
          }
          {
            this.machine.navMachine.currentPlace === CurrentPlace.TRACK &&
            this.renderTrack()
          }
          {
            this.machine.navMachine.currentPlace === CurrentPlace.EVENT &&
            this.renderEvent()
          }
          {
            this.machine.navMachine.currentPlace === CurrentPlace.STATS &&
            this.renderStats()
          }
          {
            this.machine.navMachine.currentPlace === CurrentPlace.CONTACT &&
            this.renderContact()
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

function Home(machine: AppMachine): JSX.Element
{
  return <>
    <h1>Dirk Stahlecker - Trackchaser</h1>
    {
      machine.trackInfoMachine.tracks != null && 
      <div>
        <Map
          trackInfoMachine={machine.trackInfoMachine}
          machine={machine.mapMachine}
          navMachine={machine.navMachine}
        />
      </div>
    }
  </>
}