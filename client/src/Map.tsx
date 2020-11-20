import React from 'react';
// import ReactDOM from "react-dom";
import {observer} from "mobx-react";
import {observable, action, makeObservable} from "mobx";
import mapboxgl from 'mapbox-gl';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export interface MapProps
{

}

const GlMap = ReactMapboxGl({
  accessToken: 'pk.eyJ1IjoiZGlya3N0YWhsZWNrZXIiLCJhIjoiY2tobzl2NXk3MDFrNTJ5bWw2andtNGN5eiJ9.CN8ziM6moVE85pfhbYiTIw'
});

@observer
export class Map extends React.Component<MapProps>
{
	private mapContainer: React.RefObject<HTMLDivElement>;

  constructor(props: MapProps)
  {
    super(props);
    this.mapContainer = React.createRef();

    mapboxgl.accessToken = 'pk.eyJ1IjoiZGlya3N0YWhsZWNrZXIiLCJhIjoiY2tobzl2NXk3MDFrNTJ5bWw2andtNGN5eiJ9.CN8ziM6moVE85pfhbYiTIw';
  }

  componentDidMount()
  {
  	if (this.mapContainer.current != null)
    {
      const map = new mapboxgl.Map({
      	container: this.mapContainer.current as HTMLElement,
      	style: 'mapbox://styles/mapbox/streets-v11',
      	// center: [this.state.lng, this.state.lat],
      	// zoom: this.state.zoom
    	});
    }
  }

  render()
  {
  	return <div id="map-place">
  		{/*<div ref={this.mapContainer} style={{width: "75%", height: "500px"}}/>*/}
			<GlMap
			  style='mapbox://styles/mapbox/satellite-v9'
			  containerStyle={{
			    height: '80vh',
			    width: '75vw'
			  }}
			>
			  <Layer type="symbol" id="marker" layout={{ 'icon-image': 'marker-15' }}>
			    <Feature coordinates={[-0.481747846041145, 51.3233379650232]} />
			  </Layer>
			</GlMap>
  	</div>;
  }
}
