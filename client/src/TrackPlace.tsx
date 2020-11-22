import React from 'react';
// import ReactDOM from "react-dom";
import {observer} from "mobx-react";
import {observable, action, makeObservable, computed} from "mobx";
import {NavigationMachine} from "./NavigationMachine";
import {TrackInfoMachine, Track, Flip} from "./TrackInfoMachine";

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
	private get currentTrack(): Track | null
	{
		return this.props.navMachine.currentTrack;
	}

	render()
	{
		if (this.currentTrack== null)
		{
			return <></>;
		}

		return (
			<div id="track-place">
				<button onClick={() => this.props.navMachine.goHome()}>Go Home</button>
				<br/>
				{this.currentTrack.name}
				<br/>
				Number of Races I've Attended: {this.currentTrack.count}
				<br/>
				Flips: Total Number: {this.currentTrack.flips.length}
				<br/>
				<br/>
				{
					this.currentTrack.flips.map((flip: Flip) => {
						return <img 
							src={TrackInfoMachine.flipGifPath(this.currentTrack!!.name, flip.flipId)}
							key={flip.flipId}
						/>
					})
				}
				
			</div>
		);
	}
}
