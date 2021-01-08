"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const Types_1 = require("./Types");
const utilities_1 = require("./utilities");
//npm run test
it('track name and configuration', () => {
    let info = Types_1.TrackName.parse("Seekonk Speedway");
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
it('returns track list without configurations', async () => {
    const trackList = await app_1.ServerApp.getTrackListNoConfigurations();
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
});
it('returns proper track list', async () => {
    //order isn't definitively set for the first 7
    const list = await app_1.ServerApp.getTrackList();
    expect(list.length).toEqual(90);
    expect(list[8]).toEqual("Miller Motorsports Park");
    expect(list[21]).toEqual("Port of LA");
    expect(list[32]).toEqual("Wall Stadium Speedway (Inner Asphalt Oval)");
    expect(list[89]).toEqual("Bridgeport Motorsports Park");
});
it('returns proper track list without configurations', async () => {
    const list = await app_1.ServerApp.getTrackListNoConfigurations();
    expect(list.length).toEqual(77);
    expect(list[76]).toEqual("Bridgeport Motorsports Park");
    expect(list[46]).toEqual("Slinger Speedway");
    expect(list[69]).toEqual("Rumtown Speedway");
    expect(list[0]).toEqual("Pocatello Speedway");
});
// //TODO: Currently broken
// // test('invalid track names', () => {
// // 	let info = server.getTrackNameAndConfiguration("Not a Real Track");
// // 	expect(info.trackName).toBe("");
// // 	expect(info.configuration).toBeNull();
// // 	expect(info.isConfiguration).toBe(false);
// // });
it('proper counts for track', async () => {
    app_1.ServerApp.getCountForTrack(Types_1.TrackName.parse("Seekonk Speedway"))
        .then((data) => expect(data).toEqual(46));
    app_1.ServerApp.getCountForTrack(Types_1.TrackName.parse("Thompson Speedway"))
        .then((data) => expect(data).toEqual(28));
    app_1.ServerApp.getCountForTrack(Types_1.TrackName.parse("Rocky Mountain Raceways"))
        .then((data) => expect(data).toEqual(8));
    //configurations
    app_1.ServerApp.getCountForTrack(Types_1.TrackName.parse("Rocky Mountain Raceways (Asphalt Figure 8)"))
        .then((data) => expect(data).toEqual(7));
    app_1.ServerApp.getCountForTrack(Types_1.TrackName.parse("Seekonk Speedway (Asphalt Road Course)"))
        .then((data) => expect(data).toEqual(1));
    app_1.ServerApp.getCountForTrack(Types_1.TrackName.parse("Stafford Motor Speedway (Inner Asphalt Oval)"))
        .then((data) => expect(data).toEqual(1));
});
it('getTrackFullInfo', async () => {
    const trackInfos = await app_1.ServerApp.getTrackFullInfo();
    // const seekonk = info["Seekonk Speedway"]; //failing due to flips not having dates
    // expect(seekonk.state).toBe("MA");
    // expect(seekonk.count).toBe(46);
    // expect(seekonk.flips.length).toEqual(12);
    const pocatello = trackInfos.find((track) => {
        return Types_1.TrackName.equals(track.trackNameObj, Types_1.TrackName.parse("Pocatello Speedway"));
    });
    expect(pocatello.state).toBe("ID");
    expect(pocatello.latitude).toBe(42.912684);
    expect(pocatello.longitude).toBe(-112.577022);
    expect(pocatello.count).toBe(6);
    expect(pocatello.trackType).toEqual(Types_1.TrackTypeEnum.OVAL);
    expect(pocatello.flips.length).toEqual(0);
    const pocatelloInner = trackInfos.find((track) => {
        return Types_1.TrackName.equals(track.trackNameObj, Types_1.TrackName.parse("Pocatello Speedway (Inner Dirt Oval)"));
    });
    expect(pocatelloInner.state).toBe("ID");
    expect(pocatelloInner.latitude).toBeUndefined();
    expect(pocatelloInner.longitude).toBeUndefined();
    expect(pocatelloInner.flips.length).toEqual(1);
    const rmr = trackInfos.find((track) => {
        return Types_1.TrackName.equals(track.trackNameObj, Types_1.TrackName.parse("Rocky Mountain Raceways"));
    });
    expect(rmr.state).toBe("UT");
    expect(rmr.count).toBe(8);
    expect(rmr.flips.length).toEqual(2);
    const rmr8 = trackInfos.find((track) => {
        return Types_1.TrackName.equals(track.trackNameObj, Types_1.TrackName.parse("Rocky Mountain Raceways (Asphalt Figure 8)"));
    });
    expect(rmr8.state).toBe("UT");
    expect(rmr8.count).toBe(7);
    expect(rmr8.flips.length).toEqual(0);
    const stafford = trackInfos.find((track) => {
        return Types_1.TrackName.equals(track.trackNameObj, Types_1.TrackName.parse("Stafford Motor Speedway"));
    });
    expect(stafford.state).toBe("CT");
    expect(stafford.count).toBe(18);
    expect(stafford.flips.length).toEqual(0);
    const la = trackInfos.find((track) => {
        return Types_1.TrackName.equals(track.trackNameObj, Types_1.TrackName.parse("Port of LA"));
    });
    expect(la.state).toBe("CA");
    expect(la.count).toEqual(1);
    expect(la.flips.length).toEqual(0);
    const texas = trackInfos.find((track) => {
        return Types_1.TrackName.equals(track.trackNameObj, Types_1.TrackName.parse("Texas Motor Speedway"));
    });
    expect(texas.state).toEqual("TX");
    expect(texas.count).toEqual(2);
    expect(texas.flips.length).toEqual(0);
    const texasRC = trackInfos.find((track) => {
        return Types_1.TrackName.equals(track.trackNameObj, Types_1.TrackName.parse("Texas Motor Speedway (Asphalt Road Course)"));
    });
    expect(texasRC.state).toEqual("TX");
    expect(texasRC.count).toEqual(1);
    expect(texasRC.flips.length).toEqual(1);
});
// //just the basic strings from the json
it('getEventStringsForTrack', async () => {
    let info = await app_1.ServerApp.getEventStringsForTrack(Types_1.TrackName.parse("Seekonk Speedway"));
    expect(info.length).toEqual(46);
    expect(info[0]).toEqual("7-13-16: US Pro stock nationals, INEX legends, pro 4 modifieds");
    info = await app_1.ServerApp.getEventStringsForTrack(Types_1.TrackName.parse("Pocatello Speedway"));
    expect(info.length).toEqual(6);
    info = await app_1.ServerApp.getEventStringsForTrack(Types_1.TrackName.parse("Pocatello Speedway (Inner Dirt Oval)"));
    expect(info.length).toEqual(1);
    expect(info[0]).toEqual("7-23-16: ASA Pro Trucks, Street Stocks, Modifieds, Hornets, Junkyard Dogs, Karts [Inner Dirt Oval]");
    info = await app_1.ServerApp.getEventStringsForTrack(Types_1.TrackName.parse("Thompson Speedway - Rallycross"));
    expect(info.length).toEqual(2);
    expect(info[0]).toEqual("6-03-17: Global Rallycross Championship: GRC Supercars, GRC Lites");
    expect(info[1]).toEqual("6-04-17: Global Rallycross Championship: GRC Supercars, GRC Lites");
    info = await app_1.ServerApp.getEventStringsForTrack(Types_1.TrackName.parse("New Hampshire Motor Speedway (Asphalt Legends Oval)"));
    expect(info.length).toEqual(1);
    expect(info[0]).toEqual("9-12-20: Whelen Modifieds Musket 200, ACT Late Models, Legends [Asphalt Legends Oval]");
});
it('number of flips per track', async () => {
    let flips = await app_1.ServerApp.getFlipsForTrack(Types_1.TrackName.parse("Eldora Speedway"));
    expect(flips.length).toBe(3);
    flips = await app_1.ServerApp.getFlipsForTrack(Types_1.TrackName.parse("Bridgeport Motorsports Park"));
    expect(flips.length).toBe(7);
    flips = await app_1.ServerApp.getFlipsForTrack(Types_1.TrackName.parse("Gateway Dirt Nationals"));
    expect(flips.length).toBe(17);
    flips = await app_1.ServerApp.getFlipsForTrack(Types_1.TrackName.parse("Pocatello Speedway"));
    expect(flips.length).toBe(0);
    flips = await app_1.ServerApp.getFlipsForTrack(Types_1.TrackName.parse("Pocatello Speedway (Inner Dirt Oval)"));
    expect(flips.length).toBe(1);
    flips = await app_1.ServerApp.getFlipsForTrack(Types_1.TrackName.parse("Atomic Motor Raceway"));
    expect(flips.length).toBe(1);
    flips = await app_1.ServerApp.getFlipsForTrack(Types_1.TrackName.parse("Lucas Oil Speedway Off Road Course"));
    expect(flips.length).toBe(4);
    flips = await app_1.ServerApp.getFlipsForTrack(Types_1.TrackName.parse("Texas Motor Speedway")); //only a flip at the configuration
    expect(flips.length).toEqual(0);
    flips = await app_1.ServerApp.getFlipsForTrack(Types_1.TrackName.parse("Texas Motor Speedway (Asphalt Road Course)"));
    expect(flips.length).toEqual(1);
});
it('flip objects', async () => {
    let trackNameObj = Types_1.TrackName.parse("Pocatello Speedway (Inner Dirt Oval");
    let flips = await app_1.ServerApp.getFlipsForTrack(trackNameObj);
    expect(flips.length).toBe(1);
    let flip = flips[0];
    expect(flip.flipId).toEqual("20");
    expect(flip.carClass).toEqual("Champ Kart");
    expect(flip.openWheel).toBeTruthy();
    expect(flip.rotations).toEqual("1/4");
    expect(flip.video).toBeFalsy();
    expect(Types_1.TrackName.equals(trackNameObj, flip.trackNameObj)).toBeTruthy();
    trackNameObj = Types_1.TrackName.parse("Knoxville Raceway");
    flips = await app_1.ServerApp.getFlipsForTrack(trackNameObj);
    flip = flips.find((f) => {
        return f.when === "A Main"; //Knoxville only has one flip in a A main
    });
    expect(flip.flipId).toEqual("81");
    expect(flip.carClass).toEqual("410 Sprint Car");
    expect(flip.openWheel).toBeTruthy();
    expect(flip.rotations).toEqual("1");
    expect(flip.video).toBeTruthy();
    expect(flip.surface).toEqual("Dirt");
    expect(utilities_1.compareDates(flip.date, new Date('8-09-19'))).toBeTruthy();
    expect(Types_1.TrackName.equals(trackNameObj, flip.trackNameObj)).toBeTruthy();
    trackNameObj = Types_1.TrackName.parse("Lincoln Speedway");
    flips = await app_1.ServerApp.getFlipsForTrack(trackNameObj);
    flip = flips.find((f) => {
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
    expect(utilities_1.compareDates(flip.date, new Date("8-20-20"))).toBeTruthy();
    expect(Types_1.TrackName.equals(trackNameObj, flip.trackNameObj)).toBeTruthy();
});
it('gets date from event string', () => {
    let date = app_1.ServerApp.getDateFromEventString('11-06-20: URC 360 Sprint Cars');
    expect(utilities_1.compareDates(date, new Date('11-06-20'))).toBeTruthy();
    date = app_1.ServerApp.getDateFromEventString("2-5-19: Doesn't matter what we put here");
    expect(utilities_1.compareDates(date, new Date('02-05-19'))).toBeTruthy();
    expect(utilities_1.compareDates(date, new Date('2-05-19'))).toBeTruthy();
});
it('makes dates correctly with different timezones', () => {
    //try to make dates in all different manners.
    //should try this in different computer timezones and make sure it passes
    const date1 = Types_1.makeDate("11-08-20");
    const date2 = Types_1.makeDate(new Date("11-08-20"));
    const date3 = Types_1.makeDate(new Date(Date.parse("11-08-20")));
    expect(date1.getTime()).toEqual(date2.getTime());
    expect(date1.getTime()).toEqual(date3.getTime());
    expect(utilities_1.compareDates(date1, date2)).toBeTruthy();
    expect(utilities_1.compareDates(date1, date3)).toBeTruthy();
});
//more detailed, enriched with other information
fit('returns enriched event info', async () => {
    let trackNameObj = Types_1.TrackName.parse("Bridgeport Motorsports Park");
    let eventInfo = await app_1.ServerApp.getEnrichedEventInfoForDate(trackNameObj, "11-08-20");
    expect(eventInfo.classes).toEqual("Big Block Modifieds, 602 Sportsman Modifieds, USAC SpeedSTRs, Street Stocks");
    expect(utilities_1.compareDates(eventInfo.date, new Date('11-08-20'))).toBeTruthy();
    expect(eventInfo.flips.length).toEqual(3);
    expect(eventInfo.flips[0].carClass).toEqual("USAC SpeedSTR");
    expect(Types_1.TrackName.equals(trackNameObj, eventInfo.flips[0].trackNameObj)).toBeTruthy();
    eventInfo = await app_1.ServerApp.getEnrichedEventInfoForDate(Types_1.TrackName.parse("Kokomo Speedway"), "8-27-20");
    expect(eventInfo.classes).toEqual("Smackdown IX: USAC National Sprint Cars");
    expect(utilities_1.compareDates(eventInfo.date, new Date('8-27-20'))).toBeTruthy();
    expect(eventInfo.flips.length).toEqual(2);
    expect(eventInfo.flips[0].carClass).toEqual("Wingless 410 Sprint Car");
    eventInfo = await app_1.ServerApp.getEnrichedEventInfoForDate(Types_1.TrackName.parse("Texas Motor Speedway (Asphalt Road Course"), "6-9-18");
    expect(eventInfo.classes).toEqual("Verizon IndyCar Series, Stadium Super Trucks [Asphalt Road Course]");
    expect(utilities_1.compareDates(eventInfo.date, new Date('6-9-18'))).toBeTruthy();
    expect(eventInfo.flips.length).toEqual(1);
    expect(eventInfo.flips[0].carClass).toEqual("Stadium Super Truck");
});
it('returns all enriched event infos for a track', async () => {
    let eventInfos = await app_1.ServerApp.getAllEnrichedEventInfosForTrack(Types_1.TrackName.parse("Bridgeport Motorsports Park"));
    expect(eventInfos.length).toBe(3);
    expect(utilities_1.compareDates(eventInfos[0].date, new Date('11-06-20'))).toBeTruthy();
    expect(eventInfos[0].flips.length).toEqual(2);
    expect(utilities_1.compareDates(eventInfos[2].date, new Date('11-08-20'))).toBeTruthy();
    expect(eventInfos[2].classes).toContain("Big Block Modifieds, 602 Sportsman Modifieds");
});
it('returns recap string for a specific event', async () => {
    let recap = await app_1.ServerApp.getSpecificEventRecap(new Date("7-3-20"), Types_1.TrackName.parse("Big Diamond Speedway"));
    expect(recap).toEqual("Testing big diamond. Another sentence.");
    recap = await app_1.ServerApp.getSpecificEventRecap(new Date("11-06-20"), Types_1.TrackName.parse("Bridgeport Motorsports Park"));
    expect(recap).toEqual("Bridgeport first day. First time entering facility at night.\nAnother paragraph.");
});
it('returns list of EventInfos with recap', async () => {
    let recaps = await app_1.ServerApp.getEventsWithRecaps();
    expect(recaps.length).toEqual(3);
    expect(utilities_1.compareDates(recaps[0].date, new Date("7-3-20"))).toBeTruthy();
    expect(utilities_1.compareDates(recaps[1].date, new Date("8-23-20"))).toBeTruthy();
    expect(utilities_1.compareDates(recaps[2].date, new Date("11-6-20"))).toBeTruthy();
});
it('returns the track object for a track name', async () => {
    let track = await app_1.ServerApp.getTrackObjForName(Types_1.TrackName.parse("Big Diamond Speedway"));
    expect(track.print()).toEqual("Big Diamond SpeedwayPA0");
    track = await app_1.ServerApp.getTrackObjForName(Types_1.TrackName.parse("Seekonk Speedway (Asphalt Figure 8)"));
    expect(track.print()).toEqual("Seekonk Speedway (Asphalt Figure 8)MA1");
});
//does a recap for a configuration even make sense? It's always going to be with a full track right?
// it('returns event recap for configuration')
//TODO: currently breaks
// test('capitalization', () => {
// 	expect(server.getCountForTrack("seeKoNK speedWAY")).toBe(46);
// });
//# sourceMappingURL=server.test.js.map