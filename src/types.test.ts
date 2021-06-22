import {Track_old, TrackName, TrackTypeEnum} from "./Types";

it('Track utility functions', () => {
  const track = new Track_old(TrackName.parse("Seekonk Speedway"), "MA", TrackTypeEnum.OVAL, 100, -200, 46, []);
  // expect(track.print()).toEqual("TODO"); //TODO: what is this supposed to be?
  expect(track.coordinates).toEqual([-200, 100]);
});

it('TrackName parse function from string', () => {
  const track1: TrackName = TrackName.parse("Seekonk Speedway");
  const track2: TrackName = TrackName.parse("Seekonk Speedway (Asphalt Road Course)");

  expect(track1.baseName).toEqual("Seekonk Speedway");
  expect(track1.isConfiguration).toBeFalsy;
  expect(track1.configuration).toBeNull;

  expect(track2.baseName).toEqual("Seekonk Speedway");
  expect(track2.isConfiguration).toBeTruthy;
  expect(track2.configuration).toEqual("Asphalt Road Course");
});

it('TrackName parse function from object', () => {
  const jsonObj1: {baseName: string, isConfiguration: boolean, configuration: string | null} = 
    {baseName: "Seekonk Speedway", isConfiguration: false, configuration: null};
  const jsonObj2: {baseName: string, isConfiguration: boolean, configuration: string | null} = 
    {baseName: "Seekonk Speedway", isConfiguration: true, configuration: "Asphalt Road Course"};

  const track1: TrackName = TrackName.parse(jsonObj1);
  const track2: TrackName = TrackName.parse(jsonObj2);

  expect(track1.baseName).toEqual("Seekonk Speedway");
  expect(track1.isConfiguration).toBeFalsy;
  expect(track1.configuration).toBeNull;

  expect(track2.baseName).toEqual("Seekonk Speedway");
  expect(track2.isConfiguration).toBeTruthy;
  expect(track2.configuration).toEqual("Asphalt Road Course");
});

it('TrackName equals function', () => {
  const track1: TrackName = TrackName.parse("Seekonk Speedway");
  const track2: TrackName = TrackName.parse("Seekonk Speedway (Asphalt Road Course)");
  const track3: TrackName = TrackName.parse("Pocatello Speedway");
  const track4: TrackName = TrackName.parse("Seekonk Speedway");
  expect(TrackName.equals(track1, track2)).toBeFalsy;
  expect(TrackName.equals(track1, track3)).toBeFalsy;
  expect(TrackName.equals(track1, track4)).toBeTruthy;
  expect(TrackName.equals(track2, track4)).toBeFalsy;
});

it('TrackName print function', () => {
  const track1Str = "Seekonk Speedway";
  const track2Str = "Seekonk Speedway (Asphalt Road Course)";
  const track1: TrackName = TrackName.parse(track1Str);
  const track2: TrackName = TrackName.parse(track2Str);
  expect(track1.print()).toEqual(track1Str);
  expect(track2.print()).toEqual(track2Str);
})