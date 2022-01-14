function makeString(value: string | undefined): string
{
  if (value === undefined || value === "undefined" || value === "")
  {
    value = "NULL";
  }
  else if (typeof value === "string")
  {
    value = value.replace("'", "''");
    value = `'${value}'`;
  }

  return value;
}

export function doConversion(): string //want to outupt a sql query to insert everything
{
  //INSERT INTO tracks (name, state, city, surface, length, type, latitude, longitude) VALUES
  //('Star Speedway', 'NH', 'Epping', 'Asphalt', '0.25', 'Oval', '43.029218', '-71.040663');

  let queryString = "INSERT INTO tracks (name, state, city, surface, length, type, latitude, longitude) VALUES ";
  for (let i in excelJsonData)
  {
    const trackJson = excelJsonData[i];

    //if undefined, needs to be null

    queryString += `
    (${makeString(trackJson['Track'])}, ${makeString(trackJson["State"])}, ${makeString(trackJson["City"])}, 
    ${makeString(trackJson["Surface"])}, ${makeString(trackJson['Length'])}, ${makeString(trackJson["Type"])}, 
    ${makeString(trackJson["Latitude"])}, ${makeString(trackJson["Longitude"])}),`
  }

  queryString = queryString.substring(0, queryString.length - 1); //remove comma
  queryString += ";";

  console.log(queryString)
  return "";
}

const excelJsonData = JSON.parse(
`{
  "6": {
    "Track": "Miller Motorsports Park",
    "Date": "2009-05-17T04:00:00.000Z",
    "State": "UT",
    "City": "Tooele",
    "Type": "Road Course",
    "Surface": "Asphalt",
    "Length": 3,
    "Latitude": 40.580394,
    "Longitude": -112.378375
  },
  "7": {
    "Track": "Phoenix International Raceway",
    "Date": 2009,
    "State": "AZ",
    "City": "Avondale",
    "Type": "Oval",
    "Surface": "Asphalt",
    "Length": 1,
    "Latitude": 33.37478,
    "Longitude": -112.310508
  },
  "8": {
    "Track": "Rocky Mountain Raceways",
    "Date": "2010-09-19T04:00:00.000Z",
    "State": "UT",
    "City": "West Valley City",
    "Type": "Oval",
    "Surface": "Asphalt",
    "Length": 0.375,
    "Latitude": 40.71917,
    "Longitude": -112.046914
  },
  "9": {
    "Track": "Rocky Mountain Raceways (Asphalt Figure 8)",
    "Date": "2010-09-19T04:00:00.000Z",
    "State": "UT",
    "City": "West Valley City",
    "Type": "Figure 8",
    "Surface": "Asphalt"
  },
  "10": {
    "Track": "Atomic Motor Raceway",
    "Date": "2010-09-25T04:00:00.000Z",
    "State": "ID",
    "City": "Atomic City",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.33,
    "Latitude": 43.446541,
    "Longitude": -112.811413
  },
  "11": {
    "Track": "Stuart Speedway",
    "Date": "2012-07-29T04:00:00.000Z",
    "State": "NE",
    "City": "Stuart",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.25,
    "Latitude": 42.607193,
    "Longitude": -99.139804
  },
  "12": {
    "Track": "Wakeeney Speedway",
    "Date": "2012-08-01T04:00:00.000Z",
    "State": "KS",
    "City": "Wakeeney",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.375,
    "Latitude": 39.024411,
    "Longitude": -99.86834
  },
  "13": {
    "Track": "Miller Motorsports Park Off Road Course",
    "Date": "2013-06-23T04:00:00.000Z",
    "State": "UT",
    "City": "Tooele",
    "Type": "Road Course",
    "Surface": "Dirt",
    "Latitude": 40.585406,
    "Longitude": -112.385315
  },
  "14": {
    "Track": "New Hampshire Motor Speedway",
    "Date": "2013-09-22T04:00:00.000Z",
    "State": "NH",
    "City": "Loudon",
    "Type": "Oval",
    "Surface": "Asphalt",
    "Length": 1.058,
    "Latitude": 43.36241,
    "Longitude": -71.460713
  },
  "15": {
    "Track": "Nassau Coliseum Parking Lot",
    "Date": "2014-07-20T04:00:00.000Z",
    "State": "NY",
    "City": "Uniondale",
    "Type": "Road Course",
    "Surface": "Mixed",
    "Latitude": 40.72072,
    "Longitude": -73.589474
  },
  "16": {
    "Track": "Rocky Mountain Raceways (Inner Asphalt Oval)",
    "Date": "2014-08-16T04:00:00.000Z",
    "State": "UT",
    "City": "West Valley City",
    "Type": "Oval",
    "Surface": "Asphalt"
  },
  "17": {
    "Track": "Rocky Mountain Raceways (Asphalt Road Course)",
    "Date": "2015-08-15T04:00:00.000Z",
    "State": "UT",
    "City": "West Valley City",
    "Type": "Road Course",
    "Surface": "Asphalt"
  },
  "18": {
    "Track": "Seekonk Speedway",
    "Date": "2016-07-13T04:00:00.000Z",
    "State": "MA",
    "City": "Seekonk",
    "Type": "Oval",
    "Surface": "Asphalt",
    "Length": 0.33,
    "Latitude": 41.784545,
    "Longitude": -71.302063
  },
  "19": {
    "Track": "Pocatello Speedway (Inner Dirt Oval)",
    "Date": "2016-07-23T04:00:00.000Z",
    "State": "ID",
    "City": "Pocatello",
    "Type": "Oval",
    "Surface": "Dirt"
  },
  "20": {
    "Track": "Seekonk Speedway (Asphalt Figure 8)",
    "Date": "2016-08-07T04:00:00.000Z",
    "State": "MA",
    "City": "Seekonk",
    "Type": "Figure 8",
    "Surface": "Asphalt"
  },
  "21": {
    "Track": "Thompson Speedway",
    "Date": "2016-08-24T04:00:00.000Z",
    "State": "CT",
    "City": "Thompson",
    "Type": "Oval",
    "Surface": "Asphalt",
    "Length": 0.625,
    "Latitude": 41.981539,
    "Longitude": -71.824777
  },
  "22": {
    "Track": "Port of LA",
    "Date": "2016-10-09T04:00:00.000Z",
    "State": "CA",
    "City": "Los Angeles",
    "Type": "Road Course",
    "Surface": "Mixed",
    "Latitude": 33.715601,
    "Longitude": -118.274313
  },
  "23": {
    "Track": "Star Speedway",
    "Date": "2017-04-15T04:00:00.000Z",
    "State": "NH",
    "City": "Epping",
    "Type": "Oval",
    "Surface": "Asphalt",
    "Length": 0.25,
    "Latitude": 43.029218,
    "Longitude": -71.040663
  },
  "24": {
    "Track": "Stafford Motor Speedway",
    "Date": "2017-04-30T04:00:00.000Z",
    "State": "CT",
    "City": "Stafford Springs",
    "Type": "Oval",
    "Surface": "Asphalt",
    "Length": 0.5,
    "Latitude": 41.955244,
    "Longitude": -72.32045
  },
  "25": {
    "Track": "Thompson Speedway (Mixed Road Course)",
    "Date": "2017-06-03T04:00:00.000Z",
    "State": "CT",
    "City": "Thompson",
    "Type": "Road Course",
    "Surface": "Mixed"
  },
  "26": {
    "Track": "Lee USA Speedway",
    "Date": "2017-07-21T04:00:00.000Z",
    "State": "NH",
    "City": "Lee",
    "Type": "Oval",
    "Surface": "Asphalt",
    "Length": 0.375,
    "Latitude": 43.115867,
    "Longitude": -71.039733
  },
  "27": {
    "Track": "Albany-Saratoga Speedway",
    "Date": "2017-07-28T04:00:00.000Z",
    "State": "NY",
    "City": "Malta",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.375,
    "Latitude": 42.988542,
    "Longitude": -73.78216
  },
  "28": {
    "Track": "New London Waterford Speedbowl",
    "Date": "2017-08-12T04:00:00.000Z",
    "State": "CT",
    "City": "Waterford",
    "Type": "Oval",
    "Surface": "Asphalt",
    "Length": 0.375,
    "Latitude": 41.396765,
    "Longitude": -72.17621
  },
  "29": {
    "Track": "Oxford Plains Speedway",
    "Date": "2017-08-27T04:00:00.000Z",
    "State": "ME",
    "City": "Oxford",
    "Type": "Oval",
    "Surface": "Asphalt",
    "Length": 0.375,
    "Latitude": 44.153846,
    "Longitude": -70.484541
  },
  "30": {
    "Track": "Lebanon Valley Speedway",
    "Date": "2017-08-31T04:00:00.000Z",
    "State": "NY",
    "City": "West Lebanon",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.5,
    "Latitude": 42.491995,
    "Longitude": -73.488908
  },
  "31": {
    "Track": "Beech Ridge Speedway",
    "Date": "2017-09-17T04:00:00.000Z",
    "State": "ME",
    "City": "Scarborough",
    "Type": "Oval",
    "Surface": "Asphalt",
    "Length": 0.33,
    "Latitude": 43.610212,
    "Longitude": -70.380652
  },
  "32": {
    "Track": "Wall Stadium Speedway",
    "Date": "2017-11-24T05:00:00.000Z",
    "State": "NJ",
    "City": "Wall",
    "Type": "Oval",
    "Surface": "Asphalt",
    "Length": 0.33,
    "Latitude": 40.175186,
    "Longitude": -74.115242
  },
  "33": {
    "Track": "Wall Stadium Speedway (Inner Asphalt Oval)",
    "Date": "2017-11-25T05:00:00.000Z",
    "State": "NJ",
    "City": "Wall",
    "Type": "Oval",
    "Surface": "Asphalt"
  },
  "34": {
    "Track": "Hudson Speedway",
    "Date": "2018-05-13T04:00:00.000Z",
    "State": "NH",
    "City": "Hudson",
    "Type": "Oval",
    "Surface": "Asphalt",
    "Length": 0.25,
    "Latitude": 42.813592,
    "Longitude": -71.410685
  },
  "35": {
    "Track": "Texas Motor Speedway",
    "Date": "2018-06-08T04:00:00.000Z",
    "State": "TX",
    "City": "Fort Worth",
    "Type": "Oval",
    "Surface": "Asphalt",
    "Length": 1.5,
    "Latitude": 33.036961,
    "Longitude": -97.281602
  },
  "36": {
    "Track": "Lil' Texas Motor Speedway",
    "Date": "2018-06-08T04:00:00.000Z",
    "State": "TX",
    "City": "Fort Worth",
    "Type": "Oval",
    "Surface": "Asphalt",
    "Length": 0.2,
    "Latitude": 33.035957,
    "Longitude": -97.27588
  },
  "37": {
    "Track": "Texas Motor Speedway (Asphalt Road Course)",
    "Date": "2018-06-09T04:00:00.000Z",
    "State": "TX",
    "City": "Fort Worth",
    "Type": "Road Course",
    "Surface": "Asphalt"
  },
  "38": {
    "Track": "Monadnock Speedway",
    "Date": "2018-07-07T04:00:00.000Z",
    "State": "NH",
    "City": "Winchester",
    "Type": "Oval",
    "Surface": "Asphalt",
    "Length": 0.25,
    "Latitude": 42.831283,
    "Longitude": -72.362489
  },
  "39": {
    "Track": "Stafford Motor Speedway (Inner Asphalt Oval)",
    "Date": "2018-07-27T04:00:00.000Z",
    "State": "CT",
    "City": "Stafford Springs",
    "Type": "Oval",
    "Surface": "Asphalt"
  },
  "40": {
    "Track": "Bear Ridge Speedway",
    "Date": "2018-08-11T04:00:00.000Z",
    "State": "VT",
    "City": "Bradford",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.25,
    "Latitude": 43.998119,
    "Longitude": -72.168196
  },
  "41": {
    "Track": "Devil's Bowl Speedway",
    "Date": "2018-09-16T04:00:00.000Z",
    "State": "VT",
    "City": "West Haven",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.5,
    "Latitude": 43.667992,
    "Longitude": -73.294175
  },
  "42": {
    "Track": "Lancaster Speedway",
    "Date": "2018-09-28T04:00:00.000Z",
    "State": "SC",
    "City": "Lancaster",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.5,
    "Latitude": 34.779166,
    "Longitude": -80.78716
  },
  "43": {
    "Track": "Charlotte Motor Speedway Roval",
    "Date": "2018-09-29T04:00:00.000Z",
    "State": "NC",
    "City": "Concord",
    "Type": "Road Course",
    "Surface": "Asphalt",
    "Length": 2.28,
    "Latitude": 35.352002,
    "Longitude": -80.683515
  },
  "44": {
    "Track": "Gateway Dirt Nationals",
    "Date": "2018-11-29T05:00:00.000Z",
    "State": "MO",
    "City": "St. Louis",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.2,
    "Latitude": 38.632739,
    "Longitude": -90.188636
  },
  "45": {
    "Track": "Cure Insurance Arena",
    "Date": "2018-12-15T05:00:00.000Z",
    "State": "NJ",
    "City": "Trenton",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.125,
    "Latitude": 40.21272,
    "Longitude": -74.757592
  },
  "46": {
    "Track": "Exposition Center",
    "Date": "2019-03-09T05:00:00.000Z",
    "State": "NY",
    "City": "Syracuse",
    "Type": "Oval",
    "Surface": "Concrete",
    "Length": 0.125,
    "Latitude": 43.074406,
    "Longitude": -76.221899
  },
  "47": {
    "Track": "Lincoln Speedway",
    "Date": "2019-03-23T04:00:00.000Z",
    "State": "PA",
    "City": "Abbottstown",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.375,
    "Latitude": 39.870591,
    "Longitude": -76.994714
  },
  "48": {
    "Track": "Port Royal Speedway",
    "Date": "2019-03-24T04:00:00.000Z",
    "State": "PA",
    "City": "Port Royal",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.5,
    "Latitude": 40.535688,
    "Longitude": -77.389519
  },
  "49": {
    "Track": "Orange County Fair Speedway",
    "Date": "2019-04-13T04:00:00.000Z",
    "State": "NY",
    "City": "Middletown",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.625,
    "Latitude": 41.447578,
    "Longitude": -74.393426
  },
  "50": {
    "Track": "New Egypt Speedway",
    "Date": "2019-05-04T04:00:00.000Z",
    "State": "NJ",
    "City": "Plumsted",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.4375,
    "Latitude": 40.070578,
    "Longitude": -74.467841
  },
  "51": {
    "Track": "Glen Ridge Motorsports Park",
    "Date": "2019-06-02T04:00:00.000Z",
    "State": "NY",
    "City": "Fultonville",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.25,
    "Latitude": 42.933938,
    "Longitude": -74.4051
  },
  "52": {
    "Track": "Utica-Rome Speedway",
    "Date": "2019-07-07T04:00:00.000Z",
    "State": "NY",
    "City": "Vernon",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.5,
    "Latitude": 43.078706,
    "Longitude": -75.516282
  },
  "53": {
    "Track": "Thunder Road International Speedbowl",
    "Date": "2019-07-18T04:00:00.000Z",
    "State": "VT",
    "City": "Barre",
    "Type": "Oval",
    "Surface": "Asphalt",
    "Length": 0.25,
    "Latitude": 44.179899,
    "Longitude": -72.487877
  },
  "54": {
    "Track": "NHMS Flat Track",
    "Date": "2019-07-19T04:00:00.000Z",
    "State": "NH",
    "City": "Loudon",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.25,
    "Latitude": 43.34798,
    "Longitude": -71.463928
  },
  "55": {
    "Track": "Meridian Speedway",
    "Date": "2019-07-27T04:00:00.000Z",
    "State": "ID",
    "City": "Meridian",
    "Type": "Oval",
    "Surface": "Asphalt",
    "Length": 0.25,
    "Latitude": 43.601855,
    "Longitude": -116.390666
  },
  "56": {
    "Track": "Slinger Speedway",
    "Date": "2019-08-04T04:00:00.000Z",
    "State": "WI",
    "City": "Slinger",
    "Type": "Oval",
    "Surface": "Asphalt",
    "Length": 0.25,
    "Latitude": 43.340632,
    "Longitude": -88.277351
  },
  "57": {
    "Track": "Slinger Speedway (Asphalt Figure 8)",
    "Date": "2019-08-04T04:00:00.000Z",
    "State": "WI",
    "City": "Slinger",
    "Type": "Figure 8",
    "Surface": "Asphalt"
  },
  "58": {
    "Track": "Slinger Speedway (Asphalt Road Course)",
    "Date": "2019-08-04T04:00:00.000Z",
    "State": "WI",
    "City": "Slinger",
    "Type": "Road Course",
    "Surface": "Asphalt"
  },
  "59": {
    "Track": "Southern Iowa Speedway",
    "Date": "2019-08-05T04:00:00.000Z",
    "State": "IA",
    "City": "Oskaloosa",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.5,
    "Latitude": 41.303158,
    "Longitude": -92.657883
  },
  "60": {
    "Track": "Knoxville Raceway",
    "Date": "2019-08-07T04:00:00.000Z",
    "State": "IA",
    "City": "Knoxville",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.5,
    "Latitude": 41.326589,
    "Longitude": -93.111788
  },
  "61": {
    "Track": "Proctor Speedway",
    "Date": "2019-08-11T04:00:00.000Z",
    "State": "MN",
    "City": "Proctor",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.375,
    "Latitude": 46.750912,
    "Longitude": -92.214314
  },
  "62": {
    "Track": "William's Grove Speedway",
    "Date": "2019-08-23T04:00:00.000Z",
    "State": "PA",
    "City": "Mechanicsburg",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.5,
    "Latitude": 40.155486,
    "Longitude": -77.033648
  },
  "63": {
    "Track": "BAPS Motor Speedway",
    "Date": "2019-08-25T04:00:00.000Z",
    "State": "PA",
    "City": "York Haven",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.375,
    "Latitude": 40.112489,
    "Longitude": -76.825789
  },
  "64": {
    "Track": "Seekonk Speedway (Asphalt Road Course)",
    "Date": "2019-08-31T04:00:00.000Z",
    "State": "MA",
    "City": "Seekonk",
    "Type": "Road Course",
    "Surface": "Asphalt"
  },
  "65": {
    "Track": "Eldora Speedway",
    "Date": "2019-09-28T04:00:00.000Z",
    "State": "OH",
    "City": "New Weston",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.5,
    "Latitude": 40.318608,
    "Longitude": -84.633776
  },
  "66": {
    "Track": "PPL Center",
    "Date": "2020-01-04T05:00:00.000Z",
    "State": "PA",
    "City": "Allentown",
    "Type": "Oval",
    "Surface": "Concrete",
    "Length": 0.175,
    "Latitude": 40.602711,
    "Longitude": -75.473078
  },
  "67": {
    "Track": "Riverside Speedway",
    "Date": "2020-01-18T05:00:00.000Z",
    "State": "NH",
    "City": "Northumberland",
    "Type": "Oval",
    "Surface": "Asphalt",
    "Length": 0.25,
    "Latitude": 44.596926,
    "Longitude": -71.542518
  },
  "68": {
    "Track": "Boardwalk Hall",
    "Date": "2020-02-01T05:00:00.000Z",
    "State": "NJ",
    "City": "Atlantic City",
    "Type": "Oval",
    "Surface": "Concrete",
    "Length": 0.175,
    "Latitude": 39.355096,
    "Longitude": -74.438648,
    "Recap": "x"
  },
  "69": {
    "Track": "Paragon Speedway",
    "Date": "2020-06-16T04:00:00.000Z",
    "State": "IN",
    "City": "Paragon",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.375,
    "Latitude": 39.391225,
    "Longitude": -86.587073
  },
  "70": {
    "Track": "Gas City Speedway",
    "Date": "2020-06-17T04:00:00.000Z",
    "State": "IN",
    "City": "Gas City",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.25,
    "Latitude": 40.483466,
    "Longitude": -85.563242
  },
  "71": {
    "Track": "Lincoln Park Speedway",
    "Date": "2020-06-18T04:00:00.000Z",
    "State": "IN",
    "City": "Greencastle",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.3125,
    "Latitude": 39.57626,
    "Longitude": -86.869947
  },
  "72": {
    "Track": "Tri-State Speedway",
    "Date": "2020-06-19T04:00:00.000Z",
    "State": "IN",
    "City": "Haubstadt",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.25,
    "Latitude": 38.205983,
    "Longitude": -87.553621,
    "Recap": "x"
  },
  "73": {
    "Track": "Lawrenceburg Speedway",
    "Date": "2020-06-20T04:00:00.000Z",
    "State": "IN",
    "City": "Lawrenceburg",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.375,
    "Latitude": 39.104738,
    "Longitude": -84.856087
  },
  "74": {
    "Track": "Kokomo Speedway",
    "Date": "2020-06-21T04:00:00.000Z",
    "State": "IN",
    "City": "Kokomo",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.25,
    "Latitude": 40.51123,
    "Longitude": -86.143393
  },
  "75": {
    "Track": "Claremont Motorsports Park",
    "Date": "2020-06-26T04:00:00.000Z",
    "State": "NH",
    "City": "Claremont",
    "Type": "Oval",
    "Surface": "Asphalt",
    "Length": 0.33,
    "Latitude": 43.392067,
    "Longitude": -72.352005
  },
  "76": {
    "Track": "Selinsgrove Speedway",
    "Date": "2020-06-28T04:00:00.000Z",
    "State": "PA",
    "City": "Selinsgrove",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.5,
    "Latitude": 40.787057,
    "Longitude": -76.870238
  },
  "77": {
    "Track": "Grandview Speedway",
    "Date": "2020-06-30T04:00:00.000Z",
    "State": "PA",
    "City": "Bechtelsville",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.33,
    "Latitude": 40.372544,
    "Longitude": -75.610115
  },
  "78": {
    "Track": "Hagerstown Speedway",
    "Date": "2020-07-02T04:00:00.000Z",
    "State": "MD",
    "City": "Hagerstown",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.5,
    "Latitude": 39.660672,
    "Longitude": -77.843921
  },
  "79": {
    "Track": "Big Diamond Speedway",
    "Date": "2020-07-03T04:00:00.000Z",
    "State": "PA",
    "City": "Minersville",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.375,
    "Latitude": 40.684617,
    "Longitude": -76.303246,
    "Recap": "x"
  },
  "80": {
    "Track": "White Mountain Motorsports Park",
    "Date": "2020-07-04T04:00:00.000Z",
    "State": "NH",
    "City": "North Woodstock",
    "Type": "Oval",
    "Surface": "Asphalt",
    "Length": 0.25,
    "Latitude": 44.006522,
    "Longitude": -71.681925
  },
  "81": {
    "Track": "Londonderry Speedway",
    "Date": "2020-08-01T04:00:00.000Z",
    "State": "NH",
    "City": "Londonderry",
    "Type": "Oval",
    "Surface": "Asphalt",
    "Length": 0.25,
    "Latitude": 42.920848,
    "Longitude": -71.414851
  },
  "82": {
    "Track": "Rumtown Speedway",
    "Date": "2020-08-01T04:00:00.000Z",
    "State": "NH",
    "City": "Rumney",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.25,
    "Latitude": 43.818725,
    "Longitude": -71.8937
  },
  "83": {
    "Track": "Lucas Oil Raceway",
    "Date": "2020-08-21T04:00:00.000Z",
    "State": "IN",
    "City": "Brownsburg",
    "Type": "Oval",
    "Surface": "Asphalt",
    "Length": 0.686,
    "Latitude": 39.812582,
    "Longitude": -86.340586,
    "Recap": "x"
  },
  "84": {
    "Track": "Lucas Oil Speedway Off Road Course",
    "Date": "2020-08-22T04:00:00.000Z",
    "State": "MO",
    "City": "Wheatland",
    "Type": "Road Course",
    "Surface": "Dirt",
    "Length": 1.3,
    "Latitude": 37.936849,
    "Longitude": -93.392579
  },
  "85": {
    "Track": "Lucas Oil Speedway",
    "Date": "2020-08-22T04:00:00.000Z",
    "State": "MO",
    "City": "Wheatland",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.375,
    "Latitude": 37.940222,
    "Longitude": -93.397699
  },
  "86": {
    "Track": "Indiana State Fairgrounds",
    "Date": "2020-08-23T04:00:00.000Z",
    "State": "IN",
    "City": "Indianapolis",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 1,
    "Latitude": 39.829557,
    "Longitude": -86.134228,
    "Recap": "x"
  },
  "87": {
    "Track": "Gateway Motorsports Park",
    "Date": "2020-08-29T04:00:00.000Z",
    "State": "IL",
    "City": "Madison",
    "Type": "Oval",
    "Surface": "Asphalt",
    "Length": 1.25,
    "Latitude": 38.651483,
    "Longitude": -90.135503
  },
  "88": {
    "Track": "Macon Speedway",
    "Date": "2020-08-29T04:00:00.000Z",
    "State": "IL",
    "City": "Macon",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.2,
    "Latitude": 39.712101,
    "Longitude": -89.006834
  },
  "89": {
    "Track": "New Hampshire Motor Speedway (Asphalt Legends Oval)",
    "Date": "2020-09-12T04:00:00.000Z",
    "State": "NH",
    "City": "Loudon",
    "Type": "Oval",
    "Surface": "Asphalt"
  },
  "90": {
    "Track": "Bridgeport Motorsports Park",
    "Date": "2020-11-06T05:00:00.000Z",
    "State": "NJ",
    "City": "Swedesboro",
    "Type": "Oval",
    "Surface": "Dirt",
    "Latitude": 39.819307,
    "Longitude": -75.317575
  },
  "91": {
    "Track": "Lee Pond",
    "Date": "2021-01-31T05:00:00.000Z",
    "State": "NH",
    "City": "Moultonborough",
    "Type": "Oval",
    "Surface": "Ice",
    "Latitude": 43.7416295733249,
    "Longitude": -71.3972113377312
  },
  "92": {
    "Track": "Berry Pond",
    "Date": "2021-02-06T05:00:00.000Z",
    "State": "NH",
    "City": "Moultonborough",
    "Type": "Oval",
    "Surface": "Ice",
    "Latitude": 43.7588525295176,
    "Longitude": -71.3935907924762
  },
  "93": {
    "Track": "Northeast Pond",
    "Date": "2021-02-07T05:00:00.000Z",
    "State": "NH",
    "City": "Milton",
    "Type": "Oval",
    "Surface": "Ice",
    "Latitude": 43.4442995517814,
    "Longitude": -70.9636735387532
  },
  "94": {
    "Track": "Contoocook Lake",
    "Date": "2021-02-14T05:00:00.000Z",
    "State": "NH",
    "City": "Jaffrey",
    "Type": "Oval",
    "Surface": "Ice",
    "Latitude": 42.7955399320377,
    "Longitude": -72.0077349892875
  },
  "95": {
    "Track": "Rochester Fairgrounds",
    "Date": "2021-03-06T05:00:00.000Z",
    "State": "NH",
    "City": "Rochester",
    "Type": "Oval",
    "Surface": "Dirt",
    "Latitude": 43.2969490477573,
    "Longitude": -70.9832266862897
  },
  "96": {
    "Track": "Bristol Motor Speedway (Dirt)",
    "Date": "2021-03-19T04:00:00.000Z",
    "State": "TN",
    "City": "Bristol",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.5,
    "Latitude": 36.5155905074463,
    "Longitude": -82.2571598217224
  },
  "97": {
    "Track": "Mountain Creek Speedway",
    "Date": "2021-03-21T04:00:00.000Z",
    "State": "NC",
    "City": "Catawba",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.16,
    "Latitude": 35.6047121721003,
    "Longitude": -81.0757647727015
  },
  "98": {
    "Track": "Millbridge Speedway",
    "Date": "2021-03-23T04:00:00.000Z",
    "State": "NC",
    "City": "Salisbury",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.16,
    "Latitude": 35.6533176141607,
    "Longitude": -80.6081584281256
  },
  "99": {
    "Track": "Boyd's Speedway",
    "Date": "2021-03-26T04:00:00.000Z",
    "State": "GA",
    "City": "Ringgold",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.33,
    "Latitude": 34.9847781036773,
    "Longitude": -85.1945374800083,
    "Recap": "x"
  },
  "100": {
    "Track": "Fonda Speedway",
    "Date": "2021-04-18T04:00:00.000Z",
    "State": "NY",
    "City": "Fonda",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.5,
    "Latitude": 42.9522323308999,
    "Longitude": -74.3674486590383
  },
  "101": {
    "Track": "Rochester Fairgrounds (Dirt Road Course)",
    "Date": "2021-05-08T04:00:00.000Z",
    "State": "NH",
    "City": "Rochester",
    "Type": "Road Course",
    "Surface": "Dirt"
  },
  "102": {
    "Track": "Central Cycle Club",
    "Date": "2021-05-23T04:00:00.000Z",
    "State": "CT",
    "City": "Central Village",
    "Type": "Road Course",
    "Surface": "Dirt",
    "Latitude": 41.7211615227574,
    "Longitude": -71.9230246254887,
    "Recap": "x"
  },
  "103": {
    "Track": "Pomfret Speedway",
    "Date": "2021-05-23T04:00:00.000Z",
    "State": "CT",
    "City": "Pomfret",
    "Type": "Oval",
    "Surface": "Asphalt",
    "Length": 0.125,
    "Latitude": 41.9013745954223,
    "Longitude": -71.9881088527105,
    "Recap": "x"
  },
  "104": {
    "Track": "Fulton Speedway",
    "Date": "2021-05-29T04:00:00.000Z",
    "State": "NY",
    "City": "Fulton",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.33,
    "Latitude": 43.2805236120949,
    "Longitude": -76.383604336207,
    "Recap": "x"
  },
  "105": {
    "Track": "Action Track USA",
    "Date": "2021-06-13T04:00:00.000Z",
    "State": "PA",
    "City": "Kutztown",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.2,
    "Latitude": 40.5161840133541,
    "Longitude": -75.7831989072972,
    "Recap": "x"
  },
  "106": {
    "Track": "Wayne County Speedway",
    "Date": "2021-06-14T04:00:00.000Z",
    "State": "OH",
    "City": "Orrville",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.375,
    "Latitude": 40.810438439051,
    "Longitude": -81.7821935585399,
    "Recap": "x"
  },
  "107": {
    "Track": "Path Valley Speedway Park",
    "Date": "2021-06-19T04:00:00.000Z",
    "State": "PA",
    "City": "Spring Run",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.25,
    "Latitude": 40.1645496520505,
    "Longitude": -77.7836609426681,
    "Recap": "x"
  },
  "108": {
    "Track": "Selinsgrove Raceway Park",
    "Date": "2021-06-20T04:00:00.000Z",
    "State": "PA",
    "City": "Selinsgrove",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.2,
    "Recap": "x"
  },
  "109": {
    "Track": "Bloomsburg Fairgrounds Speedway",
    "Date": "2021-06-20T04:00:00.000Z",
    "State": "PA",
    "City": "Bloomsburg",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.375,
    "Latitude": 40.9963649758338,
    "Longitude": -76.4641344600989,
    "Recap": "x"
  },
  "110": {
    "Track": "Riverhead Raceway",
    "Date": "2021-06-26T04:00:00.000Z",
    "State": "NY",
    "City": "Riverhead",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.25,
    "Latitude": 40.9224923000117,
    "Longitude": -72.7045220371278,
    "Recap": "x"
  },
  "111": {
    "Track": "Riverhead Raceway (Asphalt Figure 8)",
    "Date": "2021-06-26T04:00:00.000Z",
    "State": "NY",
    "City": "Riverhead",
    "Type": "Oval",
    "Surface": "Dirt",
    "Recap": "x"
  },
  "112": {
    "Track": "KRA Speedway",
    "Date": "2021-07-08T04:00:00.000Z",
    "State": "MN",
    "City": "Willmar",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.375,
    "Latitude": 45.1300012335653,
    "Longitude": -95.0559613582346,
    "Recap": "x"
  },
  "113": {
    "Track": "ERX Motor Park",
    "Date": "2021-07-10T04:00:00.000Z",
    "State": "MN",
    "City": "Elk River",
    "Type": "Road Course",
    "Surface": "Dirt",
    "Length": 0.85,
    "Latitude": 45.3621084965766,
    "Longitude": -93.55824078866,
    "Recap": "x"
  },
  "114": {
    "Track": "Mason City Motor Speedway",
    "Date": "2021-07-11T04:00:00.000Z",
    "State": "IA",
    "City": "Mason City",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.33,
    "Latitude": 43.1537371391555,
    "Longitude": -93.2559507034742,
    "Recap": "x"
  },
  "115": {
    "Track": "Clyde Martin Memorial Speedway",
    "Date": "2021-08-07T04:00:00.000Z",
    "State": "PA",
    "City": "Newmanstown",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.175,
    "Latitude": 40.2751593797983,
    "Longitude": -76.2585880193477,
    "Recap": "x"
  },
  "116": {
    "Track": "Perris Auto Speeedway",
    "Date": "2021-08-21T04:00:00.000Z",
    "State": "CA",
    "City": "Perris",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.4,
    "Latitude": 33.8494502339255,
    "Longitude": -117.201095674817,
    "Recap": "x"
  },
  "117": {
    "Track": "Huset's Speedway",
    "Date": "2021-09-10T04:00:00.000Z",
    "State": "SD",
    "City": "Brandon",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.25,
    "Recap": "x"
  },
  "118": {
    "Track": "Talladega Superspeedway",
    "Date": "2021-10-02T04:00:00.000Z",
    "State": "AL",
    "City": "Talladega",
    "Type": "Oval",
    "Surface": "Asphalt",
    "Length": 2.66,
    "Latitude": 33.5673049488553,
    "Longitude": -86.0669514222237,
    "Recap": "x"
  },
  "119": {
    "Track": "Talladega Short Track",
    "Date": "2021-10-02T04:00:00.000Z",
    "State": "AL",
    "City": "Talladega",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.25,
    "Latitude": 33.5815423553349,
    "Longitude": -86.0514625156166,
    "Recap": "x"
  },
  "120": {
    "Track": "Topsfield Fair Arena",
    "Date": "2021-10-11T04:00:00.000Z",
    "State": "MA",
    "City": "Topsfield",
    "Type": "Figure 8",
    "Surface": "Dirt",
    "Latitude": 42.6283272037037,
    "Longitude": -70.943103123818
  },
  "-1": {
    "Track": "Pocatello Speedway",
    "State": "ID",
    "City": "Pocatello",
    "Type": "Oval",
    "Surface": "Asphalt",
    "Length": 0.25,
    "Latitude": 42.912684,
    "Longitude": -112.577022
  },
  "-2": {
    "Track": "Las Vegas Motor Speedway",
    "State": "NV",
    "City": "Las Vegas",
    "Type": "Oval",
    "Surface": "Asphalt",
    "Length": 1.5,
    "Latitude": 36.272028,
    "Longitude": -115.01029
  },
  "-3": {
    "Track": "The Dirt Track at Las Vegas Motor Speedway",
    "State": "NV",
    "City": "Las Vegas",
    "Type": "Oval",
    "Surface": "Dirt",
    "Length": 0.5,
    "Latitude": 36.285462,
    "Longitude": -115.011854
  },
  "-4": {
    "Track": "Magic Valley Speedway",
    "State": "ID",
    "City": "Twin Falls",
    "Type": "Oval",
    "Surface": "Asphalt",
    "Length": 0.33,
    "Latitude": 42.486547,
    "Longitude": -114.502064
  },
  "-5": {
    "Track": "Atomic Motor Raceway (Inner Dirt Oval)",
    "State": "ID",
    "City": "Atomic City",
    "Type": "Oval",
    "Surface": "Dirt"
  }
}`
);
