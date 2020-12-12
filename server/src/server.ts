import express from "express";
import path from 'path';
import {Parser} from './parser';
// import utilities from './utilities';

const app = express();

const parser: Parser = new Parser();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

const TRACK_ORDER_HEADER = "Track Order"; //track order sheet, the main reference for each track
const RACES_HEADER = "Races";

export function getTrackNameAndConfiguration(rawName: string)
{
	let trackName = rawName.trim();

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

	return {trackName, configuration, isConfiguration};
}

//gets list of all the tracks (configurations are sent as separate tracks)
async function getTrackList(): Promise<any>
{
  // const json = await parser.parse()
  // let trackList = Object.keys(json[TRACK_ORDER_HEADER]) //tested and appears to work

	// return trackList
	return [];
}

async function getTrackListNoConfigurations()
{
	const list = await getTrackList();
	
	const filteredList = [];
	for (let i = 0; i < list.length; i++)
	{
		const track = list[i];
		if (track.match(/\(.*\)/) == null)
		{
			filteredList.push(track);
		}
	};
	return filteredList;
}

async function getTrackFullInfo(): Promise<any>
{
	const json = await parser.parse();
	const tracksList = await getTrackList();

	let tracksAndCoords: any = {};
	for (let i = 0; i < tracksList.length; i++)
	{
		const track = tracksList[i];
		const trackInfo = json[TRACK_ORDER_HEADER][track];
		const count = await getCountForTrack(track);
		const flips = await getFlipsForTrack(track);
		tracksAndCoords[track] = {
			"state": trackInfo["State"], 
			"latitude": trackInfo["Latitude"], 
			"longitude": trackInfo["Longitude"],
			"count": count,
			"flips": flips,
			"trackType": trackInfo["Type"]
		};
	}
	return tracksAndCoords
}

async function getCountForTrack(rawName: string)
{
	let json = await parser.parse();
	json = json[RACES_HEADER];

	const {trackName, configuration, isConfiguration} = getTrackNameAndConfiguration(rawName);

	// const trackList = await getTrackList()

	let count = 0;
	let i = 0;
	while (true)
	{
		const jsonRowHeader = "Races: " + i;
		const raceRow = json[jsonRowHeader];
		if (raceRow === undefined)
		{
			break;
		}

		//TODO: consolidate with getEventsForTrack, some property bag thing
		if (raceRow[trackName] != null)
		{
			if (isConfiguration)
			{
				//need to look into the specifics and see if there configuration is in brackets at the end
				if (raceRow[trackName].includes(configuration))
				{
					count++
				}
			}
			else
			{
				count++;
			}
		}
		i++;
	}

	return count;
}

//returns only the event string as stored in the json
async function getEventStringsForTrack(rawName: string)
{
	let json = await parser.parse();
	json = json[RACES_HEADER];
	const {trackName, configuration, isConfiguration} = getTrackNameAndConfiguration(rawName);
	const events = [];

	let i = 0;
	while (true)
	{
		const jsonRowHeader = "Races: " + i;
		const raceRow = json[jsonRowHeader];
		if (raceRow === undefined)
		{
			break;
		}
		

		//TODO: look at configurations
		const event = raceRow[trackName];
		if (event != null)
		{
			if (isConfiguration)
			{
				if (event.includes(configuration))
				{
					events.push(event);
				}
			}
			else //not a configuration, add all
			{
				events.push(event);
			}
		}
		i++;
	}

	return events;
}

async function getFlipsForTrack(rawName: string)
{
	const flipDataAllTracks = await parser.flipsData();
	return flipDataAllTracks[rawName];
}

function getDateFromFlip(flip: any) //TODO
{
	return new Date(flip.date);
}

async function getFlipsForEvent(trackName: string, date: Date)
{
	const dateObj = new Date(date);
	const flipsForTrack = await getFlipsForTrack(trackName); //TODO: inefficient

	const flipsForEvent = flipsForTrack.filter((flip: any) => {
		return getDateFromFlip(flip).getTime() === dateObj.getTime();
	});

	return flipsForEvent;
}

function getDateFromEventString(eventString: string)
{
	let dateRaw = eventString.split(":")[0];
	// return utilities.cleanDate(dateRaw);
	return new Date(dateRaw);
}

async function makeEnrichedEventInfoHelper(eventString: string, trackName: string, dateObj: Date)
{
	if (eventString === undefined)
	{
		throw Error("Event for track " + trackName + " on date " + dateObj + " cannot be found");
	}

	const flipsForEvent = await getFlipsForEvent(trackName, dateObj)

	const classes = eventString.substring(eventString.indexOf(":") + 2);

	const eventInfoObj = {};
	// eventInfoObj["date"] = dateObj;
	// eventInfoObj["classes"] = classes;
	// eventInfoObj["flips"] = flipsForEvent;
	//TODO: notable crashes

	return eventInfoObj;
}

//returns { date: string , classes: string , flips: [flip] , notableCrashes: ?? }
async function getEnrichedEventInfoForDate(trackName: string, date: string)
{
	//TODO: deal with invalid dates that come from old events where I don't know the date
	const dateObj = new Date(date);
	const eventStrings = await getEventStringsForTrack(trackName); //TODO: inefficient - stop when we find it
	const eventString = eventStrings.find((event) => {
		const eventDate = getDateFromEventString(event);
		return eventDate.getTime() === dateObj.getTime();
	});

	return makeEnrichedEventInfoHelper(eventString, trackName, dateObj);
}

async function getAllEnrichedEventInfosForTrack(trackName: string)
{
	const eventStrings = await getEventStringsForTrack(trackName); //TODO: inefficient - stop when we find it

	const promises = eventStrings.map(async(eventStr) => {
		const date = getDateFromEventString(eventStr);
		// if (date.getTime() != date.getTime()) //getTime is NaN for invalid dates, NaN never equals NaN, so invalid
		// {
		// 	console.error("Invalid date")
		// 	return null;
		// }
		//TODO: error handling for invalid date
		const eventInfo = await getEnrichedEventInfoForDate(trackName, date as any); //TODO
		console.log(eventInfo)
		return eventInfo;
	});

	console.log("starting promises")
	const eventInfos = await Promise.all(promises);
	console.log(eventInfos);
	return eventInfos;
}

async function getBasicStats()
{
	let json = await parser.parse();
	// json = json[RACES_HEADER];


}




//=========================================================================================
//                                     Endpoints
//=========================================================================================

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../react-ui/public')));

//get a list of all the tracks, name only
app.get('/tracks', async function (req, res) {
	console.log("/tracks")
	res.set('Content-Type', 'application/json');

	const tracks = await getTrackList();

	res.json(tracks);
});

//returns a list of all the tracks along with their specific info
app.get('/tracks/info', async function (req, res) {
	console.log("/tracks/info")
	res.set('Content-Type', 'application/json');

	const trackInfos = await getTrackFullInfo();

	res.json(trackInfos);
});

//returns a list of all event strings for a particular track
app.get('/tracks/:trackName/events', async function (req, res) {
	console.log("/tracks/" + req.params.trackName + "/events");
	res.set('Content-Type', 'application/json');

	const events = await getEventStringsForTrack(req.params.trackName);

	res.json(events);
});

//get enriched event details for a track and a date
app.get('/eventDetails/:trackName/:date', async function (req, res) {
	console.log('/events/' + req.params.trackName + '/' + req.params.date);
	res.set('Content-Type', 'application/json');

	const eventInfo = await getEnrichedEventInfoForDate(req.params.track, req.params.date);
	
	res.json(eventInfo);
});

//get enriched event details for all events for a track
app.get('/eventDetails/:trackName', async function (req, res) {
	console.log('/eventsDetails/' + req.params.trackName);
	res.set('Content-Type', 'application/json');

	const eventInfos = await getAllEnrichedEventInfosForTrack(req.params.trackName);
	
	res.json(eventInfos);
});

app.get('/numRaces/:trackName/raceCount', async function (req, res) { //TODO: does this still work?
	console.log("/numRaces/" + req.params.trackName + "/raceCount")

	const {trackName, configuration, isConfiguration} = getTrackNameAndConfiguration(req.params.trackName);

	const count = await getCountForTrack(trackName) //, configuration, isConfiguration);

	res.set('Content-Type', 'application/json');
	res.json({"message": count});
});

app.get('/stats', async function (req, res) {
	console.log("/stats");

	const stats = await getBasicStats();

	res.set('Content-Type', 'application/json');
	res.json(stats);
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Listening on ${port}`);


//exports for testing
// exports.getCountForTrack = getCountForTrack;
// exports.getTrackNameAndConfiguration = getTrackNameAndConfiguration;
// exports.getTrackFullInfo = getTrackFullInfo;
// exports.getFlipsForTrack = getFlipsForTrack;
// exports.getTrackList = getTrackList;
// exports.getTrackListNoConfigurations = getTrackListNoConfigurations;
// exports.getEventStringsForTrack = getEventStringsForTrack;
// exports.getEnrichedEventInfoForDate = getEnrichedEventInfoForDate;
// exports.getAllEnrichedEventInfosForTrack = getAllEnrichedEventInfosForTrack;
// exports.getDateFromEventString = getDateFromEventString;


//TODO: do we even need stats to be sent from the server? There's no unique info on that page

//TODO: flips need to include their configuration
