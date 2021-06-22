import { Race, Track } from './Types';

/**
 * Make all server calls through here so everything is easy to track down and all the types are correct
 */
export abstract class API
{
  public static async fetchAllTracks(): Promise<Track[]>
  {
    const tracksRaw = await fetch(`/tracks`);
    const tracksJson = await tracksRaw.json();

    const tracks: Track[] = [];
		tracksJson.forEach((trackInfo: any) => {
      tracks.push(Track.fromJson(trackInfo));
		});

    return tracks;
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
}
