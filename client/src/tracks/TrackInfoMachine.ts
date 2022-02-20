import React from 'react';
import {observer} from "mobx-react";
import {observable, action, makeObservable, runInAction, computed} from "mobx";
import { TrackTypeEnum, TrackName, Track } from '../Types';
import { API } from '../API';

export class TrackInfoMachine
{
	constructor()
	{
		makeObservable(this);
	}

	@observable
	public populated: boolean = false;

	@observable
	public tracks: Track[] = [];

	@observable
	public firstRaces: {track_id: number, date: Date}[] = [];

	@computed
	public get ovalTracks(): Track[]
	{
		return this.tracks.filter((track: Track) => {
			return track.type === "Oval";
		});
	}

	@computed
	public get roadTracks(): Track[]
	{
		return this.tracks.filter((track: Track) => {
			return track.type === "Road Course";
		});
	}

	@computed
	public get figure8Tracks(): Track[]
	{
		return this.tracks.filter((track: Track) => {
			return track.type === "Figure 8";
		});
	}

	public getTrackFromId(trackId: number): Track | undefined
	{
		return this.tracks.find((track: Track) => {
			return track.track_id === trackId;
		});
	}

	//TODO: inefficient
	public findFirstRaceForTrack(trackIdIn: number): Date | undefined
	{
		const firstRace: {track_id: number, date: Date} | undefined = this.firstRaces.find(
			(value: {track_id: number, date: Date}) => {
				return value.track_id === trackIdIn;
			});
	
		return firstRace?.date;
	}

	public getNewTracksInYear(year: number): Track[]
	{
		return this.tracks.filter((track: Track) => { //TODO: very inefficient
			const firstRace: Date | undefined = this.findFirstRaceForTrack(track.track_id);
			if (firstRace === undefined)
			{
				return undefined;
			}
			const actualDate = new Date(firstRace.toString());
			return actualDate.getFullYear() === year;
		})
	}

	//Update with new information from the server
	public async fetchAllTracks(): Promise<void>
	{
		const firstRaces: {track_id: number, date: Date}[] = await API.firstRacesAtEachTrack();
		runInAction(() => this.firstRaces = firstRaces);

		const tracks: Track[] = await API.fetchAllTracks();
		runInAction(() => this.tracks = tracks);

		//indicate that we have data now
		runInAction(() => this.populated = true);


    // for (let i: number = 0; i < infos.length; i++)
    // {
    // 	const trackInfo: TrackDbObj = infos[i];
			// switch (trackInfo.type)
			// {
			// 	case "OVAL":
			// 		trackInfo.type = TrackTypeEnum.OVAL;
			// 		break;
			// 	case "ROAD_COURSE":
			// 		trackInfo.type = TrackTypeEnum.ROAD_COURSE
			// }


    	// const flips: Flip[] | null = Flip.makeFlipObjectsFromJson(trackInfo["flips"]);
    	// const trackType: TrackTypeEnum = TrackInfoMachine.getTrackTypeEnumFromString(trackInfo.trackType);

    	// const trackObj: Track = new Track(
			// 	TrackName.parse(trackInfo.trackNameObj), 
			// 	trackInfo.state, 
    	// 	trackInfo.trackType,
    	// 	trackInfo.latitude, 
    	// 	trackInfo.longitude, 
    	// 	trackInfo.count,
    	// 	flips
    	// ); 

    	// runInAction(() => this.tracks.push(trackInfo));
    // }
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
