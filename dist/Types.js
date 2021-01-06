"use strict";
//this is copied between client and server - make sure they stay in sync
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flip = exports.EventObj = exports.TrackTypeEnum = exports.TrackName = exports.Track = exports.makeDate = void 0;
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
class Track {
    constructor(trackNameObj, state, trackType, latitude, longitude, count, flips) {
        this.trackNameObj = trackNameObj;
        this.state = state;
        this.trackType = trackType;
        this.latitude = latitude;
        this.longitude = longitude;
        this.count = count;
        this.flips = flips;
    }
    get coordinates() {
        return [this.longitude, this.latitude]; //need to be reversed for some reason
    }
    //unique key
    print() {
        return this.trackNameObj.print() + this.state + this.trackType;
    }
}
exports.Track = Track;
class TrackName {
    constructor(baseName, configuration, isConfiguration) {
        if (isConfiguration && configuration == null) {
            throw new Error("Track object isConfiguration is false, but configuration is null");
        }
        this.baseName = baseName;
        this.configuration = configuration;
        this.isConfiguration = isConfiguration;
    }
    static equals(t1, t2) {
        return t1.baseName === t2.baseName
            && t1.configuration === t2.configuration
            && t1.isConfiguration === t2.isConfiguration;
    }
    static parse(rawNameString) {
        if (rawNameString.hasOwnProperty("baseName")
            && rawNameString.hasOwnProperty("isConfiguration")
            && rawNameString.hasOwnProperty("configuration")) {
            //it's an object coming in from the server
            const nameObj = rawNameString;
            return new TrackName(nameObj["baseName"], nameObj["configuration"], nameObj["isConfiguration"]);
        }
        else {
            let trackName = rawNameString.trim();
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
            return new TrackName(trackName, configuration, isConfiguration);
        }
    }
    print() {
        let ret = this.baseName;
        if (this.isConfiguration) {
            ret += " (" + this.configuration + ")";
        }
        return ret;
    }
}
exports.TrackName = TrackName;
var TrackTypeEnum;
(function (TrackTypeEnum) {
    TrackTypeEnum[TrackTypeEnum["OVAL"] = 0] = "OVAL";
    TrackTypeEnum[TrackTypeEnum["FIGURE_8"] = 1] = "FIGURE_8";
    TrackTypeEnum[TrackTypeEnum["ROAD_COURSE"] = 2] = "ROAD_COURSE";
})(TrackTypeEnum = exports.TrackTypeEnum || (exports.TrackTypeEnum = {}));
class EventObj {
    // public notableCrashes: ; //TODO
    constructor(trackName, date, classes, flips) {
        this.trackName = trackName;
        this.date = makeDate(date);
        this.classes = classes;
        this.flips = flips;
    }
}
exports.EventObj = EventObj;
class Flip {
    constructor(trackNameObj, flipId, date, carClass, rotations, surface, openWheel, when, video, notes) {
        this.trackNameObj = trackNameObj;
        this.flipId = flipId;
        this.date = date;
        this.carClass = carClass;
        this.rotations = rotations;
        this.surface = surface;
        this.openWheel = openWheel;
        this.when = when;
        this.video = video;
        this.notes = notes;
    }
}
exports.Flip = Flip;
// export type EventInfo = {date: Date; classes: string; flips: Flip[]}
//# sourceMappingURL=Types.js.map