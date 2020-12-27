import express from "express";
import path from 'path';
import { ServerApp } from "./app";
import { EventObj, TrackName } from "./Types";

// const server: ServerApp = new ServerApp();
const app = express();

//=========================================================================================
//                                     Endpoints
//=========================================================================================

// Priority serve any static files.
// app.use(express.static(path.resolve(__dirname, '../react-ui/public'))); //I don't know what this is

//get a list of all the tracks, name only
app.get('/tracks', async function (req, res) {
	console.log("/tracks")
	res.set('Content-Type', 'application/json');

	const tracks = await ServerApp.getTrackList();

	res.json(tracks);
});

//returns a list of all the tracks along with their specific info
app.get('/tracks/info', async function (req, res) {
	console.log("/tracks/info")
	res.set('Content-Type', 'application/json');

	const trackInfos = await ServerApp.getTrackFullInfo();

	res.json(trackInfos);
});

//returns a list of all event strings for a particular track
app.get('/tracks/:trackName/events', async function (req, res) {
	console.log("/tracks/" + req.params.trackName + "/events");
	res.set('Content-Type', 'application/json');

	const trackNameObj: TrackName = TrackName.parse(req.params.trackName);
	const events = await ServerApp.getEventStringsForTrack(trackNameObj);

	res.json(events);
});

//get enriched event details for a track and a date
app.get('/eventDetails/:trackName/:date', async function (req, res) {
	console.log('/events/' + req.params.trackName + '/' + req.params.date);
	res.set('Content-Type', 'application/json');

	const trackNameObj: TrackName = TrackName.parse(req.params.trackName);
	const eventInfo = await ServerApp.getEnrichedEventInfoForDate(trackNameObj, req.params.date);
	
	res.json(eventInfo);
});

//get enriched event details for all events for a track
app.get('/eventDetails/:trackName', async function (req, res) {
	console.log('/eventsDetails/' + req.params.trackName);
	res.set('Content-Type', 'application/json');

	const trackNameObj: TrackName = TrackName.parse(req.params.trackName);
	const eventInfos = await ServerApp.getAllEnrichedEventInfosForTrack(trackNameObj);
	
	res.json(eventInfos);
});

app.get('/numRaces/:trackName/raceCount', async function (req, res) { //TODO: does this still work?
	console.log("/numRaces/" + req.params.trackName + "/raceCount")

	const trackNameObj: TrackName = TrackName.parse(req.params.trackName);
	const count = await ServerApp.getCountForTrack(trackNameObj);

	res.set('Content-Type', 'application/json');
	res.json({"message": count});
});

app.get('/stats', async function (req, res) {
	console.log("/stats");

	const stats = await ServerApp.getBasicStats();

	res.set('Content-Type', 'application/json');
	res.json(stats);
});

//returns the events with recaps
app.get('/recaps', async function (req, res) {
	console.log("/recaps");

	const recaps: EventObj[] = await ServerApp.getEventsWithRecaps();

	res.set('Content-Type', 'application/json');
	res.json(recaps);
});

app.get('/recap/:date/:trackName', async function (req, res) {
	console.log(`/recap/${req.params.date}/${req.params.trackName}`);

	const trackNameObj: TrackName = TrackName.parse(req.params.trackName);
	const recaps: string | null = await ServerApp.getSpecificEventRecap(req.params.date, trackNameObj);

	res.set('Content-Type', 'application/json');
	res.json({"recap": recaps});
});


//Don't touch the following - Heroku gets very finnicky about it

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

const root = path.join(__dirname, '..', 'client', 'build')
app.use(express.static(root));
app.get("*", (req, res) => {
    res.sendFile('index.html', { root });
})

const port = process.env.PORT || 5000;
// app.listen(port, () => {
// 	console.log(`server started on port ${port}`)
// });
app.listen(port);
console.log(`server started on port ${port}`);


//TODO: do we even need stats to be sent from the server? There's no unique info on that page
