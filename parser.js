const path = require('path');
var fs = require('fs');

const FLIPS_HEADER = "Flips";
const DATA_PATH = "events_data.json";
const TEST_DATA_PATH = "events_data_test.json";
const STATS_HEADER = "Stats";

let parsedJson = null;
let _flipsData = null; // {name : [ date, track, class, rotations, surface, open wheel, when, video, notes ] }

function runningJestTest() 
{
	return process.env.JEST_WORKER_ID !== undefined;
}

function dataPath()
{
	return runningJestTest() ? TEST_DATA_PATH : DATA_PATH;
}

async function flipsData()
{
	if (_flipsData == null)
	{
		await parse();
	}
	return _flipsData;
}

//Flips are keyed by date as they come from json, so we need to rearrange to key by track
//Should only be called from parse()
async function makeFlipsData(json)
{
	if (this._flipsData != null)
	{
		return _flipsData;
	}
	
	flipsJson = json[FLIPS_HEADER];
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

		if (flips[trackName] === undefined)
		{
			flips[trackName] = [newObjToAdd];
		}
		else
		{
			flips[trackName].push(newObjToAdd);
		}
	});

	_flipsData = flips
}

async function parse()
{
	if (parsedJson == null)
	{
		 //take the json downloaded from google sheets in json format and parse it
		
		var data=fs.readFileSync(path.resolve(__dirname, dataPath()), 'utf8');
		var json=JSON.parse(data);

		await makeFlipsData(json);
		parsedJson = json
	}
	return parsedJson;
}

async function getQuickStats()
{
	const json = await parser.parse();
	const statsJson = json[STATS_HEADER];

	console.log(statsJson);
}

exports.parse = parse;
exports.flipsData = flipsData;
exports.TESTPIN_parse = parse; //for testing only
exports.getQuickStats = getQuickStats;
