//this is copied between client and server - make sure they stay in sync

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

// {
// 	//data is static, so don't need to be observable (nothing changes without a page reload)
// 	public trackNameObj: TrackName;
// 	public state: string;
// 	public trackType: TrackTypeEnum;
// 	public latitude: number;
// 	public longitude: number;
// 	public flips: Flip_old[];

// 	public count: number;

// 	constructor(trackNameObj: TrackName, state: string, trackType: TrackTypeEnum, latitude: number, 
// 		longitude: number, count: number, flips: Flip_old[])
// 	{
// 		this.trackNameObj = trackNameObj;
// 		this.state = state
// 		this.trackType = trackType;
// 		this.latitude = latitude
// 		this.longitude = longitude
// 		this.count = count;
// 		this.flips = flips;
// 	}

// 	public get coordinates(): number[]
// 	{
// 		return [this.longitude, this.latitude]; //need to be reversed for some reason
// 	}

// 	//unique key
// 	public print(): string
// 	{
// 		return this.trackNameObj.print() + this.state + this.trackType;
// 	}

// 	//more to come...
// }

//TODO: can this be removed?
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
  public flips: Flip_old[];
  // public notableCrashes: ; //TODO

  constructor(trackName: TrackName, date: Date | string, classes: string, flips: Flip_old[])
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

		const flips: Flip_old[] = Flip_old.makeFlipObjectsFromJson(jsonFlipsRaw);

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

export class Flip_old
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

	public static makeFlipObjectsFromJson(flipJson: any): Flip_old[]
	{
		if (flipJson === undefined)
		{
			return [];
		}

		const flips: Flip_old[] = [];
		flipJson.forEach((flipObj: any) => {

			const nameRaw = flipObj["trackNameObj"];
			const newTrackName: TrackName = new TrackName(
				nameRaw["baseName"], 
				nameRaw["configuration"], 
				nameRaw["isConfiguration"]
			);

			flips.push(new Flip_old(
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

//TODO: figure out how to keep these in sync without copy/paste server to client

// export type TrackDbObj = { 
//   track_id: number,
//   name: string,
//   state: string,
//   city: string,
//   surface: string,
//   length: number | null,
//   type: string,
//   parent_track_id: number | null,
//   ordernum: number | null,
//   latitude: number | null, //TODO: how does this deal with negative numbers?
//   longitude: number | null,
//   recap: string | null
// };

export class Track
{
	public track_id: number;
  public name: string;
  public state: string;
  public city: string;
  public surface: string;
  public length: number | null;
  public type: string;
  public parent_track_id: number | null;
  public ordernum: number | null;
  public latitude: number | null; //TODO: how does this deal with negative numbers?
  public longitude: number | null;
  public recap: string | null;

	public constructor(track_id: number, name: string, state: string, city: string, surface: string,
		length: number | null, type: string, parent_track_id: number | null, ordernum: number | null,
		latitude: number | null, longitude: number | null, recap: string | null)
	{
		this.track_id = track_id;
		this.name = name;
		this.state = state;
		this.city = city;
		this.surface = surface;
		this.length = length;
		this.type = type;
		this.parent_track_id = parent_track_id;
		this.ordernum = ordernum;
		this.latitude = latitude;
		this.longitude = longitude;
		this.recap = recap;
	}

	public static fromJson(json: any): Track
	{
		return new Track(json['track_id'], json['name'], json['state'], json['city'], json['surface'], 
			json['length'], json['type'], json['parent_track_id'], json['ordernum'], json['latitude'], 
			json['longitude'], json['recap']);
	}
}

// export type Race = {
//   race_id: number,
//   track_id: number,
//   date: Date,
//   event_name: string | null,
//   classes: string
// }

export class Race
{
	public race_id: number;
	public track_id: number;
	public date: Date;
	public event_name: string | null;
	public classes: string;

	public constructor(race_id: number, track_id: number, date: Date, event_name: string | null, classes: string)
	{
		this.race_id = race_id;
		this.track_id = track_id;
		this.date = date;
		this.event_name = event_name;
		this.classes = classes;
	}

	public static fromJson(json: any): Race
	{
		return new Race(json['race_id'], json['track_id'], json['date'], json['event_name'], json['classes']);
	}
}

export class Flip
{
	public flip_id: number;
	public race_id: number;
	public classStr: string;
	public rotations: string | null;
	public notes: string | null;
	public fullfender: boolean;
	public occurred: string;
	public video: boolean | null;
	public didnotsee: boolean | null;

	public constructor(flip_id: number, race_id: number, classStr: string, rotations: string | null,
		notes: string | null, fullfender: boolean, occurred: string, video: boolean | null, 
		didnotsee: boolean | null)
	{
		this.flip_id = flip_id;
		this.race_id = race_id;
		this.classStr = classStr;
		this.rotations = rotations;
		this.notes = notes;
		this.fullfender = fullfender;
		this.occurred = occurred;
		this.video = video;
		this.didnotsee = didnotsee;
	}

	public static fromJson(json: any): Flip
	{
		return new Flip(json['flip_id'], json['race_id'], json['class'], json['rotations'], json['notes'], json['fullfender'], json['occurred'], json['video'], json['didnotsee']);
	}
}


export type BasicStats = {
  total_races: number,
  total_facilities: number,
  countable_tracks: number,
  total_days: number,
  states: StateStats[]
}

export type StateStats = {
  state: string,
  facilities: number,
  configs: number
}