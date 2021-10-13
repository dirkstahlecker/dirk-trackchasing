import { Flip, Race, Track } from './Types';

/**
 * Make all server calls through here so everything is easy to track down and all the types are correct
 */
export abstract class API
{
  private static tracksJsonToTracks(tracksJson: any): Track[]
  {
    if (this.tracksJsonToTracks === null)
    {
      return [];
    }

    const tracks: Track[] = [];
		tracksJson.forEach((trackInfo: any) => {
      tracks.push(Track.fromJson(trackInfo));
		});

    return tracks;
  }

  public static async fetchAllTracks(): Promise<Track[]>
  {
    const tracksRaw = await fetch(`/tracks`);
    const tracksJson = await tracksRaw.json();
    return this.tracksJsonToTracks(tracksJson);
  }

	public static async fetchAllRaces(trackId: number): Promise<Race[]>
	{
		const racesRaw = await fetch(`/tracks/${trackId}/races`);
		const racesJson = await racesRaw.json();

    const races: Race[] = [];
		racesJson.forEach((raceInfo: any) => {
      races.push(Race.fromJson(raceInfo));
		});

    return races;
	}

  public static async fetchAllFlips(trackId: number): Promise<Flip[]>
  {
    const flipsRaw = await fetch(`/tracks/${trackId}/flips`);
    const flipsJson = await flipsRaw.json();

    const flips: Flip[] = [];
    flipsJson.forEach((flipInfo: any) => {
      flips.push(Flip.fromJson(flipInfo));
    });

    return flips;
  }

  /**
   * null if no configurations
   * @param trackId 
   */
  public static async fetchConfigsForTrack(trackId: number): Promise<Track[]>
  {
    const configsRaw = await fetch(`/tracks/${trackId}/configurations`);
    const configsJson = await configsRaw.json();
    return this.tracksJsonToTracks(configsJson);
  }

  public static async firstRacesAtEachTrack(): Promise<{track_id: number, date: Date}[]>
  {
    const firstRacesRaw = await fetch('/firstRaceEachTrack');
    const firstRacesJson: {track_id: number, date: Date}[] = await firstRacesRaw.json();

    const firstRaces: {track_id: number, date: Date}[] = [];
    for (let i in firstRacesJson)
    {
      const obj = firstRacesJson[i];
      firstRaces.push({track_id: obj.track_id, date: new Date(obj.date)})
    }
    return firstRaces;
  }
}
