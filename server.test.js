const server = require('./server');
const parser = require('./parser')

//npm run test

test('track name and configuration', () => {
	let info = server.getTrackNameAndConfiguration("Seekonk Speedway");
	expect(info.trackName).toBe("Seekonk Speedway");
	expect(info.configuration).toBeNull();
	expect(info.isConfiguration).toBe(false);

	info = server.getTrackNameAndConfiguration("Seekonk Speedway (Asphalt Figure 8)");
	expect(info.trackName).toBe("Seekonk Speedway");
	expect(info.configuration).toBe("Asphalt Figure 8");
	expect(info.isConfiguration).toBe(true);

	info = server.getTrackNameAndConfiguration("Texas Motor Speedway (Asphalt Road Course)");
	expect(info.trackName).toBe("Texas Motor Speedway");
	expect(info.configuration).toBe("Asphalt Road Course");
	expect(info.isConfiguration).toBe(true);
});

it('returns proper track list', async() => {
	//order isn't definitively set for the first 7
	const list = await server.getTrackList();
	expect(list[8]).toEqual("Miller Motorsports Park");
	expect(list[21]).toEqual("Port of LA");
	expect(list[32]).toEqual("Wall Stadium Speedway (Inner Asphalt Oval)");
	expect(list[89]).toEqual("Bridgeport Motorsports Park");
});

//TODO: Currently broken
// test('invalid track names', () => {
// 	let info = server.getTrackNameAndConfiguration("Not a Real Track");
// 	expect(info.trackName).toBe("");
// 	expect(info.configuration).toBeNull();
// 	expect(info.isConfiguration).toBe(false);
// });

it('proper counts for track', async() => {
	server.getCountForTrack("Seekonk Speedway").then(data => expect(data).toEqual(46));
  server.getCountForTrack("Thompson Speedway").then(data => expect(data).toEqual(28));
  server.getCountForTrack("Rocky Mountain Raceways").then(data => expect(data).toEqual(8));

  //configurations
  server.getCountForTrack("Rocky Mountain Raceways (Asphalt Figure 8)").then(data => expect(data).toEqual(7));
  server.getCountForTrack("Seekonk Speedway (Asphalt Road Course)").then(data => expect(data).toEqual(1));
  server.getCountForTrack("Stafford Motor Speedway (Inner Asphalt Oval)").then(data => expect(data).toEqual(1));
});

test('getTrackFullInfo', async() => {
	const info = await server.getTrackFullInfo();

	const seekonk = info["Seekonk Speedway"];
	expect(seekonk.state).toBe("MA");
	expect(seekonk.count).toBe(46);
	expect(seekonk.flips.length).toEqual(12);

	const pocatello = info["Pocatello Speedway"];
	expect(pocatello.state).toBe("ID");
	expect(pocatello.latitude).toBe(42.912684);
	expect(pocatello.longitude).toBe(-112.577022);
	expect(pocatello.count).toBe(6);
	expect(pocatello.flips.length).toEqual(1);

	const rmr = info["Rocky Mountain Raceways"];
	expect(rmr.state).toBe("UT");
	expect(rmr.count).toBe(8);
	expect(rmr.flips.length).toEqual(2);

	const rmr8 = info["Rocky Mountain Raceways (Asphalt Figure 8)"];
	expect(rmr8.state).toBe("UT");
	expect(rmr8.count).toBe(7);
	expect(rmr8.flips).toBeUndefined();

	const stafford = info["Stafford Motor Speedway (Inner Asphalt Oval)"];
	expect(stafford.state).toBe("CT");
	expect(stafford.count).toBe(1);
	expect(stafford.flips).toBeUndefined();

	const la = info["Port of LA"];
	expect(la.state).toBe("CA");
	expect(la.count).toEqual(1);
	expect(la.flips).toBeUndefined();
});

it('number of flips per track', async() => {
	let flips = await server.getFlipsForTrack("Eldora Speedway");
	expect(flips.length).toBe(3);

	flips = await server.getFlipsForTrack("Bridgeport Motorsports Park");
	expect(flips.length).toBe(7);

	flips = await server.getFlipsForTrack("Gateway Dirt Nationals");
	expect(flips.length).toBe(17);

	flips = await server.getFlipsForTrack("Pocatello Speedway");
	expect(flips.length).toBe(1);

	flips = await server.getFlipsForTrack("Atomic Motor Raceway");
	expect(flips.length).toBe(1);

	flips = await server.getFlipsForTrack("Lucas Oil Speedway Off Road Course");
	expect(flips.length).toBe(4);
});

it('flip objects', async() => {
	let flips = await server.getFlipsForTrack("Pocatello Speedway");
	expect(flips.length).toBe(1);

	let flip = flips[0];
	expect(flip.flipId).toEqual("20");
	expect(flip.class).toEqual("Champ Kart");
	expect(flip.openWheel).toBeTruthy();
	expect(flip.rotations).toEqual("1/4");
	expect(flip.video).toBeFalsy();

	flips = await server.getFlipsForTrack("Knoxville Raceway");
	flip = flips.find((f) => {
		return f.when === "A Main"; //Knoxville only has one flip in a A main
	});
	expect(flip.flipId).toEqual("81");
	expect(flip.class).toEqual("410 Sprint Car");
	expect(flip.openWheel).toBeTruthy();
	expect(flip.rotations).toEqual("1");
	expect(flip.video).toBeTruthy();
	expect(flip.surface).toEqual("Dirt");
	expect(flip.date).toEqual("2019-08-09T04:00:00.000Z");

	flips = await server.getFlipsForTrack("Lincoln Speedway");
	flip = flips.find((f) => {
		return f.class === "Super Late Model";
	});
	expect(flip.flipId).toEqual("158");
	expect(flip.openWheel).toBeFalsy();
	expect(flip.rotations).toEqual("1/2+");
	expect(flip.video).toBeFalsy();
	expect(flip.surface).toEqual("Dirt");
	expect(flip.when).toEqual("Main")
	expect(flip.notes).toBeTruthy();
	expect(flip.notes.includes("Turn 3")).toBeTruthy();
	expect(flip.date).toEqual("2020-08-20T04:00:00.000Z");
});

//TODO: currently breaks
// test('capitalization', () => {
// 	expect(server.getCountForTrack("seeKoNK speedWAY")).toBe(46);
// });


