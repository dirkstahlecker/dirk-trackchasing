import React from 'react';
// import ReactDOM from "react-dom";
import {observer} from "mobx-react";
import {observable, action, makeObservable, runInAction} from "mobx";
import {TrackInfoMachine, Track, TrackTypeEnum} from "./TrackInfoMachine";
import {TrackPopup, TrackPopupMachine} from "./TrackPopup";
import {NavigationMachine} from "./NavigationMachine";
import mapboxgl from 'mapbox-gl';
import ReactMapboxGl, {Layer, Feature, Marker} from 'react-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export class MapMachine
{
	constructor()
	{
		// makeObservable(this);
	}
}

export interface MapProps
{
	machine: MapMachine;
	navMachine: NavigationMachine;
	trackInfoMachine: TrackInfoMachine;
}

const GlMap = ReactMapboxGl({
  accessToken: 'pk.eyJ1IjoiZGlya3N0YWhsZWNrZXIiLCJhIjoiY2tobzl2NXk3MDFrNTJ5bWw2andtNGN5eiJ9.CN8ziM6moVE85pfhbYiTIw'
});

@observer
export class Map extends React.Component<MapProps>
{
	// private mapContainer: React.RefObject<HTMLDivElement>;

	private readonly INITIAL_CENTER: [number, number] = [-98.583333, 39.833333];
	private readonly DEFAULT_ZOOM = 16;
	private readonly INITIAL_ZOOM = 3;

  constructor(props: MapProps)
  {
    super(props);
    // this.mapContainer = React.createRef();

    mapboxgl.accessToken = 'pk.eyJ1IjoiZGlya3N0YWhsZWNrZXIiLCJhIjoiY2tobzl2NXk3MDFrNTJ5bWw2andtNGN5eiJ9.CN8ziM6moVE85pfhbYiTIw';
  }

  componentDidMount()
  {
  	// if (this.mapContainer.current != null)
   //  {
     //  const map = new mapboxgl.Map({
     //  	container: this.mapContainer.current as HTMLElement,
     //  	style: 'mapbox://styles/mapbox/streets-v11',
     //  	// center: [this.state.lng, this.state.lat],
     //  	// zoom: this.state.zoom
    	// });
    // }
  }

	private renderMarkers(): JSX.Element[]
	{
		return this.props.trackInfoMachine.tracks.map((track: Track) => {
			if (track.latitude === undefined || track.longitude === undefined)
			{
				return <></>;
			}

			return <div key={track.name}>
				<TrackPopup
					track={track}
					navMachine={this.props.navMachine}
					machine={new TrackPopupMachine()}
				/>
			</div>
		});
	}

  render()
  {
  	return <div id="map-place">
  		<button onClick={() => this.props.navMachine.goHome()}>Home</button>
  		{/*<div ref={this.mapContainer} style={{width: "75%", height: "500px"}}/>*/}
			<GlMap
			  style='mapbox://styles/mapbox/satellite-v9'
			  containerStyle={{
			    height: '80vh',
			    width: '75vw'
			  }}
			  center={this.INITIAL_CENTER} //coordinates are backwards for some reason
			  zoom={[this.INITIAL_ZOOM]}
			>
				{this.renderMarkers()}
			</GlMap>
  	</div>;
  }
}
