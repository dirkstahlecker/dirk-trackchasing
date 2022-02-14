import React from 'react';
// import ReactDOM from "react-dom";
import {observer} from "mobx-react";
import {observable, action, makeObservable, runInAction} from "mobx";
import {TrackInfoMachine} from "./TrackInfoMachine";
import { Track, TrackTypeEnum } from '../Types';
import mapboxgl from 'mapbox-gl';
import ReactMapboxGl, {Layer, Feature, Marker, Popup} from 'react-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import "./TrackPopup.css";
import { API } from '../API';
import { Link } from 'react-router-dom';

export class TrackPopupMachine
{
	@observable public track: Track;
	@observable public configurations: Track[] = [];

	constructor(track: Track)
	{
		makeObservable(this);
		this.track = track;
		if (this.track.parent_track_id === null) //it is not a configuration itself
		{
			this.getConfigurations();
		}
	}

	@action
	private async getConfigurations(): Promise<void>
	{
		this.configurations = await API.fetchConfigsForTrack(this.track.track_id);
	}

	public static getMarkerSrcPathForType(trackType: TrackTypeEnum): string
  {
  	let imageName: string = "";
  	switch (trackType)
  	{
  		case TrackTypeEnum.OVAL:
  			imageName = "oval.png";
  			break;
  		case TrackTypeEnum.ROAD_COURSE:
  			imageName = "road.png";
  			break;
  		case TrackTypeEnum.FIGURE_8:
  			imageName = "figure8.png";
  			break; 
  	}

  	return "assets/" + imageName;
  }
}

export interface TrackPopupProps
{
	machine: TrackPopupMachine;
}

@observer
export class TrackPopup extends React.Component<TrackPopupProps>
{
	render()
	{
		if (this.props.machine.track.parent_track_id !== null) //it's a configuration, so no popup
		{
			return undefined;
		}

		const track = this.props.machine.track;
		const configurations = this.props.machine.configurations;

		return (
			<Popup
				key={track.toString()}
				coordinates={coordinatesTODO_Move(track)}	
			>
				<div className="track-popup-info">
					{track.name}
					<br/>

					{
						configurations.length > 0 && 
						<>
							<div>Configurations:</div>
							{
								configurations.map((config: Track) => {
									return <span>{config.name}</span>
								})
							}
						</>
					}

					<br/>
					<Link to={`/track/${track.track_id}`}>Go to track page</Link>
					{/* <button onClick={() => this.props.navMachine.goToTrackPage(track)}>Go to track page</button> */}
				</div>
			</Popup>
		)
	}
}

export function coordinatesTODO_Move(track: Track): number[]
{
	return [track.longitude!!, track.latitude!!]; //for some reason need to be reversed
}