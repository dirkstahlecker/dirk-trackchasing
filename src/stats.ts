import {Parser} from "./parser";

const STATS_HEADER = "Stats";

export class Stats
{
  public async getQuickStats()
	{
		const json = await Parser.parse();
		const statsJson = json[STATS_HEADER];

		console.log(statsJson);
	}
}
