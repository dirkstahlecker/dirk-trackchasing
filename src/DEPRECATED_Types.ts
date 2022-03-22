//this is copied between client and server - make sure they stay in sync


//DEPRECATED - types are in dbUtils now

export function makeDate(input: string | Date): Date
{
	if (input instanceof Date)
	{
		const d = new Date(Date.UTC(input.getFullYear(), input.getMonth(), input.getUTCDate(), 12));
		return d;
	}
	const d = new Date(Date.parse(input));
	const fixedDate = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getUTCDate(), 12));
	return fixedDate;
}

export function printDate(date: Date): string
{
	return `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
}

export class Track_old
{
	//data is static, so don't need to be observable (nothing changes without a page reload)
	public trackNameObj: TrackName;
	public state: string;
	public trackType: TrackTypeEnum;
	public latitude: number;
	public longitude: number;
	public flips: Flip[];

	public count: number;

	constructor(trackNameObj: TrackName, state: string, trackType: TrackTypeEnum, latitude: number, 
		longitude: number, count: number, flips: Flip[])
	{
		this.trackNameObj = trackNameObj;
		this.state = state
		this.trackType = trackType;
		this.latitude = latitude
		this.longitude = longitude
		this.count = count;
		this.flips = flips;
	}

	public get coordinates(): number[]
	{
		return [this.longitude, this.latitude]; //need to be reversed for some reason
	}

	//unique key
	public print(): string
	{
		return this.trackNameObj.print() + this.state + this.trackType;
	}

	//more to come...
}

export class TrackName
{
	public baseName: string;
	public configuration: string | null;
	public isConfiguration: boolean;

	constructor(baseName: string, configuration: string | null, isConfiguration: boolean)
	{
    if (isConfiguration && configuration == null)
    {
      throw new Error("Track object isConfiguration is false, but configuration is null");
    }

		this.baseName = baseName;
		this.configuration = configuration;
		this.isConfiguration = isConfiguration;
  }

  public static equals(t1: TrackName, t2: TrackName): boolean
  {
    return t1.baseName === t2.baseName 
      && t1.configuration === t2.configuration 
      && t1.isConfiguration === t2.isConfiguration;
  }

  public static parse(rawNameString: string | Object)
  {
		if (rawNameString.hasOwnProperty("baseName") 
			&& rawNameString.hasOwnProperty("isConfiguration") 
			&& rawNameString.hasOwnProperty("configuration"))
		{
			//it's an object coming in from the server
			const nameObj = rawNameString as any;
			return new TrackName(nameObj["baseName"], nameObj["configuration"], nameObj["isConfiguration"]);
		}
		else
		{
			let trackName = (rawNameString as string).trim();

			let isConfiguration = false; //an alternative configuration of a base track, named with parentheses
			const parts = trackName.split(/\(/); //split on left paren
			let configuration = null;
			if (parts.length == 2) //if two parts, we have a configuration
			{
				isConfiguration = true;
				//remove the other paren
				configuration = parts[1].trim();
				configuration = configuration.replace(/\)/, "").trim();
				trackName = parts[0].trim();
			}
		
			return new TrackName(trackName, configuration, isConfiguration);
		}
	}
	
	public print(): string
	{
		let ret = this.baseName;
		if (this.isConfiguration)
		{
			ret += " (" + this.configuration + ")";
		}
		return ret;
	}
}


export enum TrackTypeEnum {OVAL, FIGURE_8, ROAD_COURSE}

export class EventObj
{
	public trackName: TrackName;
  public date: Date;
  public classes: string;
  public flips: Flip[];
  // public notableCrashes: ; //TODO

  constructor(trackName: TrackName, date: Date | string, classes: string, flips: Flip[])
  {
		this.trackName = trackName;
    this.date = makeDate(date);
    this.classes = classes;
    this.flips = flips;
  }

	//TODO: this probably doesn't work
  static parseJson(json: any): EventObj
  {
		const jsonFlipsRaw = json["flips"];

		const flips: Flip[] = Flip.makeFlipObjectsFromJson(jsonFlipsRaw);

		// for (let i: number = 0; i < jsonFlipsRaw.length; i++)
		// {
		// 	const flipRaw = jsonFlipsRaw[i];
		// 	// const nameRaw = flipRaw["trackNameObj"];
		// 	// const newTrackName: TrackName = new TrackName(
		// 	// 	nameRaw["baseName"], 
		// 	// 	nameRaw["configuration"], 
		// 	// 	nameRaw["isConfiguration"]
		// 	// );
		// 	// const newFlip: Flip = new Flip(newTrackName, flipRaw["flipId"], flipRaw["date"], flipRaw["carClass"],
		// 	// 	flipRaw["rotations"], flipRaw["surface"], flipRaw["openWheel"], flipRaw["when"], flipRaw["video"], 
		// 	// 	flipRaw["notes"]
		// 	// );
			
		// 	// flips.push(newFlip);
		// }
		
    return new EventObj(
			json["trackName"],
			makeDate(json["date"]),
			json["classes"],
			flips
		);
  }
}

export class Flip
{
	public trackNameObj: TrackName;
	public flipId: string;
	public date: Date;
	public carClass: string;
	public rotations: string;
	public surface: string;
	public openWheel: boolean;
	public when: string;
	public video: boolean;
	public notes: string;

	constructor(trackNameObj: TrackName, flipId: string, date: Date, carClass: string, rotations: string, 
		surface: string, openWheel: boolean, when: string, video: boolean, notes: string)
	{
		this.trackNameObj = trackNameObj;
		this.flipId = flipId;
		this.date = date;
		this.carClass = carClass;
		this.rotations = rotations;
		this.surface = surface;
		this.openWheel = openWheel;
		this.when = when;
		this.video = video;
		this.notes = notes;
	}

	public static makeFlipObjectsFromJson(flipJson: any): Flip[]
	{
		if (flipJson === undefined)
		{
			return [];
		}

		const flips: Flip[] = [];
		flipJson.forEach((flipObj: any) => {

			const nameRaw = flipObj["trackNameObj"];
			const newTrackName: TrackName = new TrackName(
				nameRaw["baseName"], 
				nameRaw["configuration"], 
				nameRaw["isConfiguration"]
			);

			flips.push(new Flip(
				newTrackName,
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
}

// export type EventInfo = {date: Date; classes: string; flips: Flip[]}