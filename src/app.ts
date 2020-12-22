import { EventRecaps } from "./eventRecaps";
import {Parser} from './parser';
import {EventInfo, Flip, TrackName, Track, TrackTypeEnum} from "./Types";

const TRACK_ORDER_HEADER = "Track Order"; //track order sheet, the main reference for each track
const RACES_HEADER = "Races";

export function makeDate(input: string | Date): Date
{
	if (input instanceof Date)
	{
		const d = new Date(Date.UTC(input.getFullYear(), input.getMonth(), input.getUTCDate()));
		return d;
	}
	const d = new Date(Date.parse(input));
	const fixedDate = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getUTCDate()));
	return fixedDate;
}

export class ServerApp
{
	//gets list of all the tracks (configurations are sent as separate tracks)
	public async getTrackList(): Promise<string[]>
	{
		const json = await Parser.parse()
		let trackList: string[] = Object.keys(json[TRACK_ORDER_HEADER]) //tested and appears to work

		return trackList;
	}

	public async getTrackListNoConfigurations(): Promise<string[]>
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

	public async getTrackFullInfo(): Promise<Track[]>
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

	public async getCountForTrack(trackNameObj: TrackName): Promise<number>
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
	public async getEventStringsForTrack(trackNameObj: TrackName): Promise<string[]>
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

	public async getFlipsForTrack(trackNameObj: TrackName): Promise<Flip[]>
	{
		const flipDataAllTracks: Flip[] = await Parser.flipsData();

		const foundFlips: Flip[] = flipDataAllTracks.filter((flip: Flip) => {
			return TrackName.equals(flip.trackNameObj, trackNameObj);
		})
	
		return foundFlips;
	}

	private getDateFromFlip(flip: any): Date
	{
		return makeDate(flip.date);
	}

	public async getFlipsForEvent(trackNameObj: TrackName, date: Date): Promise<Flip[]>
	{
		const dateObj = makeDate(date);
		const flipsForTrack: Flip[] = await this.getFlipsForTrack(trackNameObj); //TODO: inefficient

		const flipsForEvent: Flip[] = flipsForTrack.filter((flip: Flip) => {
			return this.getDateFromFlip(flip).getTime() === dateObj.getTime();
		});

		return flipsForEvent;
	}

	public getDateFromEventString(eventString: string): Date
	{
		let dateRaw = eventString.split(":")[0];
		// return utilities.cleanDate(dateRaw);
		// return new Date(new Date(dateRaw).getTime());
		return makeDate(dateRaw);
	}

	public async makeEnrichedEventInfoHelper(eventString: string, trackNameObj: TrackName, dateObj: Date): Promise<EventInfo>
	{
		if (eventString === undefined)
		{
			throw Error("Event for track " + trackNameObj.baseName + " on date " + dateObj + " cannot be found");
		}
	
		const flipsForEvent = await this.getFlipsForEvent(trackNameObj, dateObj)
			
		const classes = eventString.substring(eventString.indexOf(":") + 2);
	
		const eventInfoObj: EventInfo = {
			date: dateObj, 
			classes: classes, 
			flips: flipsForEvent
		};
		//TODO: notable crashes
	
		return eventInfoObj;
	}

	//events are based on base name, and may or may not have a configuration
	public async getEnrichedEventInfoForDate(trackNameObj: TrackName, date: Date | string): Promise<EventInfo>
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
			return eventDate.getTime() === dateObj.getTime();
		});

		return this.makeEnrichedEventInfoHelper(eventString, trackNameObj, dateObj);
	}

	public async getAllEnrichedEventInfosForTrack(trackNameObj: TrackName): Promise<EventInfo[]>
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
			const eventInfo = await this.getEnrichedEventInfoForDate(trackNameObj, date);
			return eventInfo;
		});
		
		const eventInfos = await Promise.all(promises);
		return eventInfos;
	}

	public async getBasicStats(): Promise<any> //TODO
	{
		let json = await Parser.parse();
		// json = json[RACES_HEADER];
	

		return "Stats not implemented"
	}

	public async getSpecificEventRecap(date: Date | string, trackName: TrackName): Promise<string | null>
	{
		await EventRecaps.parse();
		return EventRecaps.getRecapForEvent(date, trackName);
  }
}