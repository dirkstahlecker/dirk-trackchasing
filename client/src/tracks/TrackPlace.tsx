import React from 'react';
import {observer} from "mobx-react";
import {observable, action, makeObservable, computed, runInAction, when} from "mobx";
import {TrackInfoMachine} from "./TrackInfoMachine";
import { RaceTile } from '../events/RaceTile';
import { Flip, EventObj, TrackName, Track, Race } from '../Types';
import { API } from '../API';
import { RecapsDataMachine } from '../RecapsPlace';
import { Link } from 'react-router-dom';

export class TrackPlaceMachine
{
	constructor(private trackId: number, public trackInfoMachine: TrackInfoMachine)
	{
		makeObservable(this);

		this.makeCalls();
	}

	private async makeCalls(): Promise<void>
	{
		const trackId: number | undefined = this.currentTrack?.track_id;
		if (trackId)
		{
			const configs = await API.fetchConfigsForTrack(trackId);
			if (configs.length > 0)
			{
				runInAction(() => this.configs = configs);
			}
		}
	}

	public get currentTrack(): Track | null
	{
		//TODO: need to wait for trackInfoMachine to be populated

		const currentTrack: Track | undefined = this.trackInfoMachine.getTrackFromId(this.trackId);
		if (currentTrack)
		{
			return currentTrack;
		}
		return null;
	}

	@observable
	public races: Race[] = [];

	@observable
	public flips: Flip[] = [];

	@observable
	public configs: Track[] | null = null;

	@action
	public async fetchAllRaces(): Promise<void>
	{
		this.races = await API.fetchAllRaces(this.trackId);
	}

	@action
	public async fetchAllFlips(): Promise<void>
	{
		this.flips = await API.fetchAllFlips(this.trackId);
	}
}

export interface TrackPlaceProps
{
	machine: TrackPlaceMachine;
	// trackInfo: TrackInfoMachine;
	// trackId: number;
}

@observer
export class TrackPlace extends React.Component<TrackPlaceProps>
{	
	constructor(props: TrackPlaceProps)
	{
		super(props);

		// when(() => this.machine.trackInfoMachine.populated,
		// () => this.fetchRecapIfAvailable())
	}

	private get machine(): TrackPlaceMachine
	{
		return this.props.machine;
	}

	componentDidMount()
	{
		//for cold load, need to wait for data to arrive
		when(() => this.machine.trackInfoMachine.populated,
			() => {
				this.machine.fetchAllRaces();
				this.machine.fetchAllFlips();
			}
		)
	}

	private renderEventTiles(): JSX.Element
	{
		//TODO: combine events with multiple configurations

		return <>
			<table>
			{this.machine.races.map((race: Race) => (
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
		if (!this.machine.trackInfoMachine.populated || this.machine.currentTrack== null)
		{
			return <></>;
		}

		const trackName = this.machine.currentTrack.name;
		const recaps: string[] | undefined = RecapsDataMachine.recapDatesForTrack(trackName);
		const hasRecaps = recaps !== undefined && recaps.length > 0;

		return (
			<div id="track-place">
				{/* <button onClick={this.props.navMachine.goHome}>Go Home</button> */}
				<br/>
				<h2>
					{this.machine.currentTrack.name}
				</h2>
				{this.machine.currentTrack.city}, {this.machine.currentTrack.state}
				<br/>
				{
					this.machine.currentTrack.length !== null && 
					<>Length: {this.machine.currentTrack.length}<br/></>
				}
				<br/>
				{
					this.machine.configs &&
					<>
						{`${this.machine.configs.length} additional configuration${this.machine.configs.length > 1 ? "s" : ""}: `}
						{this.machine.configs.map((config: Track) => {
							return <Link to={`/track/${config.track_id}`}>{config.name}</Link>
						})}
					</>
				}

				<br/>
				Type: {this.machine.currentTrack.type}
				<br/>
				Total Races: {this.machine.races.length}
				<br/>
				Flips: {this.machine.flips.length}
				<br/>
				Flips per Event: {this.machine.flips.length > 0 ? 
					this.machine.flips.length / this.machine.races.length : 
					"0"
				}

				<br/>
				Events: {this.renderEventTiles()}

				<br/>
				{
					hasRecaps &&
					<>
						Recaps:{" "}
						{
							recaps.map((date: string) => {
								return RecapsDataMachine.renderLink({trackName, date})
							})
						}
					</>
				}
			</div>
		);
	}
}

//TODO: link to configurations 
