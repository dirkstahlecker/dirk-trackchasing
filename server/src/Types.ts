export type Flip = {flipId: string; trackNameObj: TrackName; date: Date; class: string; rotations: string; 
  surface: string; openWheel: boolean; when: string; video: boolean; notes: string};

export type EventInfo = {date: Date; classes: string; flips: Flip[]}

//use this instead of passing around raw string track names
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

  public static parse(rawNameString: string)
  {
    let trackName = rawNameString.trim();

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