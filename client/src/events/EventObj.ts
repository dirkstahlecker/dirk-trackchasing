import { Flip } from "./Flip";

export class EventObj
{
  public date: string;
  public classes: string;
  public flips: Flip[];
  // public notableCrashes: ; //TODO

  constructor(date: string, classes: string, flips: Flip[])
  {
    this.date = date;
    this.classes = classes;
    this.flips = flips;
  }

  static parseEvent(json: any): EventObj
  {
    return new EventObj(json["date"], json["classes"], json["flips"]); //TODO: flips probably won't work
  }
}
