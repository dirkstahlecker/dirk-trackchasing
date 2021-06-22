import { Race } from './Types';

/**
 * Make all server calls through here so everything is easy to track down and all the types are correct
 */
export abstract class API
{
	public static async fetchAllRaces(trackId: number): Promise<Race[]>
	{
		const racesRaw = await fetch(`/tracks/${trackId}/races`);
		const racesJson = await racesRaw.json();
    const races: Race[] = [];
		racesJson.forEach((raceInfo: any) => {
      races.push(raceInfo as Race);
		});

    return races;
	}
}
