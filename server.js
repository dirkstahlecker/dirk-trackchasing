const express = require('express');
const path = require('path');
const parser = require('./parser');

const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

const TRACK_ORDER_HEADER = "Track Order"; //track order sheet, the main reference for each track
const RACES_HEADER = "Races";

function getTrackNameAndConfiguration(rawName)
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

async function getTrackList()
{
  const json = await parser.parse()
  let trackList = Object.keys(json[TRACK_ORDER_HEADER]) //tested and appears to work

  return trackList
}

async function getTrackFullInfo()
{
	const json = await parser.parse();
	const tracksList = await getTrackList();

	let tracksAndCoords = {};
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

async function getCountForTrack(rawName)
{
	let json = await parser.parse();
	json = json[RACES_HEADER];

	const {trackName, configuration, isConfiguration} = getTrackNameAndConfiguration(rawName);

	const trackList = await getTrackList()

	let count = 0;
	for (let i = 0; i < trackList.length; i++)
	{
		const jsonRowHeader = "Races: " + i;
		const raceRow = json[jsonRowHeader];
		if (raceRow !== undefined)
		{
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
		}
	}

	return count;
}

async function getFlipsForTrack(rawName)
{
	const flipData = await parser.flipsData();
	return flipData[rawName];
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
})

app.get('/numRaces/:trackName/raceCount', async function (req, res) { //TODO: does this still work?
	console.log("/numRaces")

	const {trackName, configuration, isConfiguration} = getTrackNameAndConfiguration(req.params.trackName);

	console.log("Track name: " + trackName);
	console.log("Configuration: " + configuration);
	
	const count = await getCountForTrack(trackName, configuration, isConfiguration);

	res.set('Content-Type', 'application/json');
	res.json({"message": count});
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
exports.getCountForTrack = getCountForTrack;
exports.getTrackNameAndConfiguration = getTrackNameAndConfiguration;
exports.getTrackFullInfo = getTrackFullInfo;
exports.getFlipsForTrack = getFlipsForTrack;
exports.getTrackList = getTrackList;