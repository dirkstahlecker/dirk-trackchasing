import React from 'react';
// import ReactDOM from "react-dom";
import {observer} from "mobx-react";
import {observable, action, makeObservable, computed} from "mobx";
import {NavigationMachine} from "../NavigationMachine";
import {TrackInfoMachine} from "./TrackInfoMachine";
import { trackDerivedFunction } from 'mobx/dist/internal';
import { AssertionError } from 'assert';
import { EventTile, EventTileMachine } from '../events/EventTile';
import { Flip, EventObj, Track, TrackName } from '../Types';

export class TrackPlaceMachine
{
	@observable
	public events: EventObj[] = [];

	constructor()
	{
		makeObservable(this);
	}

	@action
	public async fetchEvents(trackName: TrackName): Promise<void>
	{
		const eventsRaw = await fetch('/eventDetails/' + trackName.print());
		const eventInfos = await eventsRaw.json();
		eventInfos.forEach((eventInfo: any) => {
			this.events.push(EventObj.parseJson(eventInfo));
		})
		// this.events = eventInfos;
		console.log(this.events)
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
		this.props.machine.fetchEvents(this.currentTrack.trackNameObj);
	}

	private renderEvents(): JSX.Element
	{
		return <>
			{this.props.machine.events.map((event: EventObj) => (
				<EventTile
					key={event.date}
					track={this.currentTrack}
					event={event}
					machine={new EventTileMachine()}
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
				{this.currentTrack.trackNameObj.print()}
				<br/>
				Number of Races I've Attended: {this.currentTrack.count}
				<br/>
				Flips: Total Number: {this.currentTrack.flips.length}
				<br/>
				<br/>
				{
					this.currentTrack.flips.map((flip: Flip) => {
						return <img //TODO: this needs work
							src={TrackInfoMachine.flipGifPath(this.currentTrack!!.trackNameObj.print(), flip.flipId)}
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
