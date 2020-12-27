import path from 'path';
import { makeDate, ServerApp } from './app';
import { runningJestTest } from './parser';
import { EventInfo, Track, TrackName } from './Types';
var fs = require('fs');


//used as a key for the EventsRecapObj
function makeKeyStr(date: Date, trackName: TrackName): string
{
  const month: number = date.getMonth() + 1;
  const day: number = date.getDate() + 1;
  const year: number = date.getFullYear();
  return month + '-' + day + '-' + year + ':' + trackName.print();
}

function unpackFromKey(keyStr: string): {date: Date, track: TrackName}
{
  // const {date: Date, track: TrackName} = 
  const pieces: string[] = keyStr.split(":");
  if (pieces.length != 2)
  {
    throw new Error("input string isn't decodable to date and trackName");
  }
  const date: Date = new Date(pieces[0]);
  const track: TrackName = TrackName.parse(pieces[1]);

  return {date, track};
}

type EventRecapsObj =
{
  //key is made by DateAndTrackName.makeKeyStr()
  //key is a unique date and track
  //string is the recap text
  [key: string] : string;
}

export abstract class EventRecaps
{
  private static readonly DATA_PATH: string = "../event_recaps.txt";
  private static readonly TEST_DATA_PATH: string = "../event_recaps_test.txt";

  private static get dataPath(): string
	{
		return runningJestTest() ? this.TEST_DATA_PATH : this.DATA_PATH;
	}

  private static fullEventsObj: EventRecapsObj = {};

  public static get TESTPIN_fullEventsObj(): EventRecapsObj
  {
    return EventRecaps.fullEventsObj;
  }

  private static async readFile(): Promise<string>
  {
    const recapFilePath = path.join(__dirname, this.dataPath);
    const text: string = await fs.readFileSync(recapFilePath, 'utf8');
    return text;
  }

  public static async parse(): Promise<void>
  {
    const fullText: string = await this.readFile();

    const regex: RegExp = /([\d]{1,2}-[\d]{1,2}-[\d]{1,2})\s+([^:]+):([^;]+)/mg;

    let match;
    while ((match = regex.exec(fullText)) !== null)
    {
        // This is necessary to avoid infinite loops with zero-width matches
        if (match.index === regex.lastIndex)
        {
          regex.lastIndex++;
        }

        //match[0] is the full match, we don't use it here

        const dateStr: string = match[1];
        const trackStr: string = match[2];
        const trackName: TrackName = TrackName.parse(trackStr);
        let recapStr: string = match[3];
        recapStr = recapStr.trim();

        const key: string = makeKeyStr(makeDate(dateStr), trackName);
        EventRecaps.fullEventsObj[key] = recapStr;
    }
  }

  public static async getListOfEventsWithRecap(): Promise<EventInfo[]>
  {
    const ret: EventInfo[] = [];
    //return a list of strings, where the string is the date and track made by the makeKey function
    for (let objKey in EventRecaps.fullEventsObj)
    {
      const {date, track} = unpackFromKey(objKey);
      const eventInfo: EventInfo = await ServerApp.getEnrichedEventInfoForDate(track, date);
      ret.push(eventInfo);
    }

    return ret;
  }

  public static getRecapForEvent(dateRaw: Date | string, track: TrackName): string | null
  {
    const date: Date = makeDate(dateRaw);
    const key = makeKeyStr(date, track);
    return EventRecaps.fullEventsObj[key];
  }
}
