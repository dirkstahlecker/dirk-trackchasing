//this is copied between client and server - make sure they stay in sync

import { makeDate } from "./DEPRECATED_Types";

export function compareDates(date1: Date, date2: Date): boolean
{
	return makeDate(date1).getTime() === makeDate(date2).getTime();
}
