import React from 'react';
// import ReactDOM from "react-dom";
import {observer} from "mobx-react";
import {observable, action, makeObservable} from "mobx";
import {NavigationMachine} from "./NavigationMachine";

export class TrackPlaceMachine
{

}

export interface TrackPlaceProps
{
	trackName: string;
	navMachine: NavigationMachine;
}

@observer
export class TrackPlace extends React.Component<TrackPlaceProps>
{
	render()
	{
		return (
			<div id="track-place">
				<button onClick={() => this.props.navMachine.goHome()}>Go Home</button>
				{this.props.trackName}
			</div>
		);
	}
}
