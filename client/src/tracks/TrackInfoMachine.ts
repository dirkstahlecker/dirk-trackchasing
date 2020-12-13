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

	private makeFlipObject(flipJson: Array<Object> | undefined): Flip[]
	{
		if (flipJson === undefined)
		{
			return [];
		}

		const flips: Flip[] = [];
		flipJson.forEach((flipObj: any) => {
			flips.push(new Flip(
				flipObj["flipId"],
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
    	const trackType: TrackTypeEnum = TrackInfoMachine.getTrackTypeEnumFromString(trackInfo["trackType"]);

    	const trackObj: Track = new Track(
    		trackName, trackInfo["state"], 
    		trackType,
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
