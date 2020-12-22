"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = exports.makeDate = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const eventRecaps_1 = require("./eventRecaps");
const parser_1 = require("./parser");
const Types_1 = require("./Types");
const TRACK_ORDER_HEADER = "Track Order"; //track order sheet, the main reference for each track
const RACES_HEADER = "Races";
function makeDate(input) {
    if (input instanceof Date) {
        const d = new Date(Date.UTC(input.getFullYear(), input.getMonth(), input.getUTCDate()));
        return d;
    }
    const d = new Date(Date.parse(input));
    const fixedDate = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getUTCDate()));
    return fixedDate;
}
exports.makeDate = makeDate;
class Server {
    //gets list of all the tracks (configurations are sent as separate tracks)
    async getTrackList() {
        const json = await parser_1.Parser.parse();
        let trackList = Object.keys(json[TRACK_ORDER_HEADER]); //tested and appears to work
        return trackList;
    }
    async getTrackListNoConfigurations() {
        const list = await this.getTrackList();
        const filteredList = [];
        for (let i = 0; i < list.length; i++) {
            const track = list[i];
            if (track.match(/\(.*\)/) == null) {
                filteredList.push(track);
            }
        }
        ;
        return filteredList;
    }
    static getTrackTypeEnumForString(typeStr) {
        switch (typeStr) {
            case "Oval":
                return Types_1.TrackTypeEnum.OVAL;
            case "Figure 8":
                return Types_1.TrackTypeEnum.FIGURE_8;
            case "Road Course":
                return Types_1.TrackTypeEnum.ROAD_COURSE;
            default:
                throw new Error("Invalid type string " + typeStr + "; cannot convert to TrackTypeEnum");
        }
    }
    async getTrackFullInfo() {
        const json = await parser_1.Parser.parse();
        const tracksList = await this.getTrackList();
        let tracksAndCoords = [];
        for (let i = 0; i < tracksList.length; i++) {
            const trackRaw = tracksList[i];
            const trackNameObj = Types_1.TrackName.parse(trackRaw);
            const trackInfo = json[TRACK_ORDER_HEADER][trackRaw]; //TODO: improve this
            const count = await this.getCountForTrack(trackNameObj);
            const flips = await this.getFlipsForTrack(trackNameObj);
            const trackType = Server.getTrackTypeEnumForString(trackInfo["Type"]);
            const newTrackInfo = new Types_1.Track(trackNameObj, trackInfo["State"], trackType, trackInfo["Latitude"], trackInfo["Longitude"], count, flips);
            tracksAndCoords.push(newTrackInfo);
        }
        return tracksAndCoords;
    }
    async getCountForTrack(trackNameObj) {
        let json = await parser_1.Parser.parse();
        json = json[RACES_HEADER];
        let count = 0;
        let i = 0;
        while (true) {
            const jsonRowHeader = "Races: " + i;
            const raceRow = json[jsonRowHeader];
            if (raceRow === undefined) {
                break;
            }
            //TODO: consolidate with getEventsForTrack, some property bag thing
            if (raceRow[trackNameObj.baseName] != null) {
                if (trackNameObj.isConfiguration) {
                    //need to look into the specifics and see if there configuration is in brackets at the end
                    if (raceRow[trackNameObj.baseName].includes(trackNameObj.configuration)) {
                        count++;
                    }
                }
                else {
                    count++;
                }
            }
            i++;
        }
        return count;
    }
    //returns only the event string as stored in the json
    async getEventStringsForTrack(trackNameObj) {
        let json = await parser_1.Parser.parse();
        json = json[RACES_HEADER];
        const events = [];
        let i = 0;
        while (true) {
            const jsonRowHeader = "Races: " + i;
            const raceRow = json[jsonRowHeader];
            if (raceRow === undefined) {
                break;
            }
            const event = raceRow[trackNameObj.baseName];
            if (event != null) {
                if (trackNameObj.isConfiguration) {
                    if (event.includes(trackNameObj.configuration)) {
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
    async getFlipsForTrack(trackNameObj) {
        const flipDataAllTracks = await parser_1.Parser.flipsData();
        const foundFlips = flipDataAllTracks.filter((flip) => {
            return Types_1.TrackName.equals(flip.trackNameObj, trackNameObj);
        });
        return foundFlips;
    }
    getDateFromFlip(flip) {
        return makeDate(flip.date);
    }
    async getFlipsForEvent(trackNameObj, date) {
        const dateObj = makeDate(date);
        const flipsForTrack = await this.getFlipsForTrack(trackNameObj); //TODO: inefficient
        const flipsForEvent = flipsForTrack.filter((flip) => {
            return this.getDateFromFlip(flip).getTime() === dateObj.getTime();
        });
        return flipsForEvent;
    }
    getDateFromEventString(eventString) {
        let dateRaw = eventString.split(":")[0];
        // return utilities.cleanDate(dateRaw);
        // return new Date(new Date(dateRaw).getTime());
        return makeDate(dateRaw);
    }
    async makeEnrichedEventInfoHelper(eventString, trackNameObj, dateObj) {
        if (eventString === undefined) {
            throw Error("Event for track " + trackNameObj.baseName + " on date " + dateObj + " cannot be found");
        }
        const flipsForEvent = await this.getFlipsForEvent(trackNameObj, dateObj);
        const classes = eventString.substring(eventString.indexOf(":") + 2);
        const eventInfoObj = {
            date: dateObj,
            classes: classes,
            flips: flipsForEvent
        };
        //TODO: notable crashes
        return eventInfoObj;
    }
    //events are based on base name, and may or may not have a configuration
    async getEnrichedEventInfoForDate(trackNameObj, date) {
        let dateObj;
        if (date instanceof Date) {
            dateObj = date;
        }
        else {
            dateObj = makeDate(date);
        }
        //TODO: deal with invalid dates that come from old events where I don't know the date
        const eventStrings = await this.getEventStringsForTrack(trackNameObj); //TODO: inefficient - stop when we find it
        const eventString = eventStrings.find((event) => {
            const eventDate = this.getDateFromEventString(event);
            return eventDate.getTime() === dateObj.getTime();
        });
        return this.makeEnrichedEventInfoHelper(eventString, trackNameObj, dateObj);
    }
    async getAllEnrichedEventInfosForTrack(trackNameObj) {
        const eventStrings = await this.getEventStringsForTrack(trackNameObj); //TODO: inefficient - stop when we find it
        const promises = eventStrings.map(async (eventStr) => {
            const date = this.getDateFromEventString(eventStr);
            // if (date.getTime() != date.getTime()) //getTime is NaN for invalid dates, NaN never equals NaN, so invalid
            // {
            // 	console.error("Invalid date")
            // 	return null;
            // }
            //TODO: error handling for invalid date
            const eventInfo = await this.getEnrichedEventInfoForDate(trackNameObj, date);
            return eventInfo;
        });
        const eventInfos = await Promise.all(promises);
        return eventInfos;
    }
    async getBasicStats() {
        let json = await parser_1.Parser.parse();
        // json = json[RACES_HEADER];
        return "Stats not implemented";
    }
    async getEventRecaps() {
        await eventRecaps_1.EventRecaps.parse();
        // return EventRecaps.
        return "Not Implemented";
    }
}
exports.Server = Server;
const server = new Server();
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
    const tracks = await server.getTrackList();
    res.json(tracks);
});
//returns a list of all the tracks along with their specific info
app.get('/tracks/info', async function (req, res) {
    console.log("/tracks/info");
    res.set('Content-Type', 'application/json');
    const trackInfos = await server.getTrackFullInfo();
    res.json(trackInfos);
});
//returns a list of all event strings for a particular track
app.get('/tracks/:trackName/events', async function (req, res) {
    console.log("/tracks/" + req.params.trackName + "/events");
    res.set('Content-Type', 'application/json');
    const trackNameObj = Types_1.TrackName.parse(req.params.trackName);
    const events = await server.getEventStringsForTrack(trackNameObj);
    res.json(events);
});
//get enriched event details for a track and a date
app.get('/eventDetails/:trackName/:date', async function (req, res) {
    console.log('/events/' + req.params.trackName + '/' + req.params.date);
    res.set('Content-Type', 'application/json');
    const trackNameObj = Types_1.TrackName.parse(req.params.trackName);
    const eventInfo = await server.getEnrichedEventInfoForDate(trackNameObj, req.params.date);
    res.json(eventInfo);
});
//get enriched event details for all events for a track
app.get('/eventDetails/:trackName', async function (req, res) {
    console.log('/eventsDetails/' + req.params.trackName);
    res.set('Content-Type', 'application/json');
    const trackNameObj = Types_1.TrackName.parse(req.params.trackName);
    const eventInfos = await server.getAllEnrichedEventInfosForTrack(trackNameObj);
    res.json(eventInfos);
});
app.get('/numRaces/:trackName/raceCount', async function (req, res) {
    console.log("/numRaces/" + req.params.trackName + "/raceCount");
    const trackNameObj = Types_1.TrackName.parse(req.params.trackName);
    const count = await server.getCountForTrack(trackNameObj);
    res.set('Content-Type', 'application/json');
    res.json({ "message": count });
});
app.get('/stats', async function (req, res) {
    console.log("/stats");
    const stats = await server.getBasicStats();
    res.set('Content-Type', 'application/json');
    res.json(stats);
});
app.get('/recaps', async function (req, res) {
    console.log("/recaps");
    const recaps = await server.getEventRecaps();
    res.set('Content-Type', 'application/json');
    res.json({ "recaps": recaps });
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