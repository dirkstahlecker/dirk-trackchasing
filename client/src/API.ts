import { Flip, Race, Track } from './Types';

/**
 * Make all server calls through here so everything is easy to track down and all the types are correct
 */
export abstract class API
{
  private static makeNoApiCallsBecauseDbOnHerokuIsBroken: boolean = false;

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
    if (API.makeNoApiCallsBecauseDbOnHerokuIsBroken)
    {
      return Promise.resolve([]);
    }

    const tracksRaw = await fetch(`/tracks`);
    const tracksJson = await tracksRaw.json();
    return this.tracksJsonToTracks(tracksJson);
  }

	public static async fetchAllRaces(trackId: number): Promise<Race[]>
	{
    if (API.makeNoApiCallsBecauseDbOnHerokuIsBroken)
    {
      return Promise.resolve([]);
    }

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
    if (API.makeNoApiCallsBecauseDbOnHerokuIsBroken)
    {
      return Promise.resolve([]);
    }

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
    if (API.makeNoApiCallsBecauseDbOnHerokuIsBroken)
    {
      return Promise.resolve([]);
    }

    const configsRaw = await fetch(`/tracks/${trackId}/configurations`);
    const configsJson = await configsRaw.json();
    return this.tracksJsonToTracks(configsJson);
  }

  public static async firstRacesAtEachTrack(): Promise<{track_id: number, date: Date}[]>
  {
    if (API.makeNoApiCallsBecauseDbOnHerokuIsBroken)
    {
      return Promise.resolve([]);
    }

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

  public static async racesPerYear(year: number): Promise<number>
  {
    if (API.makeNoApiCallsBecauseDbOnHerokuIsBroken)
    {
      return Promise.resolve(0);
    }

    const racesPerYearRaw = await fetch(`/races/perYear/${year}`);
    const racesPerYearJson = await racesPerYearRaw.json();
    return racesPerYearJson;
  }

  public static async fetchMostRecentRace(): Promise<Race | null>
  {
    if (API.makeNoApiCallsBecauseDbOnHerokuIsBroken)
    {
      return Promise.resolve(null);
    }

    const mostRecentRaceRaw = await fetch('/races/mostRecent');
    const mostRecentRaceJson: Race[] = await mostRecentRaceRaw.json();
    return mostRecentRaceJson[0]; //ordered in the query, so first is most recent
  }
}
