import {Server} from "./server";
// const parser = require('./parser')
import {Track, TrackName, TrackTypeEnum} from "./Types";

//npm run test

const server: Server = new Server();

it('track name and configuration', () => {
	let info: TrackName = TrackName.parse("Seekonk Speedway");
	expect(info.baseName).toBe("Seekonk Speedway");
	expect(info.configuration).toBeNull();
	expect(info.isConfiguration).toBe(false);

	info = TrackName.parse("Seekonk Speedway (Asphalt Figure 8)");
	expect(info.baseName).toBe("Seekonk Speedway");
	expect(info.configuration).toBe("Asphalt Figure 8");
	expect(info.isConfiguration).toBe(true);

	info = TrackName.parse("Texas Motor Speedway (Asphalt Road Course)");
	expect(info.baseName).toBe("Texas Motor Speedway");
	expect(info.configuration).toBe("Asphalt Road Course");
	expect(info.isConfiguration).toBe(true);
});

it('returns proper track list', async() => {
	//order isn't definitively set for the first 7
	const list = await server.getTrackList();
	expect(list.length).toEqual(90);
	expect(list[8]).toEqual("Miller Motorsports Park");
	expect(list[21]).toEqual("Port of LA");
	expect(list[32]).toEqual("Wall Stadium Speedway (Inner Asphalt Oval)");
	expect(list[89]).toEqual("Bridgeport Motorsports Park");
});

it('returns proper track list without configurations', async() => {
	const list = await server.getTrackListNoConfigurations();
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

it('proper counts for track', async() => {
	server.getCountForTrack(TrackName.parse("Seekonk Speedway")).then(data => expect(data).toEqual(46));
  server.getCountForTrack(TrackName.parse("Thompson Speedway")).then(data => expect(data).toEqual(28));
  server.getCountForTrack(TrackName.parse("Rocky Mountain Raceways")).then(data => expect(data).toEqual(8));

  //configurations
  server.getCountForTrack(TrackName.parse("Rocky Mountain Raceways (Asphalt Figure 8)")).then(data => expect(data).toEqual(7));
  server.getCountForTrack(TrackName.parse("Seekonk Speedway (Asphalt Road Course)")).then(data => expect(data).toEqual(1));
  server.getCountForTrack(TrackName.parse("Stafford Motor Speedway (Inner Asphalt Oval)")).then(data => expect(data).toEqual(1));
});

it('getTrackFullInfo', async() => {
	const trackInfos: Track[] = await server.getTrackFullInfo();

	// const seekonk = info["Seekonk Speedway"]; //failing due to flips not having dates
	// expect(seekonk.state).toBe("MA");
	// expect(seekonk.count).toBe(46);
	// expect(seekonk.flips.length).toEqual(12);

	const pocatello: Track = trackInfos.find((track: Track) => {
		return TrackName.equals(track.trackNameObj, TrackName.parse("Pocatello Speedway"));
	});
	expect(pocatello.state).toBe("ID");
	expect(pocatello.latitude).toBe(42.912684);
	expect(pocatello.longitude).toBe(-112.577022);
	expect(pocatello.count).toBe(6);
	expect(pocatello.trackType).toEqual(TrackTypeEnum.OVAL);
	expect(pocatello.flips.length).toEqual(0);

	const pocatelloInner: Track = trackInfos.find((track: Track) => {
		return TrackName.equals(track.trackNameObj, TrackName.parse("Pocatello Speedway (Inner Dirt Oval)"));
	});
	expect(pocatelloInner.state).toBe("ID");
	expect(pocatelloInner.latitude).toBeUndefined();
	expect(pocatelloInner.longitude).toBeUndefined();
	expect(pocatelloInner.flips.length).toEqual(1);

	const rmr: Track = trackInfos.find((track: Track) => {
		return TrackName.equals(track.trackNameObj, TrackName.parse("Rocky Mountain Raceways"));
	});
	expect(rmr.state).toBe("UT");
	expect(rmr.count).toBe(8);
	expect(rmr.flips.length).toEqual(2);

	const rmr8: Track = trackInfos.find((track: Track) => {
		return TrackName.equals(track.trackNameObj, TrackName.parse("Rocky Mountain Raceways (Asphalt Figure 8)"));
	});
	expect(rmr8.state).toBe("UT");
	expect(rmr8.count).toBe(7);
	expect(rmr8.flips.length).toEqual(0);

	const stafford: Track = trackInfos.find((track: Track) => {
		return TrackName.equals(track.trackNameObj, TrackName.parse("Stafford Motor Speedway"));
	});
	expect(stafford.state).toBe("CT");
	expect(stafford.count).toBe(18);
	expect(stafford.flips.length).toEqual(0);

	const la: Track = trackInfos.find((track: Track) => {
		return TrackName.equals(track.trackNameObj, TrackName.parse("Port of LA"));
	});
	expect(la.state).toBe("CA");
	expect(la.count).toEqual(1);
	expect(la.flips.length).toEqual(0);

	const texas: Track = trackInfos.find((track: Track) => {
		return TrackName.equals(track.trackNameObj, TrackName.parse("Texas Motor Speedway"));
	});
	expect(texas.state).toEqual("TX");
	expect(texas.count).toEqual(2);
	expect(texas.flips.length).toEqual(0);

	const texasRC: Track = trackInfos.find((track: Track) => {
		return TrackName.equals(track.trackNameObj, TrackName.parse("Texas Motor Speedway (Asphalt Road Course)"));
	});
	expect(texasRC.state).toEqual("TX");
	expect(texasRC.count).toEqual(1);
	expect(texasRC.flips.length).toEqual(1);
});

// //just the basic strings from the json
it('getEventStringsForTrack', async() => {
	let info = await server.getEventStringsForTrack(TrackName.parse("Seekonk Speedway"));
	expect(info.length).toEqual(46);
	expect(info[0]).toEqual("7-13-16: US Pro stock nationals, INEX legends, pro 4 modifieds");

	info = await server.getEventStringsForTrack(TrackName.parse("Pocatello Speedway"));
	expect(info.length).toEqual(6);

	info = await server.getEventStringsForTrack(TrackName.parse("Pocatello Speedway (Inner Dirt Oval)"));
	expect(info.length).toEqual(1);
	expect(info[0]).toEqual("7-23-16: ASA Pro Trucks, Street Stocks, Modifieds, Hornets, Junkyard Dogs, Karts [Inner Dirt Oval]")

	info = await server.getEventStringsForTrack(TrackName.parse("Thompson Speedway - Rallycross"));
	expect(info.length).toEqual(2);
	expect(info[0]).toEqual("6-03-17: Global Rallycross Championship: GRC Supercars, GRC Lites");
	expect(info[1]).toEqual("6-04-17: Global Rallycross Championship: GRC Supercars, GRC Lites");

	info = await server.getEventStringsForTrack(TrackName.parse("New Hampshire Motor Speedway (Asphalt Legends Oval)"));
	expect(info.length).toEqual(1);
	expect(info[0]).toEqual("9-12-20: Whelen Modifieds Musket 200, ACT Late Models, Legends [Asphalt Legends Oval]");
})

it('number of flips per track', async() => {
	let flips = await server.getFlipsForTrack(TrackName.parse("Eldora Speedway"));
	expect(flips.length).toBe(3);

	flips = await server.getFlipsForTrack(TrackName.parse("Bridgeport Motorsports Park"));
	expect(flips.length).toBe(7);

	flips = await server.getFlipsForTrack(TrackName.parse("Gateway Dirt Nationals"));
	expect(flips.length).toBe(17);

	flips = await server.getFlipsForTrack(TrackName.parse("Pocatello Speedway"));
	expect(flips.length).toBe(0);

	flips = await server.getFlipsForTrack(TrackName.parse("Pocatello Speedway (Inner Dirt Oval)"));
	expect(flips.length).toBe(1);

	flips = await server.getFlipsForTrack(TrackName.parse("Atomic Motor Raceway"));
	expect(flips.length).toBe(1);

	flips = await server.getFlipsForTrack(TrackName.parse("Lucas Oil Speedway Off Road Course"));
	expect(flips.length).toBe(4);

	flips = await server.getFlipsForTrack(TrackName.parse("Texas Motor Speedway")); //only a flip at the configuration
	expect(flips.length).toEqual(0);

	flips = await server.getFlipsForTrack(TrackName.parse("Texas Motor Speedway (Asphalt Road Course)"));
	expect(flips.length).toEqual(1);
});

it('flip objects', async() => {
	let flips = await server.getFlipsForTrack(TrackName.parse("Pocatello Speedway (Inner Dirt Oval"));
	expect(flips.length).toBe(1);

	let flip = flips[0];
	expect(flip.flipId).toEqual("20");
	expect(flip.carClass).toEqual("Champ Kart");
	expect(flip.openWheel).toBeTruthy();
	expect(flip.rotations).toEqual("1/4");
	expect(flip.video).toBeFalsy();

	flips = await server.getFlipsForTrack(TrackName.parse("Knoxville Raceway"));
	flip = flips.find((f) => {
		return f.when === "A Main"; //Knoxville only has one flip in a A main
	});
	expect(flip.flipId).toEqual("81");
	expect(flip.carClass).toEqual("410 Sprint Car");
	expect(flip.openWheel).toBeTruthy();
	expect(flip.rotations).toEqual("1");
	expect(flip.video).toBeTruthy();
	expect(flip.surface).toEqual("Dirt");
	expect(flip.date).toEqual(new Date("8-09-19"));

	flips = await server.getFlipsForTrack(TrackName.parse("Lincoln Speedway"));
	flip = flips.find((f) => {
		return f.carClass === "Super Late Model";
	});
	expect(flip.flipId).toEqual("158");
	expect(flip.openWheel).toBeFalsy();
	expect(flip.rotations).toEqual("1/2+");
	expect(flip.video).toBeFalsy();
	expect(flip.surface).toEqual("Dirt");
	expect(flip.when).toEqual("Main")
	expect(flip.notes).toBeTruthy();
	expect(flip.notes.includes("Turn 3")).toBeTruthy();
	expect(flip.date).toEqual(new Date("8-20-20"));
});

it('gets date from event string', () => {
	let date = server.getDateFromEventString('11-06-20: URC 360 Sprint Cars');
	expect(date).toEqual(new Date('11-06-20'));

	date = server.getDateFromEventString("2-5-19: Doesn't matter what we put here");
	expect(date).toEqual(new Date('02-05-19'));
});

//more detailed, enriched with other information
it('returns enriched event info', async() => {
	let eventInfo = await server.getEnrichedEventInfoForDate(TrackName.parse("Bridgeport Motorsports Park"), "11-08-20");
	expect(eventInfo.classes).toEqual("Big Block Modifieds, 602 Sportsman Modifieds, USAC SpeedSTRs, Street Stocks");
	expect(eventInfo.date).toEqual(new Date("11-08-20"));
	expect(eventInfo.flips.length).toEqual(3);
	expect(eventInfo.flips[0].carClass).toEqual("USAC SpeedSTR");

	//TODO: test flips on configuration once I actually have one

	eventInfo = await server.getEnrichedEventInfoForDate(TrackName.parse("Kokomo Speedway"), "8-27-20");
	expect(eventInfo.classes).toEqual("Smackdown IX: USAC National Sprint Cars");
	expect(eventInfo.date).toEqual(new Date("8-27-20"));
	expect(eventInfo.flips.length).toEqual(2);
	expect(eventInfo.flips[0].carClass).toEqual("Wingless 410 Sprint Car");

	// eventInfo = await server.getEnrichedEventInfoForDate("Texas Motor Speedway", "8-27-20");
	// expect(eventInfo.classes).toEqual("Smackdown IX: USAC National Sprint Cars");
	// expect(eventInfo.date).toEqual(new Date("8-27-20"));
	// expect(eventInfo.flips.length).toEqual(2);
	// expect(eventInfo.flips[0].class).toEqual("Wingless 410 Sprint Car");
});

it('returns all enriched event infos for a track', async() => {
	let eventInfos = await server.getAllEnrichedEventInfosForTrack(TrackName.parse("Bridgeport Motorsports Park"));
	expect(eventInfos.length).toBe(3);
	expect(eventInfos[0].date).toEqual(new Date("11-06-20"));
	expect(eventInfos[0].flips.length).toEqual(2);
	expect(eventInfos[2].date).toEqual(new Date("11-08-20"));
	expect(eventInfos[2].classes).toContain("Big Block Modifieds, 602 Sportsman Modifieds");
});


//TODO: currently breaks
// test('capitalization', () => {
// 	expect(server.getCountForTrack("seeKoNK speedWAY")).toBe(46);
// });


