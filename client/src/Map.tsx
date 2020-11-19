import React from 'react';
// import ReactDOM from "react-dom";
import {observer} from "mobx-react";
import {observable, action, makeObservable} from "mobx";
import mapboxgl from 'mapbox-gl';

export interface MapProps
{

}

@observer
export class Map extends React.Component<MapProps>
{
	private mapContainer: React.RefObject<HTMLDivElement>;

  constructor(props: MapProps)
  {
    super(props);
    this.mapContainer = React.createRef();

    mapboxgl.accessToken = 'pk.eyJ1IjoiZGlya3N0YWhsZWNrZXIiLCJhIjoiY2tobzl2NXk3MDFrNTJ5bWw2andtNGN5eiJ9.CN8ziM6moVE85pfhbYiTIw';
    // const map = new mapboxgl.Map({ //this map apparently corresponds to the div with id "map"
    //   container: 'map',
    //   style: 'mapbox://styles/mapbox/streets-v11'
    // });
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
  	return <div ref={this.mapContainer} style={{width: "75%", height: "500px"}}/>;
  }
}