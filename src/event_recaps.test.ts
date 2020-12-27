import { EventRecaps } from "./eventRecaps";
import { TrackName } from "./Types";
import { makeDate } from "./utilities";

it('parses the event recap text file properly', async() => {
  await EventRecaps.parse();
  expect(EventRecaps.TESTPIN_fullEventsObj['7-3-2020:Big Diamond Speedway'])
    .toEqual('Testing big diamond. Another sentence.');
  
  expect(EventRecaps.TESTPIN_fullEventsObj['11-6-2020:Bridgeport Motorsports Park'])
    .toEqual('Bridgeport first day. First time entering facility at night.\n' +
    'Another paragraph.')
});

it('gets event text from date', async() => {
  await EventRecaps.parse();
  expect(EventRecaps.getRecapForEvent(makeDate("7-3-20"), TrackName.parse("Big Diamond Speedway")))
    .toEqual('Testing big diamond. Another sentence.');
});
