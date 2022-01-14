import React from 'react';
import {observer} from "mobx-react";
import {observable, action, makeObservable, computed, runInAction} from "mobx";
import {NavigationMachine} from "../NavigationMachine";
import {TrackInfoMachine} from "./TrackInfoMachine";
import { RaceTile } from '../events/RaceTile';
import { Flip, EventObj, Track_old, TrackName, Track, Race } from '../Types';
import { API } from '../API';

export class TrackPlaceMachine
{
	@observable
	public races: Race[] = [];

	@observable
	public flips: Flip[] = [];

	constructor()
	{
		makeObservable(this);
	}

	@action
	public async fetchAllRaces(trackId: number): Promise<void>
	{
		this.races = await API.fetchAllRaces(trackId);
	}

	@action
	public async fetchAllFlips(trackId: number): Promise<void>
	{
		this.flips = await API.fetchAllFlips(trackId);
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
	private get machine(): TrackPlaceMachine
	{
		return this.props.machine;
	}

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
		this.props.machine.fetchAllRaces(this.currentTrack.track_id);
		this.props.machine.fetchAllFlips(this.currentTrack.track_id);
	}

	private renderEventTiles(): JSX.Element
	{
		//TODO: combine events with multiple configurations

		return <>
			<table>
			{this.props.machine.races.map((race: Race) => (
				// <button onClick={() => this.props.navMachine.goToEventPage(this.currentTrack, event)}>
					<RaceTile
						key={race.race_id}
						race={race}
					/>
				// </button>
			))}
			</table>
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
				{/* <button onClick={this.props.navMachine.goHome}>Go Home</button> */}
				<br/>
				<h2>
					{this.currentTrack.name}
				</h2>
				{this.currentTrack.city}, {this.currentTrack.state}
				<br/>
				{
					this.currentTrack.length !== null && 
					<>Length: {this.currentTrack.length}<br/></>
				}
				Type: {this.currentTrack.type}
				<br/>
				Total Races: {this.props.machine.races.length}
				<br/>
				Flips: {this.props.machine.flips.length}
				<br/>
				Flips per Event: {this.machine.flips.length > 0 ? 
					this.machine.flips.length / this.machine.races.length : 
					"0"
				}

				<br/>
				Events: {this.renderEventTiles()}
				
			</div>
		);
	}
}
