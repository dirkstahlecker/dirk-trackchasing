import React from 'react';
// import ReactDOM from "react-dom";
import {observer} from "mobx-react";
import {observable, action, makeObservable, runInAction} from "mobx";
import {TrackInfoMachine, Track, TrackTypeEnum} from "./TrackInfoMachine";
import {NavigationMachine} from "./NavigationMachine";
import mapboxgl from 'mapbox-gl';
import ReactMapboxGl, {Layer, Feature, Marker} from 'react-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

enum PopupState {ICON, INFO} //no need to export

export class TrackPopupMachine
{
	@observable
	public popupState: PopupState = PopupState.ICON;

	constructor()
	{
		makeObservable(this);
	}

	@action
	public changePopupState(value: PopupState): void
	{
		this.popupState = value;
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
		const srcPath = TrackPopupMachine.getMarkerSrcPathForType(track.trackType);

		return <Marker
		  coordinates={[track.longitude, track.latitude]}
		  anchor="bottom"
		>
			<>
				{
					this.props.machine.popupState === PopupState.ICON &&
				  <button onClick={() => this.props.machine.changePopupState(PopupState.INFO)}>
				  	<img src={srcPath} width="16px" height="16px"/>
				  </button>
				}
				{
					this.props.machine.popupState === PopupState.INFO &&
					<div>
						TEST
						<button onClick={() => this.props.navMachine.goToTrackPage(track)}>Go to track page</button>
					</div>
				}
			</>
		</Marker>;
	}
}
