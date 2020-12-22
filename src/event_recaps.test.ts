import { EventRecaps } from "./eventRecaps";

it('parses the event recap text file properly', async() => {
  await EventRecaps.parse();
  expect(EventRecaps.TESTPIN_fullEventsObj['7-03-20:Big Diamond Speedway'])
    .toEqual('Testing big diamond. Another sentence.');
  
  expect(EventRecaps.TESTPIN_fullEventsObj['11-06-20:Bridgeport Motorsports Park'])
    .toEqual('Bridgeport first day. First time entering facility at night.\n' +
    'Another paragraph.')
});