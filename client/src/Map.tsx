import React from 'react';
// import ReactDOM from "react-dom";
import {observer} from "mobx-react";
import {observable, action, makeObservable, runInAction} from "mobx";
import {TrackInfoMachine, Track, TrackTypeEnum} from "./tracks/TrackInfoMachine";
import {TrackPopup, TrackPopupMachine} from "./tracks/TrackPopup";
import {NavigationMachine} from "./NavigationMachine";
import mapboxgl from 'mapbox-gl';
import ReactMapboxGl, {Layer, Feature, Marker} from 'react-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import oval from "./oval.png";

export class MapMachine
{
	@observable
	public trackForPopup: Track | null = null;

	constructor()
	{
		makeObservable(this);
	}

	@action
	public setTrackForPopup(value: Track | null): void
	{
		this.trackForPopup = value;
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

const ovalImg = new Image();
ovalImg.src = oval;
ovalImg.width = 30;
ovalImg.height = 30;
const images = ['ovalImg', ovalImg];

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

	private onDrag = () => {
		this.props.machine.setTrackForPopup(null);
	};


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
  		{/*<div ref={this.mapContainer} style={{width: "75%", height: "500px"}}/>*/}
			<GlMap
				style='mapbox://styles/dirkstahlecker/cki3fryu31zsg19l7aok4ly12'
				// style="mapbox://styles/mapbox/light-v9"
			  containerStyle={{
			    height: '80vh',
			    width: '75vw'
				}}
			  center={this.INITIAL_CENTER}
				zoom={[this.INITIAL_ZOOM]}
				onDrag={this.onDrag}
			>
				<>
					<Layer
						type="symbol"
						id="marker"
						layout={{
							"icon-image": "ovalImg",
							"icon-allow-overlap": true
						}}
						images={images}
					>
						{this.props.trackInfoMachine.tracks.map((track, index) => (
							<Feature
								key={track.name}
								// onMouseEnter={this.onToggleHover.bind(this, 'pointer')}
								// onMouseLeave={this.onToggleHover.bind(this, '')}
								onClick={() => this.props.machine.setTrackForPopup(track)}
								coordinates={track.coordinates}
							/>
						))}
					</Layer>
					{
						this.props.machine.trackForPopup &&
						<TrackPopup
							track={this.props.machine.trackForPopup}
							navMachine={this.props.navMachine}
							machine={new TrackPopupMachine()}
						/>
					}
				</>

			</GlMap>
  	</div>;
  }
}
