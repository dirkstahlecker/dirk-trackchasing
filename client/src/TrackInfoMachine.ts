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

	private makeFlipObject(flipJson: Array<Object> | undefined): Flip[]
	{
		if (flipJson === undefined)
		{
			return [];
		}

		const flips: Flip[] = [];
		flipJson.forEach((flipObj: any) => {
			flips.push(new Flip(
				flipObj["date"], 
				flipObj["class"], 
				flipObj["rotations"], 
				flipObj["surface"], 
				flipObj["openWheel"], 
				flipObj["when"], 
				flipObj["video"], 
				flipObj["notes"]
			));
		});

		return flips;


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

    	const flips: Flip[] | null = this.makeFlipObject(trackInfo["flips"]);

    	const trackObj: Track = new Track(
    		trackName, trackInfo["state"], 
    		TrackTypeEnum.OVAL, //TODO: fix type
    		trackInfo["latitude"], 
    		trackInfo["longitude"], 
    		trackInfo["count"],
    		flips
    	); 

    	runInAction(() => this.tracks.push(trackObj));
    }
	}

	public async getRaceNum(trackName: string): Promise<void>
  {
    const numRaw = await fetch("/numRaces/" + trackName);
    const num = await numRaw.json();
    alert(num.message);
  }

  // public async getFlipsForTrack(trackName: string): Promise<void>
  // {
  // 	const flipsRaw = await (fetch("/"))
  // }
}

export class Track
{
	//everything is static, so don't need to be observable (nothing changes without a page reload)
	public name: string;
	public state: string;
	public type: TrackTypeEnum;
	public latitude: number;
	public longitude: number;

	public flips: Flip[];

	public count: number;

	constructor(name: string, state: string, type: TrackTypeEnum, latitude: number, longitude: number, count: number, flips: Flip[])
	{
		this.name = name
		this.state = state
		this.type = type;
		this.latitude = latitude
		this.longitude = longitude
		this.count = count;
		this.flips = flips;
	}

	//more to come...
}

export class Flip
{
	public date: string;
	public carClass: string;
	public rotations: string;
	public surface: string;
	public openWheel: boolean;
	public when: string;
	public video: boolean;
	public notes: string;

	constructor(date: string, carClass: string, rotations: string, surface: string, openWheel: boolean, when: string, video: boolean, notes: string)
	{
		this.date = date;
		this.carClass = carClass;
		this.rotations = rotations;
		this.surface = surface;
		this.openWheel = openWheel;
		this.when = when;
		this.video = video;
		this.notes = notes;
	}
}

