"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var parser_1 = require("./parser");
// import utilities from './utilities';
var Types_1 = require("./Types");
var app = express_1.default();
var parser = new parser_1.Parser();
var TRACK_ORDER_HEADER = "Track Order"; //track order sheet, the main reference for each track
var RACES_HEADER = "Races";
var Server = /** @class */ (function () {
    function Server() {
    }
    //gets list of all the tracks (configurations are sent as separate tracks)
    Server.prototype.getTrackList = function () {
        return __awaiter(this, void 0, void 0, function () {
            var json, trackList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, parser.parse()];
                    case 1:
                        json = _a.sent();
                        trackList = Object.keys(json[TRACK_ORDER_HEADER]) //tested and appears to work
                        ;
                        return [2 /*return*/, trackList];
                }
            });
        });
    };
    Server.prototype.getTrackListNoConfigurations = function () {
        return __awaiter(this, void 0, void 0, function () {
            var list, filteredList, i, track;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getTrackList()];
                    case 1:
                        list = _a.sent();
                        filteredList = [];
                        for (i = 0; i < list.length; i++) {
                            track = list[i];
                            if (track.match(/\(.*\)/) == null) {
                                filteredList.push(track);
                            }
                        }
                        ;
                        return [2 /*return*/, filteredList];
                }
            });
        });
    };
    Server.getTrackTypeEnumForString = function (typeStr) {
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
    };
    Server.prototype.getTrackFullInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var json, tracksList, tracksAndCoords, i, trackRaw, trackNameObj, trackInfo, count, flips, trackType, newTrackInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, parser.parse()];
                    case 1:
                        json = _a.sent();
                        return [4 /*yield*/, this.getTrackList()];
                    case 2:
                        tracksList = _a.sent();
                        tracksAndCoords = [];
                        i = 0;
                        _a.label = 3;
                    case 3:
                        if (!(i < tracksList.length)) return [3 /*break*/, 7];
                        trackRaw = tracksList[i];
                        trackNameObj = Types_1.TrackName.parse(trackRaw);
                        trackInfo = json[TRACK_ORDER_HEADER][trackRaw];
                        return [4 /*yield*/, this.getCountForTrack(trackNameObj)];
                    case 4:
                        count = _a.sent();
                        return [4 /*yield*/, this.getFlipsForTrack(trackNameObj)];
                    case 5:
                        flips = _a.sent();
                        trackType = Server.getTrackTypeEnumForString(trackInfo["Type"]);
                        newTrackInfo = new Types_1.Track(trackNameObj, trackInfo["State"], trackType, trackInfo["Latitude"], trackInfo["Longitude"], count, flips);
                        tracksAndCoords.push(newTrackInfo);
                        _a.label = 6;
                    case 6:
                        i++;
                        return [3 /*break*/, 3];
                    case 7: return [2 /*return*/, tracksAndCoords];
                }
            });
        });
    };
    Server.prototype.getCountForTrack = function (trackNameObj) {
        return __awaiter(this, void 0, void 0, function () {
            var json, count, i, jsonRowHeader, raceRow;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, parser.parse()];
                    case 1:
                        json = _a.sent();
                        json = json[RACES_HEADER];
                        count = 0;
                        i = 0;
                        while (true) {
                            jsonRowHeader = "Races: " + i;
                            raceRow = json[jsonRowHeader];
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
                        return [2 /*return*/, count];
                }
            });
        });
    };
    //returns only the event string as stored in the json
    Server.prototype.getEventStringsForTrack = function (trackNameObj) {
        return __awaiter(this, void 0, void 0, function () {
            var json, events, i, jsonRowHeader, raceRow, event;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, parser.parse()];
                    case 1:
                        json = _a.sent();
                        json = json[RACES_HEADER];
                        events = [];
                        i = 0;
                        while (true) {
                            jsonRowHeader = "Races: " + i;
                            raceRow = json[jsonRowHeader];
                            if (raceRow === undefined) {
                                break;
                            }
                            event = raceRow[trackNameObj.baseName];
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
                        return [2 /*return*/, events];
                }
            });
        });
    };
    Server.prototype.getFlipsForTrack = function (trackNameObj) {
        return __awaiter(this, void 0, void 0, function () {
            var flipDataAllTracks, foundFlips;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, parser.flipsData()];
                    case 1:
                        flipDataAllTracks = _a.sent();
                        foundFlips = flipDataAllTracks.filter(function (flip) {
                            return Types_1.TrackName.equals(flip.trackNameObj, trackNameObj);
                        });
                        return [2 /*return*/, foundFlips];
                }
            });
        });
    };
    Server.prototype.getDateFromFlip = function (flip) {
        return new Date(flip.date);
    };
    Server.prototype.getFlipsForEvent = function (trackNameObj, date) {
        return __awaiter(this, void 0, void 0, function () {
            var dateObj, flipsForTrack, flipsForEvent;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dateObj = new Date(date);
                        return [4 /*yield*/, this.getFlipsForTrack(trackNameObj)];
                    case 1:
                        flipsForTrack = _a.sent();
                        flipsForEvent = flipsForTrack.filter(function (flip) {
                            return _this.getDateFromFlip(flip).getTime() === dateObj.getTime();
                        });
                        return [2 /*return*/, flipsForEvent];
                }
            });
        });
    };
    Server.prototype.getDateFromEventString = function (eventString) {
        var dateRaw = eventString.split(":")[0];
        // return utilities.cleanDate(dateRaw);
        return new Date(dateRaw);
    };
    Server.prototype.makeEnrichedEventInfoHelper = function (eventString, trackNameObj, dateObj) {
        return __awaiter(this, void 0, void 0, function () {
            var flipsForEvent, classes, eventInfoObj;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (eventString === undefined) {
                            throw Error("Event for track " + trackNameObj.baseName + " on date " + dateObj + " cannot be found");
                        }
                        return [4 /*yield*/, this.getFlipsForEvent(trackNameObj, dateObj)];
                    case 1:
                        flipsForEvent = _a.sent();
                        classes = eventString.substring(eventString.indexOf(":") + 2);
                        eventInfoObj = {
                            date: dateObj,
                            classes: classes,
                            flips: flipsForEvent
                        };
                        //TODO: notable crashes
                        return [2 /*return*/, eventInfoObj];
                }
            });
        });
    };
    //events are based on base name, and may or may not have a configuration
    Server.prototype.getEnrichedEventInfoForDate = function (trackNameObj, date) {
        return __awaiter(this, void 0, void 0, function () {
            var dateObj, eventStrings, eventString;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dateObj = new Date(date);
                        return [4 /*yield*/, this.getEventStringsForTrack(trackNameObj)];
                    case 1:
                        eventStrings = _a.sent();
                        eventString = eventStrings.find(function (event) {
                            var eventDate = _this.getDateFromEventString(event);
                            return eventDate.getTime() === dateObj.getTime();
                        });
                        return [2 /*return*/, this.makeEnrichedEventInfoHelper(eventString, trackNameObj, dateObj)];
                }
            });
        });
    };
    Server.prototype.getAllEnrichedEventInfosForTrack = function (trackNameObj) {
        return __awaiter(this, void 0, void 0, function () {
            var eventStrings, promises, eventInfos;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getEventStringsForTrack(trackNameObj)];
                    case 1:
                        eventStrings = _a.sent();
                        promises = eventStrings.map(function (eventStr) { return __awaiter(_this, void 0, void 0, function () {
                            var date, eventInfo;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        date = this.getDateFromEventString(eventStr);
                                        return [4 /*yield*/, this.getEnrichedEventInfoForDate(trackNameObj, date)];
                                    case 1:
                                        eventInfo = _a.sent();
                                        return [2 /*return*/, eventInfo];
                                }
                            });
                        }); });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 2:
                        eventInfos = _a.sent();
                        return [2 /*return*/, eventInfos];
                }
            });
        });
    };
    Server.prototype.getBasicStats = function () {
        return __awaiter(this, void 0, void 0, function () {
            var json;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, parser.parse()];
                    case 1:
                        json = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return Server;
}());
exports.Server = Server;
var server = new Server();
//=========================================================================================
//                                     Endpoints
//=========================================================================================
// Priority serve any static files.
// app.use(express.static(path.resolve(__dirname, '../react-ui/public'))); //I don't know what this is
//get a list of all the tracks, name only
app.get('/tracks', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var tracks;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("/tracks");
                    res.set('Content-Type', 'application/json');
                    return [4 /*yield*/, server.getTrackList()];
                case 1:
                    tracks = _a.sent();
                    res.json(tracks);
                    return [2 /*return*/];
            }
        });
    });
});
//returns a list of all the tracks along with their specific info
app.get('/tracks/info', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var trackInfos;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("/tracks/info");
                    res.set('Content-Type', 'application/json');
                    return [4 /*yield*/, server.getTrackFullInfo()];
                case 1:
                    trackInfos = _a.sent();
                    res.json(trackInfos);
                    return [2 /*return*/];
            }
        });
    });
});
//returns a list of all event strings for a particular track
app.get('/tracks/:trackName/events', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var trackNameObj, events;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("/tracks/" + req.params.trackName + "/events");
                    res.set('Content-Type', 'application/json');
                    trackNameObj = Types_1.TrackName.parse(req.params.trackName);
                    return [4 /*yield*/, server.getEventStringsForTrack(trackNameObj)];
                case 1:
                    events = _a.sent();
                    res.json(events);
                    return [2 /*return*/];
            }
        });
    });
});
//get enriched event details for a track and a date
app.get('/eventDetails/:trackName/:date', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var trackNameObj, eventInfo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('/events/' + req.params.trackName + '/' + req.params.date);
                    res.set('Content-Type', 'application/json');
                    trackNameObj = Types_1.TrackName.parse(req.params.trackName);
                    return [4 /*yield*/, server.getEnrichedEventInfoForDate(trackNameObj, req.params.date)];
                case 1:
                    eventInfo = _a.sent();
                    res.json(eventInfo);
                    return [2 /*return*/];
            }
        });
    });
});
//get enriched event details for all events for a track
app.get('/eventDetails/:trackName', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var trackNameObj, eventInfos;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('/eventsDetails/' + req.params.trackName);
                    res.set('Content-Type', 'application/json');
                    trackNameObj = Types_1.TrackName.parse(req.params.trackName);
                    return [4 /*yield*/, server.getAllEnrichedEventInfosForTrack(trackNameObj)];
                case 1:
                    eventInfos = _a.sent();
                    res.json(eventInfos);
                    return [2 /*return*/];
            }
        });
    });
});
app.get('/numRaces/:trackName/raceCount', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var trackNameObj, count;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("/numRaces/" + req.params.trackName + "/raceCount");
                    trackNameObj = Types_1.TrackName.parse(req.params.trackName);
                    return [4 /*yield*/, server.getCountForTrack(trackNameObj)];
                case 1:
                    count = _a.sent();
                    res.set('Content-Type', 'application/json');
                    res.json({ "message": count });
                    return [2 /*return*/];
            }
        });
    });
});
app.get('/stats', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var stats;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("/stats");
                    return [4 /*yield*/, server.getBasicStats()];
                case 1:
                    stats = _a.sent();
                    res.set('Content-Type', 'application/json');
                    res.json(stats);
                    return [2 /*return*/];
            }
        });
    });
});
//Don't touch the following - Heroku gets very finnicky about it
// Serve static files from the React app
app.use(express_1.default.static(path_1.default.join(__dirname, 'client/build')));
var root = path_1.default.join(__dirname, '..', 'client', 'build');
app.use(express_1.default.static(root));
app.get("*", function (req, res) {
    res.sendFile('index.html', { root: root });
});
var port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log("server started on port " + port);
});
//TODO: do we even need stats to be sent from the server? There's no unique info on that page
//# sourceMappingURL=server.js.map