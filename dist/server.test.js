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
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = require("./server");
// const parser = require('./parser')
var Types_1 = require("./Types");
//npm run test
var server = new server_1.Server();
//just comparing a date to a new Date() doesn't work because it embeds timezome information
function compareDates(date1, date2) {
    return server_1.makeDate(date1).getTime() === server_1.makeDate(date2).getTime();
}
it('track name and configuration', function () {
    var info = Types_1.TrackName.parse("Seekonk Speedway");
    expect(info.baseName).toBe("Seekonk Speedway");
    expect(info.configuration).toBeNull();
    expect(info.isConfiguration).toBe(false);
    info = Types_1.TrackName.parse("Seekonk Speedway (Asphalt Figure 8)");
    expect(info.baseName).toBe("Seekonk Speedway");
    expect(info.configuration).toBe("Asphalt Figure 8");
    expect(info.isConfiguration).toBe(true);
    info = Types_1.TrackName.parse("Texas Motor Speedway (Asphalt Road Course)");
    expect(info.baseName).toBe("Texas Motor Speedway");
    expect(info.configuration).toBe("Asphalt Road Course");
    expect(info.isConfiguration).toBe(true);
});
it('returns track list without configurations', function () { return __awaiter(void 0, void 0, void 0, function () {
    var trackList;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, server.getTrackListNoConfigurations()];
            case 1:
                trackList = _a.sent();
                expect(trackList.length).toEqual(77);
                expect(trackList).toEqual([
                    'Pocatello Speedway',
                    'Las Vegas Motor Speedway',
                    'The Dirt Track at Las Vegas Motor Speedway',
                    'Magic Valley Speedway',
                    'Miller Motorsports Park',
                    'Phoenix International Raceway',
                    'Rocky Mountain Raceways',
                    'Atomic Motor Raceway',
                    'Stuart Speedway',
                    'Wakeeney Speedway',
                    'Miller Motorsports Park Off Road Course',
                    'New Hampshire Motor Speedway',
                    'Nassau Coliseum Parking Lot',
                    'Seekonk Speedway',
                    'Thompson Speedway',
                    'Port of LA',
                    'Star Speedway',
                    'Stafford Motor Speedway',
                    'Thompson Speedway - Rallycross',
                    'Lee USA Speedway',
                    'Albany-Saratoga Speedway',
                    'New London Waterford Speedbowl',
                    'Oxford Plains Speedway',
                    'Lebanon Valley Speedway',
                    'Beech Ridge Speedway',
                    'Wall Stadium Speedway',
                    'Hudson Speedway',
                    'Texas Motor Speedway',
                    "Lil' Texas Motor Speedway",
                    'Monadnock Speedway',
                    'Bear Ridge Speedway',
                    "Devil's Bowl Speedway",
                    'Lancaster Speedway',
                    'Charlotte Motor Speedway Roval',
                    'Gateway Dirt Nationals',
                    'Cure Insurance Arena',
                    'Exposition Center',
                    'Lincoln Speedway',
                    'Port Royal Speedway',
                    'Orange County Fair Speedway',
                    'New Egypt Speedway',
                    'Glen Ridge Motorsports Park',
                    'Utica-Rome Speedway',
                    'Thunder Road International Speedbowl',
                    'NHMS Flat Track',
                    'Meridian Speedway',
                    'Slinger Speedway',
                    'Southern Iowa Speedway',
                    'Knoxville Raceway',
                    'Proctor Speedway',
                    "William's Grove Speedway",
                    'BAPS Motor Speedway',
                    'Eldora Speedway',
                    'PPL Center',
                    'Riverside Speedway',
                    'Boardwalk Hall',
                    'Paragon Speedway',
                    'Gas City Speedway',
                    'Lincoln Park Speedway',
                    'Tri-State Speedway',
                    'Lawrenceburg Speedway',
                    'Kokomo Speedway',
                    'Claremont Motorsports Park',
                    'Selinsgrove Speedway',
                    'Grandview Speedway',
                    'Hagerstown Speedway',
                    'Big Diamond Speedway',
                    'White Mountain Motorsports Park',
                    'Londonderry Speedway',
                    'Rumtown Speedway',
                    'Lucas Oil Raceway',
                    'Lucas Oil Speedway Off Road Course',
                    'Lucas Oil Speedway',
                    'Indiana State Fairgrounds',
                    'Gateway Motorsports Park',
                    'Macon Speedway',
                    'Bridgeport Motorsports Park'
                ]);
                return [2 /*return*/];
        }
    });
}); });
it('returns proper track list', function () { return __awaiter(void 0, void 0, void 0, function () {
    var list;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, server.getTrackList()];
            case 1:
                list = _a.sent();
                expect(list.length).toEqual(90);
                expect(list[8]).toEqual("Miller Motorsports Park");
                expect(list[21]).toEqual("Port of LA");
                expect(list[32]).toEqual("Wall Stadium Speedway (Inner Asphalt Oval)");
                expect(list[89]).toEqual("Bridgeport Motorsports Park");
                return [2 /*return*/];
        }
    });
}); });
it('returns proper track list without configurations', function () { return __awaiter(void 0, void 0, void 0, function () {
    var list;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, server.getTrackListNoConfigurations()];
            case 1:
                list = _a.sent();
                expect(list.length).toEqual(77);
                expect(list[76]).toEqual("Bridgeport Motorsports Park");
                expect(list[46]).toEqual("Slinger Speedway");
                expect(list[69]).toEqual("Rumtown Speedway");
                expect(list[0]).toEqual("Pocatello Speedway");
                return [2 /*return*/];
        }
    });
}); });
// //TODO: Currently broken
// // test('invalid track names', () => {
// // 	let info = server.getTrackNameAndConfiguration("Not a Real Track");
// // 	expect(info.trackName).toBe("");
// // 	expect(info.configuration).toBeNull();
// // 	expect(info.isConfiguration).toBe(false);
// // });
it('proper counts for track', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        server.getCountForTrack(Types_1.TrackName.parse("Seekonk Speedway")).then(function (data) { return expect(data).toEqual(46); });
        server.getCountForTrack(Types_1.TrackName.parse("Thompson Speedway")).then(function (data) { return expect(data).toEqual(28); });
        server.getCountForTrack(Types_1.TrackName.parse("Rocky Mountain Raceways")).then(function (data) { return expect(data).toEqual(8); });
        //configurations
        server.getCountForTrack(Types_1.TrackName.parse("Rocky Mountain Raceways (Asphalt Figure 8)")).then(function (data) { return expect(data).toEqual(7); });
        server.getCountForTrack(Types_1.TrackName.parse("Seekonk Speedway (Asphalt Road Course)")).then(function (data) { return expect(data).toEqual(1); });
        server.getCountForTrack(Types_1.TrackName.parse("Stafford Motor Speedway (Inner Asphalt Oval)")).then(function (data) { return expect(data).toEqual(1); });
        return [2 /*return*/];
    });
}); });
it('getTrackFullInfo', function () { return __awaiter(void 0, void 0, void 0, function () {
    var trackInfos, pocatello, pocatelloInner, rmr, rmr8, stafford, la, texas, texasRC;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, server.getTrackFullInfo()];
            case 1:
                trackInfos = _a.sent();
                pocatello = trackInfos.find(function (track) {
                    return Types_1.TrackName.equals(track.trackNameObj, Types_1.TrackName.parse("Pocatello Speedway"));
                });
                expect(pocatello.state).toBe("ID");
                expect(pocatello.latitude).toBe(42.912684);
                expect(pocatello.longitude).toBe(-112.577022);
                expect(pocatello.count).toBe(6);
                expect(pocatello.trackType).toEqual(Types_1.TrackTypeEnum.OVAL);
                expect(pocatello.flips.length).toEqual(0);
                pocatelloInner = trackInfos.find(function (track) {
                    return Types_1.TrackName.equals(track.trackNameObj, Types_1.TrackName.parse("Pocatello Speedway (Inner Dirt Oval)"));
                });
                expect(pocatelloInner.state).toBe("ID");
                expect(pocatelloInner.latitude).toBeUndefined();
                expect(pocatelloInner.longitude).toBeUndefined();
                expect(pocatelloInner.flips.length).toEqual(1);
                rmr = trackInfos.find(function (track) {
                    return Types_1.TrackName.equals(track.trackNameObj, Types_1.TrackName.parse("Rocky Mountain Raceways"));
                });
                expect(rmr.state).toBe("UT");
                expect(rmr.count).toBe(8);
                expect(rmr.flips.length).toEqual(2);
                rmr8 = trackInfos.find(function (track) {
                    return Types_1.TrackName.equals(track.trackNameObj, Types_1.TrackName.parse("Rocky Mountain Raceways (Asphalt Figure 8)"));
                });
                expect(rmr8.state).toBe("UT");
                expect(rmr8.count).toBe(7);
                expect(rmr8.flips.length).toEqual(0);
                stafford = trackInfos.find(function (track) {
                    return Types_1.TrackName.equals(track.trackNameObj, Types_1.TrackName.parse("Stafford Motor Speedway"));
                });
                expect(stafford.state).toBe("CT");
                expect(stafford.count).toBe(18);
                expect(stafford.flips.length).toEqual(0);
                la = trackInfos.find(function (track) {
                    return Types_1.TrackName.equals(track.trackNameObj, Types_1.TrackName.parse("Port of LA"));
                });
                expect(la.state).toBe("CA");
                expect(la.count).toEqual(1);
                expect(la.flips.length).toEqual(0);
                texas = trackInfos.find(function (track) {
                    return Types_1.TrackName.equals(track.trackNameObj, Types_1.TrackName.parse("Texas Motor Speedway"));
                });
                expect(texas.state).toEqual("TX");
                expect(texas.count).toEqual(2);
                expect(texas.flips.length).toEqual(0);
                texasRC = trackInfos.find(function (track) {
                    return Types_1.TrackName.equals(track.trackNameObj, Types_1.TrackName.parse("Texas Motor Speedway (Asphalt Road Course)"));
                });
                expect(texasRC.state).toEqual("TX");
                expect(texasRC.count).toEqual(1);
                expect(texasRC.flips.length).toEqual(1);
                return [2 /*return*/];
        }
    });
}); });
// //just the basic strings from the json
it('getEventStringsForTrack', function () { return __awaiter(void 0, void 0, void 0, function () {
    var info;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, server.getEventStringsForTrack(Types_1.TrackName.parse("Seekonk Speedway"))];
            case 1:
                info = _a.sent();
                expect(info.length).toEqual(46);
                expect(info[0]).toEqual("7-13-16: US Pro stock nationals, INEX legends, pro 4 modifieds");
                return [4 /*yield*/, server.getEventStringsForTrack(Types_1.TrackName.parse("Pocatello Speedway"))];
            case 2:
                info = _a.sent();
                expect(info.length).toEqual(6);
                return [4 /*yield*/, server.getEventStringsForTrack(Types_1.TrackName.parse("Pocatello Speedway (Inner Dirt Oval)"))];
            case 3:
                info = _a.sent();
                expect(info.length).toEqual(1);
                expect(info[0]).toEqual("7-23-16: ASA Pro Trucks, Street Stocks, Modifieds, Hornets, Junkyard Dogs, Karts [Inner Dirt Oval]");
                return [4 /*yield*/, server.getEventStringsForTrack(Types_1.TrackName.parse("Thompson Speedway - Rallycross"))];
            case 4:
                info = _a.sent();
                expect(info.length).toEqual(2);
                expect(info[0]).toEqual("6-03-17: Global Rallycross Championship: GRC Supercars, GRC Lites");
                expect(info[1]).toEqual("6-04-17: Global Rallycross Championship: GRC Supercars, GRC Lites");
                return [4 /*yield*/, server.getEventStringsForTrack(Types_1.TrackName.parse("New Hampshire Motor Speedway (Asphalt Legends Oval)"))];
            case 5:
                info = _a.sent();
                expect(info.length).toEqual(1);
                expect(info[0]).toEqual("9-12-20: Whelen Modifieds Musket 200, ACT Late Models, Legends [Asphalt Legends Oval]");
                return [2 /*return*/];
        }
    });
}); });
it('number of flips per track', function () { return __awaiter(void 0, void 0, void 0, function () {
    var flips;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, server.getFlipsForTrack(Types_1.TrackName.parse("Eldora Speedway"))];
            case 1:
                flips = _a.sent();
                expect(flips.length).toBe(3);
                return [4 /*yield*/, server.getFlipsForTrack(Types_1.TrackName.parse("Bridgeport Motorsports Park"))];
            case 2:
                flips = _a.sent();
                expect(flips.length).toBe(7);
                return [4 /*yield*/, server.getFlipsForTrack(Types_1.TrackName.parse("Gateway Dirt Nationals"))];
            case 3:
                flips = _a.sent();
                expect(flips.length).toBe(17);
                return [4 /*yield*/, server.getFlipsForTrack(Types_1.TrackName.parse("Pocatello Speedway"))];
            case 4:
                flips = _a.sent();
                expect(flips.length).toBe(0);
                return [4 /*yield*/, server.getFlipsForTrack(Types_1.TrackName.parse("Pocatello Speedway (Inner Dirt Oval)"))];
            case 5:
                flips = _a.sent();
                expect(flips.length).toBe(1);
                return [4 /*yield*/, server.getFlipsForTrack(Types_1.TrackName.parse("Atomic Motor Raceway"))];
            case 6:
                flips = _a.sent();
                expect(flips.length).toBe(1);
                return [4 /*yield*/, server.getFlipsForTrack(Types_1.TrackName.parse("Lucas Oil Speedway Off Road Course"))];
            case 7:
                flips = _a.sent();
                expect(flips.length).toBe(4);
                return [4 /*yield*/, server.getFlipsForTrack(Types_1.TrackName.parse("Texas Motor Speedway"))];
            case 8:
                flips = _a.sent(); //only a flip at the configuration
                expect(flips.length).toEqual(0);
                return [4 /*yield*/, server.getFlipsForTrack(Types_1.TrackName.parse("Texas Motor Speedway (Asphalt Road Course)"))];
            case 9:
                flips = _a.sent();
                expect(flips.length).toEqual(1);
                return [2 /*return*/];
        }
    });
}); });
it('flip objects', function () { return __awaiter(void 0, void 0, void 0, function () {
    var flips, flip;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, server.getFlipsForTrack(Types_1.TrackName.parse("Pocatello Speedway (Inner Dirt Oval"))];
            case 1:
                flips = _a.sent();
                expect(flips.length).toBe(1);
                flip = flips[0];
                expect(flip.flipId).toEqual("20");
                expect(flip.carClass).toEqual("Champ Kart");
                expect(flip.openWheel).toBeTruthy();
                expect(flip.rotations).toEqual("1/4");
                expect(flip.video).toBeFalsy();
                return [4 /*yield*/, server.getFlipsForTrack(Types_1.TrackName.parse("Knoxville Raceway"))];
            case 2:
                flips = _a.sent();
                flip = flips.find(function (f) {
                    return f.when === "A Main"; //Knoxville only has one flip in a A main
                });
                expect(flip.flipId).toEqual("81");
                expect(flip.carClass).toEqual("410 Sprint Car");
                expect(flip.openWheel).toBeTruthy();
                expect(flip.rotations).toEqual("1");
                expect(flip.video).toBeTruthy();
                expect(flip.surface).toEqual("Dirt");
                expect(compareDates(flip.date, new Date('8-09-19'))).toBeTruthy();
                return [4 /*yield*/, server.getFlipsForTrack(Types_1.TrackName.parse("Lincoln Speedway"))];
            case 3:
                flips = _a.sent();
                flip = flips.find(function (f) {
                    return f.carClass === "Super Late Model";
                });
                expect(flip.flipId).toEqual("158");
                expect(flip.openWheel).toBeFalsy();
                expect(flip.rotations).toEqual("1/2+");
                expect(flip.video).toBeFalsy();
                expect(flip.surface).toEqual("Dirt");
                expect(flip.when).toEqual("Main");
                expect(flip.notes).toBeTruthy();
                expect(flip.notes.includes("Turn 3")).toBeTruthy();
                expect(compareDates(flip.date, new Date("8-20-20"))).toBeTruthy();
                return [2 /*return*/];
        }
    });
}); });
it('gets date from event string', function () {
    var date = server.getDateFromEventString('11-06-20: URC 360 Sprint Cars');
    expect(compareDates(date, new Date('11-06-20'))).toBeTruthy();
    date = server.getDateFromEventString("2-5-19: Doesn't matter what we put here");
    expect(compareDates(date, new Date('02-05-19'))).toBeTruthy();
    expect(compareDates(date, new Date('2-05-19'))).toBeTruthy();
});
it('makes dates correctly with different timezones', function () {
    //try to make dates in all different manners.
    //should try this in different computer timezones and make sure it passes
    var date1 = server_1.makeDate("11-08-20");
    var date2 = server_1.makeDate(new Date("11-08-20"));
    var date3 = server_1.makeDate(new Date(Date.parse("11-08-20")));
    expect(date1.getTime()).toEqual(date2.getTime());
    expect(date1.getTime()).toEqual(date3.getTime());
    expect(compareDates(date1, date2)).toBeTruthy();
    expect(compareDates(date1, date3)).toBeTruthy();
});
//more detailed, enriched with other information
it('returns enriched event info', function () { return __awaiter(void 0, void 0, void 0, function () {
    var eventInfo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, server.getEnrichedEventInfoForDate(Types_1.TrackName.parse("Bridgeport Motorsports Park"), "11-08-20")];
            case 1:
                eventInfo = _a.sent();
                expect(eventInfo.classes).toEqual("Big Block Modifieds, 602 Sportsman Modifieds, USAC SpeedSTRs, Street Stocks");
                expect(compareDates(eventInfo.date, new Date('11-08-20'))).toBeTruthy();
                expect(eventInfo.flips.length).toEqual(3);
                expect(eventInfo.flips[0].carClass).toEqual("USAC SpeedSTR");
                return [4 /*yield*/, server.getEnrichedEventInfoForDate(Types_1.TrackName.parse("Kokomo Speedway"), "8-27-20")];
            case 2:
                eventInfo = _a.sent();
                expect(eventInfo.classes).toEqual("Smackdown IX: USAC National Sprint Cars");
                expect(compareDates(eventInfo.date, new Date('8-27-20'))).toBeTruthy();
                expect(eventInfo.flips.length).toEqual(2);
                expect(eventInfo.flips[0].carClass).toEqual("Wingless 410 Sprint Car");
                return [4 /*yield*/, server.getEnrichedEventInfoForDate(Types_1.TrackName.parse("Texas Motor Speedway (Asphalt Road Course"), "6-9-18")];
            case 3:
                eventInfo = _a.sent();
                expect(eventInfo.classes).toEqual("Verizon IndyCar Series, Stadium Super Trucks [Asphalt Road Course]");
                expect(compareDates(eventInfo.date, new Date('6-9-18'))).toBeTruthy();
                expect(eventInfo.flips.length).toEqual(1);
                expect(eventInfo.flips[0].carClass).toEqual("Stadium Super Truck");
                return [2 /*return*/];
        }
    });
}); });
it('returns all enriched event infos for a track', function () { return __awaiter(void 0, void 0, void 0, function () {
    var eventInfos;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, server.getAllEnrichedEventInfosForTrack(Types_1.TrackName.parse("Bridgeport Motorsports Park"))];
            case 1:
                eventInfos = _a.sent();
                expect(eventInfos.length).toBe(3);
                expect(compareDates(eventInfos[0].date, new Date('11-06-20'))).toBeTruthy();
                expect(eventInfos[0].flips.length).toEqual(2);
                expect(compareDates(eventInfos[2].date, new Date('11-08-20'))).toBeTruthy();
                expect(eventInfos[2].classes).toContain("Big Block Modifieds, 602 Sportsman Modifieds");
                return [2 /*return*/];
        }
    });
}); });
//TODO: currently breaks
// test('capitalization', () => {
// 	expect(server.getCountForTrack("seeKoNK speedWAY")).toBe(46);
// });
//# sourceMappingURL=server.test.js.map