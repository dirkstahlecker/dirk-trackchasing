import { textSpanContainsTextSpan } from "typescript";
import { BasicStats, makeQuery, Race, StateStats, TrackDbObj } from "./database/dbUtils";
import { EventRecaps } from "./eventRecaps";
import { getRecapStringForTrackAndDate } from "./EventsWithRecap";
import {Parser} from './parser';
import {EventObj, Flip, TrackName, Track_old, TrackTypeEnum, makeDate} from "./Types";
import { compareDates } from "./utilities";

const TRACK_ORDER_HEADER = "Track Order"; //track order sheet, the main reference for each track
const RACES_HEADER = "Races";

export abstract class ServerApp
{


	public static async getRacesForTrack(trackId: number): Promise<Race[]>
	{
		const query: string = `SELECT * FROM races WHERE track_id = ${trackId};`;
    const result = await makeQuery(query);

		return result.rows as Race[];
	}

	public static async getFlipsForTrack(trackId: number): Promise<Flip[]>
	{
		// const trackIdQuery = `SELECT race_id FROM races WHERE track_id = ${trackId};`;
		// const trackId: string = await makeQuery(trackIdQuery);

		//TODO: I think flips need a track_id for ease of querying

		const query: string = `SELECT * FROM flips WHERE race_id = ${trackId};`; //TODO: wrong
		const result = await makeQuery(query);

		return result.rows as Flip[];
	}

	//gets list of all the tracks (configurations are sent as separate tracks)
	public static async getAllTracks(): Promise<TrackDbObj[]>
	{
		const query: string = `SELECT * FROM tracks;`;
		const result = await makeQuery(query);

		return result.rows as TrackDbObj[];
	}

	public static async getConfigurationsForTrack(trackId: number): Promise<TrackDbObj[]>
	{
		const query: string = `SELECT * FROM tracks WHERE parent_track_id = ${trackId};`;
		const result = await makeQuery(query);
		
		return result.rows as TrackDbObj[];
	}

	public static async getBasicStats(): Promise<BasicStats>
	{
		const totalRacesQuery: string = `SELECT * FROM races;`;
		const totalRacesResult = await makeQuery(totalRacesQuery);
		const totalRaces = totalRacesResult.rows.length;

		const statesQuery: string = `SELECT state, COUNT(DISTINCT track_id) as configs, 
		COUNT(DISTINCT track_id) - COUNT(parent_track_id) as facilities FROM tracks GROUP BY state;`;
		const statesResult = await makeQuery(statesQuery);
		const states = statesResult.rows;

		const statesList: StateStats[] = [];
		states.forEach((s: {state: string, configs: number, facilities: number}) => {
			statesList.push({state: s.state, configs: s.configs, facilities: s.facilities});
		});

		const totalDaysQuery: string = `SELECT DISTINCT date FROM races;`;
		const totalDaysResult = await makeQuery(totalDaysQuery);
		const totalDays = totalDaysResult.rows.length;

		const countableTracksQuery: string = `SELECT track_id FROM tracks;`;
		const countableTracksResult = await makeQuery(countableTracksQuery);
		const countableTracks = countableTracksResult.rows.length;

		const totalFacilitiesQuery: string = `SELECT track_id FROM tracks WHERE parent_track_id IS NULL;`;
		const totalFacilitiesResult = await makeQuery(totalFacilitiesQuery);
		const totalFacilities = totalFacilitiesResult.rows.length;

		const statsObj: BasicStats = {
			total_days: totalDays,
			total_races: totalRaces,
			states: statesList,
			countable_tracks: countableTracks,
			total_facilities: totalFacilities
		};

		return statsObj;
	}

	public static async getFirstRaceAtEachTrack(): Promise<{trackId: string, date: Date}>
	{
		const query = `SELECT track_id, min(date) AS date FROM races GROUP BY track_id;`;
		const result = await makeQuery(query);

		return result.rows;
	}

	public static async getRacesPerYear(year: string): Promise<number>
	{
		const query = `SELECT race_id from races WHERE EXTRACT(YEAR FROM date) = ${year};`;
		const result = await makeQuery(query);

		return result.rows.length;
	}
	
	//because an event can have muliple races (each configuration is a different row in races) in order to know
	//how many unique events there are we have to look at the unique events per parent_track_id per date
	public static async getUniqueEvents(): Promise<{raceId: string, date: Date, trackId: string, name: string, parentTrackId: string}>
	{
		const query = `SELECT races.race_id, races.date, tracks.track_id, tracks.name, tracks.parent_track_id FROM tracks JOIN races ON races.track_id = tracks.track_id;`;
		const result = await makeQuery(query);
	
		console.log(result.rows);

		return result.rows;
	}

















	// //gets list of all the tracks (configurations are sent as separate tracks)
	// public static async getTrackList(): Promise<string[]>
	// {
	// 	const json = await Parser.parse()
	// 	let trackList: string[] = Object.keys(json[TRACK_ORDER_HEADER]) //tested and appears to work

	// 	return trackList;
	// }

	// public static async getTrackListNoConfigurations(): Promise<string[]>
	// {
	// 	const list: string[] = await this.getTrackList();
		
	// 	const filteredList = [];
	// 	for (let i = 0; i < list.length; i++)
	// 	{
	// 		const track: string= list[i];
	// 		if (track.match(/\(.*\)/) == null)
	// 		{
	// 			filteredList.push(track);
	// 		}
	// 	};
	// 	return filteredList;
	// }

	public static getTrackTypeEnumForString(typeStr: string): TrackTypeEnum
	{
		switch (typeStr)
		{
			case "Oval":
				return TrackTypeEnum.OVAL;
			case "Figure 8":
				return TrackTypeEnum.FIGURE_8;
			case "Road Course":
				return TrackTypeEnum.ROAD_COURSE;
			default:
				console.log("###############")
				throw new Error("Invalid type string " + typeStr + "; cannot convert to TrackTypeEnum")
		}
	}

	public static async getTrackFullInfo(): Promise<TrackDbObj[]>
	{
		const query: string = `SELECT * FROM tracks;`;
    const result = await makeQuery(query);

		console.log(result.rows as TrackDbObj[])

		return result.rows as TrackDbObj[];

		// const json = await Parser.parse();
		// const tracksList: string[] = await this.getTrackList();

		// let tracksAndCoords: Track[] = [];
		// for (let i = 0; i < tracksList.length; i++)
		// {
		// 	const trackRaw: string = tracksList[i];
		// 	const trackNameObj: TrackName = TrackName.parse(trackRaw);
		// 	const trackInfo = json[TRACK_ORDER_HEADER][trackRaw]; //TODO: improve this

		// 	const count: number = await this.getCountForTrack(trackNameObj);
		// 	const flips: Flip[] = await this.getFlipsForTrack(trackNameObj);
		// 	const trackType: TrackTypeEnum = ServerApp.getTrackTypeEnumForString(trackInfo["Type"]);

		// 	const newTrackInfo: Track = new Track(
		// 		trackNameObj, 
		// 		trackInfo["State"],
		// 		trackType,
		// 		trackInfo["Latitude"],
		// 		trackInfo["Longitude"],
		// 		count,
		// 		flips
		// 	);

		// 	tracksAndCoords.push(newTrackInfo);
		// }
		// return tracksAndCoords
	}

	public static async getTrackObjForName(trackName: TrackName): Promise<Track_old>
	{
		// await Parser.parse();
		// const tracksFullInfo: Track[] = await this.getTrackFullInfo();
		// const theTrack: Track | undefined = tracksFullInfo.find((value: Track) => {
		// 	return TrackName.equals(value.trackNameObj, trackName);
		// });

		const theTrack: any = undefined;

		if (theTrack === undefined)
		{
			throw new Error("Could not locate track object for trackName: " + trackName.print());
		}
		return theTrack;
	}

	public static async getCountForTrack(trackNameObj: TrackName): Promise<number>
	{
		let json = await Parser.parse();
		json = json[RACES_HEADER];
	
		let count = 0;
		let i = 0;
		while (true)
		{
			const jsonRowHeader = "Races: " + i;
			const raceRow = json[jsonRowHeader];
			if (raceRow === undefined)
			{
				break;
			}
	
			//TODO: consolidate with getEventsForTrack, some property bag thing
			if (raceRow[trackNameObj.baseName] != null)
			{
				if (trackNameObj.isConfiguration)
				{
					//need to look into the specifics and see if there configuration is in brackets at the end
					if (raceRow[trackNameObj.baseName].includes(trackNameObj.configuration))
					{
						count++
					}
				}
				else
				{
					count++;
				}
			}
			i++;
		}
	
		return count;
	}

	//returns only the event string as stored in the json
	public static async getEventStringsForTrack(trackNameObj: TrackName): Promise<string[]>
	{
		let json = await Parser.parse();
		json = json[RACES_HEADER];
		const events = [];

		let i = 0;
		while (true)
		{
			const jsonRowHeader = "Races: " + i;
			const raceRow = json[jsonRowHeader];
			if (raceRow === undefined)
			{
				break;
			}
			
			const event = raceRow[trackNameObj.baseName];
			if (event != null)
			{
				if (trackNameObj.isConfiguration)
				{
					if (event.includes(trackNameObj.configuration))
					{
						events.push(event);
					}
				}
				else //not a configuration, add all
				{
					events.push(event);
				}
			}
			i++;
		}

		return events;
	}

	// public static async getFlipsForTrack(trackNameObj: TrackName): Promise<Flip[]>
	// {
	// 	const flipDataAllTracks: Flip[] = await Parser.flipsData();

	// 	const foundFlips: Flip[] = flipDataAllTracks.filter((flip: Flip) => {
	// 		return TrackName.equals(flip.trackNameObj, trackNameObj);
	// 	})
	
	// 	return foundFlips;
	// }

	private static getDateFromFlip(flip: any): Date
	{
		return makeDate(flip.date);
	}

	public static async getFlipsForEvent(trackNameObj: TrackName, date: Date): Promise<Flip[]>
	{
		const dateObj = makeDate(date);
		// const flipsForTrack: Flip[] = await this.getFlipsForTrack(trackNameObj); //TODO: inefficient

		const flipsForEvent: Flip[] = []; //flipsForTrack.filter((flip: Flip) => {
		// 	return this.getDateFromFlip(flip).getTime() === dateObj.getTime();
		// });

		return flipsForEvent;
	}

	public static getDateFromEventString(eventString: string): Date
	{
		let dateRaw = eventString.split(":")[0];
		// return utilities.cleanDate(dateRaw);
		// return new Date(new Date(dateRaw).getTime());
		console.log(dateRaw);
		return makeDate(dateRaw);
	}

	public static async makeEnrichedEventInfoHelper(eventString: string, trackNameObj: TrackName, dateObj: Date): Promise<EventObj>
	{
		if (eventString === undefined)
		{
			throw Error("Event for track " + trackNameObj.baseName + " on date " + dateObj + " cannot be found");
		}
	
		const flipsForEvent = await this.getFlipsForEvent(trackNameObj, dateObj)
			
		const classes = eventString.substring(eventString.indexOf(":") + 2);
	
		// const eventInfoObj: EventObj = {
		// 	date: dateObj, 
		// 	classes: classes, 
		// 	flips: flipsForEvent
		// };
		//TODO: notable crashes

		const eventObj: EventObj = new EventObj(trackNameObj, dateObj, classes, flipsForEvent);
		return eventObj;
	}

	//events are based on base name, and may or may not have a configuration
	public static async getEnrichedEventInfoForDate(trackNameObj: TrackName, date: Date | string): Promise<EventObj>
	{
		let dateObj: Date = makeDate(date);
		
		//TODO: deal with invalid dates that come from old events where I don't know the date
		const eventStrings = await this.getEventStringsForTrack(trackNameObj); //TODO: inefficient - stop when we find it
		const eventString = eventStrings.find((event) => {
			const eventDate = this.getDateFromEventString(event);
			return compareDates(eventDate, dateObj);
		});

		return this.makeEnrichedEventInfoHelper(eventString, trackNameObj, dateObj);
	}

	public static async getAllEnrichedEventInfosForTrack(trackNameObj: TrackName): Promise<EventObj[]>
	{
		const eventStrings = await this.getEventStringsForTrack(trackNameObj); //TODO: inefficient - stop when we find it
	
		const promises = eventStrings.map(async(eventStr) => {
			const date = this.getDateFromEventString(eventStr);
			// if (date.getTime() != date.getTime()) //getTime is NaN for invalid dates, NaN never equals NaN, so invalid
			// {
			// 	console.error("Invalid date")
			// 	return null;
			// }
			//TODO: error handling for invalid date
			const eventobj: EventObj = await this.getEnrichedEventInfoForDate(trackNameObj, date);
			return eventobj;
		});
		
		const eventInfos = await Promise.all(promises);
		return eventInfos;
	}

	//returns a list of EventInfos, all the event infos that have recaps
	public static async getEventsWithRecaps(): Promise<EventObj[]>
	{
		await EventRecaps.parse();
		return EventRecaps.getListOfEventsWithRecap();
	}

	//this was originally written to return the full text of the recap.
	//I've since changed it to instead send the URL of the HTML recap page
	public static async getSpecificEventRecap(date: Date | string, trackName: TrackName): Promise<string | null>
	{
		// await EventRecaps.parse();
		// return EventRecaps.getRecapForEvent(date, trackName);

		return getRecapStringForTrackAndDate(makeDate(date), trackName);
  }
}
