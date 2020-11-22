import React from 'react';
// import ReactDOM from "react-dom";
import {observer} from "mobx-react";
import {observable, action, makeObservable, computed} from "mobx";
import {NavigationMachine} from "./NavigationMachine";
import {TrackInfoMachine, Track} from "./TrackInfoMachine";

export class TrackPlaceMachine
{
	constructor()
	{
		makeObservable(this);
	}
}

export interface TrackPlaceProps
{
	trackInfo: TrackInfoMachine;
	navMachine: NavigationMachine;
}

@observer
export class TrackPlace extends React.Component<TrackPlaceProps>
{
	render()
	{
		if (this.props.navMachine.currentTrack == null)
		{
			return <></>;
		}

		return (
			<div id="track-place">
				<button onClick={() => this.props.navMachine.goHome()}>Go Home</button>
				<br/>
				{this.props.navMachine.currentTrack.name}
				<br/>
				Number of Races I've Attended: {this.props.navMachine.currentTrack.count}
			</div>
		);
	}
}
