"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareDates = void 0;
const Types_1 = require("./Types");
function cleanDate(dateRaw) {
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
function compareDates(date1, date2) {
    return Types_1.makeDate(date1).getTime() === Types_1.makeDate(date2).getTime();
}
exports.compareDates = compareDates;
//# sourceMappingURL=utilities.js.map