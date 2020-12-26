import path from 'path';
import { makeDate } from './app';
import { TrackName } from './Types';
var fs = require('fs');


//used as a key for the EventsRecapObj
function makeKeyStr(date: Date, trackName: TrackName): string
{
  const month: number = date.getMonth() + 1;
  const day: number = date.getDate() + 1;
  const year: number = date.getFullYear();
  return month + '-' + day + '-' + year + ':' + trackName.print();
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
  private static dataPath: string = "../event_recaps.txt";

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

  public static getListOfEventsWithRecap(): string[]
  {
    const ret: string[] = [];
    //return a list of strings, where the string is the date and track made by the makeKey function
    for (let obj in EventRecaps.fullEventsObj)
    {
      ret.push(obj);
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
