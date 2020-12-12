import path from 'path';
var fs = require('fs');

let parsedJson: any = null;
let _flipsData: any = null; // {name : [ date, track, class, rotations, surface, open wheel, when, video, notes ] }

const FLIPS_HEADER = "Flips";
const DATA_PATH = "events_data.json";
const TEST_DATA_PATH = "events_data_test.json";
const STATS_HEADER = "Stats";

export class Parser
{
	private runningJestTest() 
	{
		return process.env.JEST_WORKER_ID !== undefined;
	}

	private dataPath()
	{
		return this.runningJestTest() ? TEST_DATA_PATH : DATA_PATH;
	}

	public async flipsData()
	{
		if (_flipsData == null)
		{
			await this.parse();
		}
		return _flipsData;
	}

	//Flips are keyed by date as they come from json, so we need to rearrange to key by track
	//Should only be called from parse()
	public async makeFlipsData(json: any)
	{
		if (_flipsData != null)
		{
			return _flipsData;
		}
		
		const flipsJson = json[FLIPS_HEADER];
		const flips = {};
		Object.keys(flipsJson).forEach((flipId) => {
			const flipInfo = flipsJson[flipId];
			const trackName = flipInfo["Track"];
			let openWheel = false;
			if (flipInfo["Open Wheel"])
			{
				openWheel = true;
			}
			const newObjToAdd = {
				"flipId": flipId,
				"date": new Date(flipInfo["Date"]), 
				"class": flipInfo["Class"], 
				"rotations": flipInfo["Rotations"], 
				"surface": flipInfo["Surface"],
				"openWheel": openWheel,
				"when": flipInfo["When"],
				"video": flipInfo["Video"],
				"notes": flipInfo["Notes"]
			}

			// if (flips[trackName] === undefined)
			// {
			// 	flips[trackName] = [newObjToAdd];
			// }
			// else
			// {
			// 	flips[trackName].push(newObjToAdd);
			// }
		});

		_flipsData = flips
	}

	public async parse()
	{
		if (parsedJson == null)
		{
			//take the json downloaded from google sheets in json format and parse it
			
			var data=fs.readFileSync(path.resolve(__dirname, this.dataPath()), 'utf8');
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



// exports.parse = parse;
// exports.flipsData = flipsData;
// exports.TESTPIN_parse = parse; //for testing only
// exports.getQuickStats = getQuickStats;
