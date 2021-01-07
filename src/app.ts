import { EventRecaps } from "./eventRecaps";
import { getRecapStringForTrackAndDate } from "./EventsWithRecap";
import {Parser} from './parser';
import {EventObj, Flip, TrackName, Track, TrackTypeEnum, makeDate} from "./Types";
import { compareDates } from "./utilities";

const TRACK_ORDER_HEADER = "Track Order"; //track order sheet, the main reference for each track
const RACES_HEADER = "Races";

export abstract class ServerApp
{
	//gets list of all the tracks (configurations are sent as separate tracks)
	public static async getTrackList(): Promise<string[]>
	{
		const json = await Parser.parse()
		let trackList: string[] = Object.keys(json[TRACK_ORDER_HEADER]) //tested and appears to work

		return trackList;
	}

	public static async getTrackListNoConfigurations(): Promise<string[]>
	{
		const list: string[] = await this.getTrackList();
		
		const filteredList = [];
		for (let i = 0; i < list.length; i++)
		{
			const track: string= list[i];
			if (track.match(/\(.*\)/) == null)
			{
				filteredList.push(track);
			}
		};
		return filteredList;
	}

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
				throw new Error("Invalid type string " + typeStr + "; cannot convert to TrackTypeEnum")
		}
	}

	public static async getTrackFullInfo(): Promise<Track[]>
	{
		const json = await Parser.parse();
		const tracksList: string[] = await this.getTrackList();

		let tracksAndCoords: Track[] = [];
		for (let i = 0; i < tracksList.length; i++)
		{
			const trackRaw: string = tracksList[i];
			const trackNameObj: TrackName = TrackName.parse(trackRaw);
			const trackInfo = json[TRACK_ORDER_HEADER][trackRaw]; //TODO: improve this
			const count: number = await this.getCountForTrack(trackNameObj);
			const flips: Flip[] = await this.getFlipsForTrack(trackNameObj);
			const trackType: TrackTypeEnum = ServerApp.getTrackTypeEnumForString(trackInfo["Type"]);

			const newTrackInfo: Track = new Track(
				trackNameObj, 
				trackInfo["State"],
				trackType,
				trackInfo["Latitude"],
				trackInfo["Longitude"],
				count,
				flips
			);

			tracksAndCoords.push(newTrackInfo);
		}
		return tracksAndCoords
	}

	public static async getTrackObjForName(trackName: TrackName): Promise<Track>
	{
		await Parser.parse();
		const tracksFullInfo: Track[] = await this.getTrackFullInfo();
		const theTrack: Track | undefined = tracksFullInfo.find((value: Track) => {
			return TrackName.equals(value.trackNameObj, trackName);
		});

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

	public static async getFlipsForTrack(trackNameObj: TrackName): Promise<Flip[]>
	{
		const flipDataAllTracks: Flip[] = await Parser.flipsData();

		const foundFlips: Flip[] = flipDataAllTracks.filter((flip: Flip) => {
			return TrackName.equals(flip.trackNameObj, trackNameObj);
		})
	
		return foundFlips;
	}

	private static getDateFromFlip(flip: any): Date
	{
		return makeDate(flip.date);
	}

	public static async getFlipsForEvent(trackNameObj: TrackName, date: Date): Promise<Flip[]>
	{
		const dateObj = makeDate(date);
		const flipsForTrack: Flip[] = await this.getFlipsForTrack(trackNameObj); //TODO: inefficient

		const flipsForEvent: Flip[] = flipsForTrack.filter((flip: Flip) => {
			return this.getDateFromFlip(flip).getTime() === dateObj.getTime();
		});

		return flipsForEvent;
	}

	public static getDateFromEventString(eventString: string): Date
	{
		let dateRaw = eventString.split(":")[0];
		// return utilities.cleanDate(dateRaw);
		// return new Date(new Date(dateRaw).getTime());
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
		let dateObj: Date;
		if (date instanceof Date)
		{
			dateObj = date;
		}
		else
		{
			dateObj = makeDate(date);
		}
		
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

	public static async getBasicStats(): Promise<any> //TODO
	{
		let json = await Parser.parse();
		// json = json[RACES_HEADER];
	

		return "Stats not implemented"
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
