import React from 'react';
// import ReactDOM from "react-dom";
import {observer} from "mobx-react";
import {observable, action, makeObservable, computed} from "mobx";
import {NavigationMachine} from "../NavigationMachine";
import {TrackInfoMachine, Track, Flip} from "./TrackInfoMachine";
import { trackDerivedFunction } from 'mobx/dist/internal';
import { AssertionError } from 'assert';
import { EventPlace, EventPlaceMachine } from '../events/EventPlace';

export class TrackPlaceMachine
{
	@observable
	public events = [];

	constructor()
	{
		makeObservable(this);
	}

	@action
	public async fetchEvents(trackName: string): Promise<void>
	{
		const eventsRaw = await fetch('/tracks/' + trackName + "/events");
		this.events = await eventsRaw.json();
	}
}

export interface TrackPlaceProps
{
	machine: TrackPlaceMachine;
	trackInfo: TrackInfoMachine;
	navMachine: NavigationMachine;
}

@observer
export class TrackPlace extends React.Component<TrackPlaceProps>
{
	private get currentTrack(): Track
	{
		const currentTrack: Track | null = this.props.navMachine.currentTrack;
		if (currentTrack != null)
		{
			return currentTrack
		}
		throw Error("current track is null");
	}

	componentDidMount()
	{
		this.props.machine.fetchEvents(this.currentTrack.name);
	}

	private renderEvents(): JSX.Element
	{
		const events: string[] = [];
		this.props.machine.events.forEach((event: string) => {
			events.push(event);
		});

		return <>
			{events.map((event: string) => (
				<EventPlace
					key={event}
					eventInfo={event}
					machine={new EventPlaceMachine()}
				/>
			))}
		</>;
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
				<br/>
				Events: {this.renderEvents()}
				
			</div>
		);
	}
}
