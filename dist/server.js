"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const app_1 = require("./app");
const Types_1 = require("./Types");
// const server: ServerApp = new ServerApp();
const app = express_1.default();
//=========================================================================================
//                                     Endpoints
//=========================================================================================
// Priority serve any static files.
// app.use(express.static(path.resolve(__dirname, '../react-ui/public'))); //I don't know what this is
//get a list of all the tracks, name only
app.get('/tracks', async function (req, res) {
    console.log("/tracks");
    res.set('Content-Type', 'application/json');
    const tracks = await app_1.ServerApp.getTrackList();
    res.json(tracks);
});
//returns a list of all the tracks along with their specific info
app.get('/tracks/info', async function (req, res) {
    console.log("/tracks/info");
    res.set('Content-Type', 'application/json');
    const trackInfos = await app_1.ServerApp.getTrackFullInfo();
    res.json(trackInfos);
});
//returns a list of all event strings for a particular track
app.get('/tracks/:trackName/events', async function (req, res) {
    console.log("/tracks/" + req.params.trackName + "/events");
    res.set('Content-Type', 'application/json');
    const trackNameObj = Types_1.TrackName.parse(req.params.trackName);
    const events = await app_1.ServerApp.getEventStringsForTrack(trackNameObj);
    res.json(events);
});
//get enriched event details for a track and a date
app.get('/eventDetails/:trackName/:date', async function (req, res) {
    console.log('/events/' + req.params.trackName + '/' + req.params.date);
    res.set('Content-Type', 'application/json');
    const trackNameObj = Types_1.TrackName.parse(req.params.trackName);
    const eventInfo = await app_1.ServerApp.getEnrichedEventInfoForDate(trackNameObj, req.params.date);
    res.json(eventInfo);
});
//get enriched event details for all events for a track
app.get('/eventDetails/:trackName', async function (req, res) {
    console.log('/eventsDetails/' + req.params.trackName);
    res.set('Content-Type', 'application/json');
    const trackNameObj = Types_1.TrackName.parse(req.params.trackName);
    const eventInfos = await app_1.ServerApp.getAllEnrichedEventInfosForTrack(trackNameObj);
    res.json(eventInfos);
});
app.get('/numRaces/:trackName/raceCount', async function (req, res) {
    console.log("/numRaces/" + req.params.trackName + "/raceCount");
    const trackNameObj = Types_1.TrackName.parse(req.params.trackName);
    const count = await app_1.ServerApp.getCountForTrack(trackNameObj);
    res.set('Content-Type', 'application/json');
    res.json({ "message": count });
});
app.get('/stats', async function (req, res) {
    console.log("/stats");
    const stats = await app_1.ServerApp.getBasicStats();
    res.set('Content-Type', 'application/json');
    res.json(stats);
});
//returns the events with recaps
app.get('/recaps', async function (req, res) {
    console.log("/recaps");
    const recaps = await app_1.ServerApp.getEventsWithRecaps();
    res.set('Content-Type', 'application/json');
    res.json(recaps);
});
app.get('/recap/:date/:trackName', async function (req, res) {
    console.log(`/recap/${req.params.date}/${req.params.trackName}`);
    const trackNameObj = Types_1.TrackName.parse(req.params.trackName);
    const recaps = await app_1.ServerApp.getSpecificEventRecap(req.params.date, trackNameObj);
    res.set('Content-Type', 'application/json');
    res.json({ "recap": recaps });
});
app.get('/tracks/trackObjForName/:trackNameStr', async function (req, res) {
    console.log(`/tracks/trackObjForName/${req.params.trackNameStr}`);
    const trackName = Types_1.TrackName.parse(req.params.trackNameStr);
    const trackObj = await app_1.ServerApp.getTrackObjForName(trackName);
    res.set('Content-Type', 'application/json');
    res.json(trackObj);
});
//Don't touch the following - Heroku gets very finnicky about it
// Serve static files from the React app
app.use(express_1.default.static(path_1.default.join(__dirname, 'client/build')));
const root = path_1.default.join(__dirname, '..', 'client', 'build');
app.use(express_1.default.static(root));
app.get("*", (req, res) => {
    res.sendFile('index.html', { root });
});
const port = process.env.PORT || 5000;
// app.listen(port, () => {
// 	console.log(`server started on port ${port}`)
// });
app.listen(port);
console.log(`server started on port ${port}`);
//TODO: do we even need stats to be sent from the server? There's no unique info on that page
//# sourceMappingURL=server.js.map