import React from 'react';
// import ReactDOM from "react-dom";
import {observer} from "mobx-react";
import {observable, action, makeObservable, runInAction} from "mobx";
import {TrackInfoMachine} from "./TrackInfoMachine";
import { Track, TrackTypeEnum } from '../Types';
import {NavigationMachine} from "../NavigationMachine";
import mapboxgl from 'mapbox-gl';
import ReactMapboxGl, {Layer, Feature, Marker, Popup} from 'react-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import "./TrackPopup.css";

export class TrackPopupMachine
{
	constructor()
	{
		// makeObservable(this);
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
	navMachine: NavigationMachine;
	track: Track;
}

@observer
export class TrackPopup extends React.Component<TrackPopupProps>
{
	render()
	{
		const track: Track = this.props.track;

		return (
			<Popup
				key={track.toString()}
				coordinates={track.coordinates}	
			>
				<div className="track-popup-info">
					{track.trackNameObj.toString()}
					<br/>
					<button onClick={() => this.props.navMachine.goToTrackPage(track)}>Go to track page</button>
				</div>
			</Popup>
		)
	}
}
