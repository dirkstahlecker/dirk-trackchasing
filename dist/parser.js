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
exports.Parser = void 0;
var path_1 = __importDefault(require("path"));
var Types_1 = require("./Types");
var fs = require('fs');
var parsedJson = null;
var _flipsData = null; //now using a list of objects // {name : [ date, track, class, rotations, surface, open wheel, when, video, notes ] }
var FLIPS_HEADER = "Flips";
var DATA_PATH = "/../events_data.json";
var TEST_DATA_PATH = "/../events_data_test.json";
var STATS_HEADER = "Stats";
var Parser = /** @class */ (function () {
    function Parser() {
    }
    Parser.prototype.runningJestTest = function () {
        return process.env.JEST_WORKER_ID !== undefined;
    };
    Object.defineProperty(Parser.prototype, "dataPath", {
        get: function () {
            return this.runningJestTest() ? TEST_DATA_PATH : DATA_PATH;
        },
        enumerable: false,
        configurable: true
    });
    Parser.prototype.flipsData = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(_flipsData == null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.parse()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, _flipsData];
                }
            });
        });
    };
    //Flips are keyed by date as they come from json, so we need to rearrange to key by track
    //Should only be called from parse()
    Parser.prototype.makeFlipsData = function (json) {
        return __awaiter(this, void 0, void 0, function () {
            var flipsJson, flips;
            return __generator(this, function (_a) {
                if (_flipsData != null) {
                    return [2 /*return*/, _flipsData];
                }
                flipsJson = json[FLIPS_HEADER];
                flips = [];
                Object.keys(flipsJson).forEach(function (flipId) {
                    if (flipId === "") //this can happen since the checkboxes are extended below the end of the flips list
                     {
                        return; //do nothing
                    }
                    var flipInfo = flipsJson[flipId];
                    var rawTrackStr = flipInfo["Track"];
                    var trackNameObj = Types_1.TrackName.parse(rawTrackStr); //contains configuration
                    var openWheel = false;
                    if (flipInfo["Open Wheel"]) {
                        openWheel = true;
                    }
                    var newObjToAdd = {
                        flipId: flipId,
                        trackNameObj: trackNameObj,
                        date: new Date(flipInfo["Date"]),
                        class: flipInfo["Class"],
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
                return [2 /*return*/];
            });
        });
    };
    Parser.prototype.parse = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, json;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(parsedJson == null)) return [3 /*break*/, 2];
                        //take the json downloaded from google sheets in json format and parse it
                        console.log("==========================");
                        data = fs.readFileSync(path_1.default.join(__dirname, this.dataPath), 'utf8');
                        json = JSON.parse(data);
                        return [4 /*yield*/, this.makeFlipsData(json)];
                    case 1:
                        _a.sent();
                        parsedJson = json;
                        _a.label = 2;
                    case 2: return [2 /*return*/, parsedJson];
                }
            });
        });
    };
    Parser.prototype.getQuickStats = function () {
        return __awaiter(this, void 0, void 0, function () {
            var json, statsJson;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.parse()];
                    case 1:
                        json = _a.sent();
                        statsJson = json[STATS_HEADER];
                        console.log(statsJson);
                        return [2 /*return*/];
                }
            });
        });
    };
    return Parser;
}());
exports.Parser = Parser;
// exports.parse = parse;
// exports.flipsData = flipsData;
// exports.TESTPIN_parse = parse; //for testing only
// exports.getQuickStats = getQuickStats;
//# sourceMappingURL=parser.js.map