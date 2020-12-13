"use strict";
//this is copied between client and server - make sure they stay in sync
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flip = exports.EventObj = exports.TrackTypeEnum = exports.TrackName = exports.Track = void 0;
var Track = /** @class */ (function () {
    function Track(trackNameObj, state, trackType, latitude, longitude, count, flips) {
        this.trackNameObj = trackNameObj;
        this.state = state;
        this.trackType = trackType;
        this.latitude = latitude;
        this.longitude = longitude;
        this.count = count;
        this.flips = flips;
    }
    Object.defineProperty(Track.prototype, "coordinates", {
        get: function () {
            return [this.longitude, this.latitude]; //need to be reversed for some reason
        },
        enumerable: false,
        configurable: true
    });
    //unique key
    Track.prototype.toString = function () {
        return this.trackType.toString() + this.state + this.trackType;
    };
    return Track;
}());
exports.Track = Track;
var TrackName = /** @class */ (function () {
    function TrackName(baseName, configuration, isConfiguration) {
        if (isConfiguration && configuration == null) {
            throw new Error("Track object isConfiguration is false, but configuration is null");
        }
        this.baseName = baseName;
        this.configuration = configuration;
        this.isConfiguration = isConfiguration;
    }
    TrackName.equals = function (t1, t2) {
        return t1.baseName === t2.baseName
            && t1.configuration === t2.configuration
            && t1.isConfiguration === t2.isConfiguration;
    };
    TrackName.parse = function (rawNameString) {
        var trackName = rawNameString.trim();
        var isConfiguration = false; //an alternative configuration of a base track, named with parentheses
        var parts = trackName.split(/\(/); //split on left paren
        var configuration = null;
        if (parts.length == 2) //if two parts, we have a configuration
         {
            isConfiguration = true;
            //remove the other paren
            configuration = parts[1].trim();
            configuration = configuration.replace(/\)/, "").trim();
            trackName = parts[0].trim();
        }
        return new TrackName(trackName, configuration, isConfiguration);
    };
    TrackName.prototype.toString = function () {
        var ret = this.baseName;
        if (this.isConfiguration) {
            ret += " (" + this.configuration + ")";
        }
        return ret;
    };
    return TrackName;
}());
exports.TrackName = TrackName;
var TrackTypeEnum;
(function (TrackTypeEnum) {
    TrackTypeEnum[TrackTypeEnum["OVAL"] = 0] = "OVAL";
    TrackTypeEnum[TrackTypeEnum["FIGURE_8"] = 1] = "FIGURE_8";
    TrackTypeEnum[TrackTypeEnum["ROAD_COURSE"] = 2] = "ROAD_COURSE";
})(TrackTypeEnum = exports.TrackTypeEnum || (exports.TrackTypeEnum = {}));
var EventObj = /** @class */ (function () {
    // public notableCrashes: ; //TODO
    function EventObj(date, classes, flips) {
        this.date = date;
        this.classes = classes;
        this.flips = flips;
    }
    EventObj.parseJson = function (json) {
        return new EventObj(json["date"], json["classes"], json["flips"]); //TODO: flips probably won't work
    };
    return EventObj;
}());
exports.EventObj = EventObj;
var Flip = /** @class */ (function () {
    function Flip(trackNameObj, flipId, date, carClass, rotations, surface, openWheel, when, video, notes) {
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
    return Flip;
}());
exports.Flip = Flip;
//# sourceMappingURL=Types.js.map