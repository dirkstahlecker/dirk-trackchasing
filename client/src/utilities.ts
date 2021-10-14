//this is copied between client and server - make sure they stay in sync

import { makeDate } from "./Types";

export function compareDates(date1: Date, date2: Date): boolean
{
	return makeDate(date1).getTime() === makeDate(date2).getTime();
}

export function printDate(date: Date | undefined): string
{
	if (date === undefined)
	{
		return "";
	}
	return date.toDateString();
}