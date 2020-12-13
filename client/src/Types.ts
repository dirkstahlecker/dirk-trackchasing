//this is copied between client and server - make sure they stay in sync

export class Track
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
  public date: string;
  public classes: string;
  public flips: Flip[];
  // public notableCrashes: ; //TODO

  constructor(date: string, classes: string, flips: Flip[])
  {
    this.date = date;
    this.classes = classes;
    this.flips = flips;
  }

  static parseJson(json: any): EventObj
  {
    return new EventObj(json["date"], json["classes"], json["flips"]); //TODO: flips probably won't work
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
}

export type EventInfo = {date: Date; classes: string; flips: Flip[]}