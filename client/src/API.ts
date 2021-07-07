import { Flip_old, Race, Track } from './Types';

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

  public static async fetchAllFlips(trackId: number): Promise<Flip_old[]>
  {
    const flipsRaw = await fetch(`/tracks/${trackId}/flips`);
    const flipsJson = await flipsRaw.json();

    const flips: Flip_old[] = [];
    flipsJson.forEach((flipInfo: any) => {
      flips.push(Flip_old.fromJson(flipInfo));
    });
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
}
