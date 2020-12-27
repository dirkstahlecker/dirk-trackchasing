function cleanDate(dateRaw: string)
{
	throw new Error("Not implemented");
	// if (dateRaw === undefined)
	// {
	// 	return "";
	// }

	// date = "";
	// dateParts = dateRaw.split("-");

	// const month = dateParts[0];
	// const monthNum = parseInt(month)
	// if (monthNum < 10)
	// {
	// 	date += "0" + monthNum.toString();
	// }
	// else
	// {
	// 	date += month;
	// }
	// date += "-"

	// const day = dateParts[1];
	// const dayNum = parseInt(day);
	// if (dayNum < 10)
	// {
	// 	date += "0" + dayNum.toString();
	// }
	// else
	// {
	// 	date += day;
	// }
	// date += "-";

	// const year = dateParts[2];
	// const yearNum = parseInt(year);
	// if (yearNum < 10)
	// {
	// 	date += "0" + yearNum.toString();
	// }
	// else
	// {
	// 	date += year;
	// }

	// if (date.length !== 8)
	// {
	// 	throw Error("Invalid date: " + date);
	// }

	// return date;
}

exports.cleanDate = cleanDate;

export function compareDates(date1: Date, date2: Date): boolean
{
	return makeDate(date1).getTime() === makeDate(date2).getTime();
}

export function makeDate(input: string | Date): Date
{
	if (input instanceof Date)
	{
		const d = new Date(Date.UTC(input.getFullYear(), input.getMonth(), input.getUTCDate()));
		return d;
	}
	const d = new Date(Date.parse(input));
	const fixedDate = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getUTCDate()));
	return fixedDate;
}