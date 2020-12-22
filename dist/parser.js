"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const path_1 = __importDefault(require("path"));
const Types_1 = require("./Types");
const app_1 = require("./app");
var fs = require('fs');
let parsedJson = null;
let _flipsData = null;
const FLIPS_HEADER = "Flips";
const DATA_PATH = "/../events_data.json";
const TEST_DATA_PATH = "/../events_data_test.json";
const STATS_HEADER = "Stats";
class Parser {
    static runningJestTest() {
        return process.env.JEST_WORKER_ID !== undefined;
    }
    static get dataPath() {
        return this.runningJestTest() ? TEST_DATA_PATH : DATA_PATH;
    }
    static async flipsData() {
        if (_flipsData == null) {
            await Parser.parse();
        }
        return _flipsData;
    }
    //Flips are keyed by date as they come from json, so we need to rearrange to key by track
    //Should only be called from parse()
    static async makeFlipsData(json) {
        if (_flipsData != null) {
            return; //nothing to do, already built
        }
        const flipsJson = json[FLIPS_HEADER];
        const flips = [];
        Object.keys(flipsJson).forEach((flipId) => {
            if (flipId === "") //this can happen since the checkboxes are extended below the end of the flips list
             {
                return; //do nothing
            }
            const flipInfo = flipsJson[flipId];
            const rawTrackStr = flipInfo["Track"];
            const trackNameObj = Types_1.TrackName.parse(rawTrackStr); //contains configuration
            let openWheel = false;
            if (flipInfo["Open Wheel"]) {
                openWheel = true;
            }
            // console.log(flipInfo["Date"]);
            const dateToAdd = app_1.makeDate(flipInfo["Date"]);
            const newObjToAdd = {
                flipId: flipId,
                trackNameObj: trackNameObj,
                date: dateToAdd,
                carClass: flipInfo["Class"],
                rotations: flipInfo["Rotations"],
                surface: flipInfo["Surface"],
                openWheel: openWheel,
                when: flipInfo["When"],
                video: flipInfo["Video"],
                notes: flipInfo["Notes"]
            };
            flips.push(newObjToAdd);
        });
        _flipsData = flips;
    }
    static async parse() {
        if (parsedJson == null) {
            //take the json downloaded from google sheets in json format and parse it
            var data = fs.readFileSync(path_1.default.join(__dirname, this.dataPath), 'utf8');
            var json = JSON.parse(data);
            await this.makeFlipsData(json);
            parsedJson = json;
        }
        return parsedJson;
    }
    static async getQuickStats() {
        const json = await Parser.parse();
        const statsJson = json[STATS_HEADER];
        console.log(statsJson);
    }
}
exports.Parser = Parser;
//# sourceMappingURL=parser.js.map