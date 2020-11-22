const server = require('./server');

test('proper counts for track', () => {
  expect(server.getCountForTrack("Seekonk Speedway")).toBe(46);
  expect(server.getCountForTrack("Thompson Speedway")).toBe(28);
  expect(server.getCountForTrack("Rocky Mountain Raceways")).toBe(8);

  //configurations
  expect(server.getCountForTrack("Rocky Mountain Raceways (Asphalt Figure 8)")).toBe(7);
  expect(server.getCountForTrack("Seekonk Speedway (Asphalt Road Course)")).toBe(1);
  expect(server.getCountForTrack("Stafford Motor Speedway (Inner Asphalt Oval)")).toBe(1);
});

