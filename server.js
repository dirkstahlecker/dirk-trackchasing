const express = require('express');
const path = require('path');

const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

const TRACK_ORDER = "Track Order"; //track order sheet, the main reference for each track
const RACES = "Races";

function getTrackList()
{
  const json = parse()
  let trackList = Object.keys(json[TRACK_ORDER]) //tested and appears to work

  return trackList
}

function getTrackFullInfo()
{
	const json = parse();
	const tracksList = getTrackList();

	let tracksAndCoords = {};
	for (let i = 0; i < tracksList.length; i++)
	{
		const track = tracksList[i];
		const trackInfo = json[TRACK_ORDER][track];
		tracksAndCoords[track] = {"state": trackInfo["State"], "latitude": trackInfo["Latitude"], "longitude": trackInfo["Longitude"]};
	}
	return tracksAndCoords
}

function parse()
{
  //take the json downloaded from google sheets in json format and parse it
  var fs=require('fs');
  var data=fs.readFileSync(path.resolve(__dirname, 'events_data.json'), 'utf8');
  var json=JSON.parse(data);

  return json
}

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../react-ui/public')));

//get a list of all the tracks, name only
app.get('/tracks', function (req, res) {
	console.log("/tracks")
	res.set('Content-Type', 'application/json');

	const tracks = getTrackList();

	res.json(tracks);
});

//returns a list of all the tracks along with their specific info
app.get('/tracks/info', function (req, res) {
	console.log("/tracks/info")
	res.set('Content-Type', 'application/json');

	const trackInfos = getTrackFullInfo();

	res.json(trackInfos);
})

app.get('/numRaces/:trackName', function (req, res) {
	console.log("/numRaces")
	let trackName = req.params.trackName.trim();

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

	console.log("Track name: " + trackName);
	console.log("Configuration: " + configuration);
	
	let json = parse();
	json = json[RACES];

	let count = 0;
	for (let i = 0; i < getTrackList().length; i++)
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
