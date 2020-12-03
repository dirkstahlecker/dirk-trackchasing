import { Flip } from "./Flip";

export class Event
{
  // { date: string , classes: string , flips: [flip] , notableCrashes: ?? }
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
}
