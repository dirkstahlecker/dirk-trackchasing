import { TrackName } from "./Types";

export function getRecapStringForTrackAndDate(date: Date, track: TrackName): string | null
{
  const trackStr: string = track.print().toLowerCase().split(" ").join("_");
  const comparisonString: string = `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}_${trackStr}`;
  
  //these are the names of the recap files - need to match the generated date for the date and track
  const eventsWithRecap: string[] = [
    "11-6-2020_bridgeport_motorsports_park"
  ];

  console.log(comparisonString)

  const indexOf = eventsWithRecap.indexOf(comparisonString);
  if (indexOf > -1)
  {
    return eventsWithRecap[indexOf];
  }

  return null;
}
