import React from 'react';
import {observer} from "mobx-react";
import {observable, action, makeObservable, runInAction} from "mobx";

export enum TrackTypeEnum {OVAL, FIGURE_8, ROAD_COURSE}

export class TrackInfoMachine
{
	constructor()
	{
		makeObservable(this);
	}

	@observable
	public tracks: Track[] = [];

	public getTrackFromName(trackName: string)
	{
		return this.tracks.find((track) => {return track.name === trackName});
	}

	//Update with new information from the server
	public async fetchInfo(): Promise<void>
	{
		const infosRaw = await fetch("/tracks/info");
		const infos = await infosRaw.json();

		const tracksRaw = await fetch("/tracks");
    const trackNames: Array<any> = await tracksRaw.json();

    for (let i: number = 0; i < trackNames.length; i++)
    {
    	const trackName = trackNames[i];
    	const trackInfo = infos[trackName];

    	const trackObj: Track = new Track(
    		trackName, trackInfo["state"], 
    		TrackTypeEnum.OVAL, //TODO: fix type
    		trackInfo["latitude"], 
    		trackInfo["longitude"], 
    		trackInfo["count"]); 

    	runInAction(() => this.tracks.push(trackObj));
    }
	}

	public async getRaceNum(trackName: string): Promise<void>
  {
    const numRaw = await fetch("/numRaces/" + trackName);
    const num = await numRaw.json();
    alert(num.message);
  }
}

export class Track
{
	//everything is static, so don't need to be observable (nothing changes without a page reload)
	public name: string;
	public state: string;
	public type: TrackTypeEnum;
	public latitude: number;
	public longitude: number;

	public count: number;

	constructor(name: string, state: string, type: TrackTypeEnum, latitude: number, longitude: number, count: number)
	{
		this.name = name
		this.state = state
		this.type = type;
		this.latitude = latitude
		this.longitude = longitude
		this.count = count;
	}

	//more to come...
}
