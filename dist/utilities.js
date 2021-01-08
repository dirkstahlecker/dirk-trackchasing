"use strict";
//this is copied between client and server - make sure they stay in sync
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareDates = void 0;
const Types_1 = require("./Types");
function compareDates(date1, date2) {
    return Types_1.makeDate(date1).getTime() === Types_1.makeDate(date2).getTime();
}
exports.compareDates = compareDates;
//# sourceMappingURL=utilities.js.map