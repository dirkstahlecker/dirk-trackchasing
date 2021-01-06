import React from 'react';
import {observer} from "mobx-react";
import {observable, action, makeObservable, computed} from "mobx";
import {NavigationMachine} from "../NavigationMachine";
import {TrackInfoMachine} from "./TrackInfoMachine";
import { EventTile } from '../events/EventTile';
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
				<button onClick={() => this.props.navMachine.goToEventPage(this.currentTrack, event)}>
					<EventTile
						key={event.date.getTime()}
						event={event}
					/>
				</button>
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
				<button onClick={this.props.navMachine.goHome}>Go Home</button>
				<br/>
				{this.currentTrack.trackNameObj.print()}
				<br/>
				Number of Races I've Attended: {this.currentTrack.count}
				<br/>
				Flips: Total Number: {this.currentTrack.flips.length}
				<br/>
				<br/>
				Events: {this.renderEvents()}
				
			</div>
		);
	}
}
