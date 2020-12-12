"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackName = void 0;
//use this instead of passing around raw string track names
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
exports.TrackName = TrackName;
//# sourceMappingURL=Types.js.map