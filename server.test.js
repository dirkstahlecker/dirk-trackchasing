const server = require('./server');

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

// test('invalid track names', () => {
// 	let info = server.getTrackNameAndConfiguration("Not a Real Track");
// 	expect(info.trackName).toBe("");
// 	expect(info.configuration).toBeNull();
// 	expect(info.isConfiguration).toBe(false);
// });

test('proper counts for track', () => {
  expect(server.getCountForTrack("Seekonk Speedway")).toBe(46);
  expect(server.getCountForTrack("Thompson Speedway")).toBe(28);
  expect(server.getCountForTrack("Rocky Mountain Raceways")).toBe(8);

  //configurations
  expect(server.getCountForTrack("Rocky Mountain Raceways (Asphalt Figure 8)")).toBe(7);
  expect(server.getCountForTrack("Seekonk Speedway (Asphalt Road Course)")).toBe(1);
  expect(server.getCountForTrack("Stafford Motor Speedway (Inner Asphalt Oval)")).toBe(1);
});

test('getTrackFullInfo', () => {
	const info = server.getTrackFullInfo();
	const seekonk = info["Seekonk Speedway"];
	expect(seekonk.state).toBe("MA");
	expect(seekonk.count).toBe(46);

	const pocatello = info["Pocatello Speedway"];
	expect(pocatello.state).toBe("ID");
	expect(pocatello.latitude).toBe(42.912684);
	expect(pocatello.longitude).toBe(-112.577022);
	expect(pocatello.count).toBe(6);

	const rmr8 = info["Rocky Mountain Raceways (Asphalt Figure 8)"];
	expect(rmr8.state).toBe("UT");
	expect(rmr8.count).toBe(7);

	const la = info["Port of LA"];
	expect(la.state).toBe("CA");
	expect(la.count).toBe(1);
});

//TODO: currently breaks
// test('capitalization', () => {
// 	expect(server.getCountForTrack("seeKoNK speedWAY")).toBe(46);
// });