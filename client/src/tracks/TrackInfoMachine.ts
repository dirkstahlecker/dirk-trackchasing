import React from 'react';
import {observer} from "mobx-react";
import {observable, action, makeObservable, runInAction, computed} from "mobx";
import { Flip, Track, TrackTypeEnum, TrackName } from '../Types';

export class TrackInfoMachine
{
	constructor()
	{
		makeObservable(this);
	}

	@observable
	public tracks: Track[] = [];

	@computed
	public get ovalTracks(): Track[]
	{
		return this.tracks.filter((track: Track) => {
			return track.trackType === TrackTypeEnum.OVAL;
		});
	}

	@computed
	public get roadTracks(): Track[]
	{
		return this.tracks.filter((track: Track) => {
			return track.trackType === TrackTypeEnum.ROAD_COURSE;
		});
	}

	@computed
	public get figure8Tracks(): Track[]
	{
		return this.tracks.filter((track: Track) => {
			return track.trackType === TrackTypeEnum.FIGURE_8;
		});
	}

	public getTrackFromName(trackNameObj: TrackName)
	{
		return this.tracks.find((track) => {TrackName.equals(track.trackNameObj, trackNameObj)});
	}

	//Update with new information from the server
	public async fetchInfo(): Promise<void>
	{
		const infosRaw = await fetch("/tracks/info");
		const infos: any[] = await infosRaw.json(); //TODO: it's an array, need to get type

    for (let i: number = 0; i < infos.length; i++)
    {
    	const trackInfo: Track = infos[i];

    	const flips: Flip[] | null = Flip.makeFlipObjectsFromJson(trackInfo["flips"]);
    	// const trackType: TrackTypeEnum = TrackInfoMachine.getTrackTypeEnumFromString(trackInfo.trackType);

    	const trackObj: Track = new Track(
				TrackName.parse(trackInfo.trackNameObj), 
				trackInfo.state, 
    		trackInfo.trackType,
    		trackInfo.latitude, 
    		trackInfo.longitude, 
    		trackInfo.count,
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

  public static flipGifPath(trackName: string, flipId: string): string
  {
  	return "assets/flips/gifs/" + flipId + "_" + trackName.replaceAll(" ", "_") + ".gif";
	}

  public static getTrackTypeEnumFromString(typeStr: string): TrackTypeEnum
  {
  	switch (typeStr)
  	{
  		case "Oval":
  			return TrackTypeEnum.OVAL;
  		case "Road Course":
  			return TrackTypeEnum.ROAD_COURSE;
  		case "Figure 8":
  			return TrackTypeEnum.FIGURE_8;
  		default:
  			throw new Error("Invalid track type")
  	}
  }

  // public async getFlipsForTrack(trackName: string): Promise<void>
  // {
  // 	const flipsRaw = await (fetch("/"))
  // }
}
