import { raw } from 'express';
import path from 'path';
import {Flip, TrackName} from "./Types";
var fs = require('fs');

let parsedJson: any = null;
let _flipsData: Flip[] | null = null;

const FLIPS_HEADER = "Flips";
const DATA_PATH = "/../events_data.json";
const TEST_DATA_PATH = "/../events_data_test.json";
const STATS_HEADER = "Stats";

export class Parser
{
	private runningJestTest() 
	{
		return process.env.JEST_WORKER_ID !== undefined;
	}

	private get dataPath(): string
	{
		return this.runningJestTest() ? TEST_DATA_PATH : DATA_PATH;
	}

	public async flipsData(): Promise<Flip[]>
	{
		if (_flipsData == null)
		{
			await this.parse();
		}
		return _flipsData;
	}

	//Flips are keyed by date as they come from json, so we need to rearrange to key by track
	//Should only be called from parse()
	public async makeFlipsData(json: any): Promise<void>
	{
		if (_flipsData != null)
		{
			return; //nothing to do, already built
		}
		
		const flipsJson = json[FLIPS_HEADER];
		const flips: Flip[] = [];
		Object.keys(flipsJson).forEach((flipId) => {
			if (flipId === "") //this can happen since the checkboxes are extended below the end of the flips list
			{
				return; //do nothing
			}

			const flipInfo = flipsJson[flipId];
			const rawTrackStr: string = flipInfo["Track"];
			const trackNameObj: TrackName = TrackName.parse(rawTrackStr); //contains configuration
			let openWheel = false;
			if (flipInfo["Open Wheel"])
			{
				openWheel = true;
			}
			const newObjToAdd: Flip = {
				flipId: flipId,
				trackNameObj: trackNameObj,
				date: new Date(flipInfo["Date"]), 
				carClass: flipInfo["Class"], 
				rotations: flipInfo["Rotations"], 
				surface: flipInfo["Surface"],
				openWheel: openWheel,
				when: flipInfo["When"],
				video: flipInfo["Video"],
				notes: flipInfo["Notes"]
			}

			flips.push(newObjToAdd);
		});

		_flipsData = flips
	}

	public async parse()
	{
		if (parsedJson == null)
		{
			//take the json downloaded from google sheets in json format and parse it
			var data=fs.readFileSync(path.join(__dirname, this.dataPath), 'utf8');
			var json=JSON.parse(data);

			await this.makeFlipsData(json);
			parsedJson = json
		}
		return parsedJson;
	}

	public async getQuickStats()
	{
		const json = await this.parse();
		const statsJson = json[STATS_HEADER];

		console.log(statsJson);
	}
}
