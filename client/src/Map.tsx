import React from 'react';
// import ReactDOM from "react-dom";
import {observer} from "mobx-react";
import {observable, action, makeObservable} from "mobx";
import {NavigationMachine} from "./NavigationMachine";
import mapboxgl from 'mapbox-gl';
import ReactMapboxGl, {Layer, Feature, Marker} from 'react-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export interface MapProps
{
	navMachine: NavigationMachine;
}

const GlMap = ReactMapboxGl({
  accessToken: 'pk.eyJ1IjoiZGlya3N0YWhsZWNrZXIiLCJhIjoiY2tobzl2NXk3MDFrNTJ5bWw2andtNGN5eiJ9.CN8ziM6moVE85pfhbYiTIw'
});

@observer
export class Map extends React.Component<MapProps>
{
	private mapContainer: React.RefObject<HTMLDivElement>;

	private readonly DEFAULT_ZOOM = 16;

  constructor(props: MapProps)
  {
    super(props);
    this.mapContainer = React.createRef();

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

  			//   <Layer type="symbol" id="marker" layout={{ 'icon-image': 'marker-15' }}>
			  //   <Feature coordinates={[41.7842558, -71.3029103]} />
			  // </Layer>

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
			  center={[-71.302170, 41.784417]} //coordinates are backwards for some reason
			  zoom={[this.DEFAULT_ZOOM]}
			>
				{

				}
			  <Marker
				  coordinates={[-71.302170, 41.784417]}
				  anchor="bottom"
				>
				  <img src="assets/oval.png"/>
				</Marker>
			</GlMap>
  	</div>;
  }
}
