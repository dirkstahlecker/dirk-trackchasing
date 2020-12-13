import express from "express";
import path from 'path';
import {Parser} from './parser';
// import utilities from './utilities';
import {EventInfo, Flip, TrackName} from "./Types";

const app = express();

const parser: Parser = new Parser();

const TRACK_ORDER_HEADER = "Track Order"; //track order sheet, the main reference for each track
const RACES_HEADER = "Races";

export class Server
{
	//gets list of all the tracks (configurations are sent as separate tracks)
	public async getTrackList(): Promise<any>
	{
		const json = await parser.parse()
		let trackList = Object.keys(json[TRACK_ORDER_HEADER]) //tested and appears to work

		return trackList
	}

	public async getTrackListNoConfigurations()
	{
		const list = await this.getTrackList();
		
		const filteredList = [];
		for (let i = 0; i < list.length; i++)
		{
			const track = list[i];
			if (track.match(/\(.*\)/) == null)
			{
				filteredList.push(track);
			}
		};
		return filteredList;
	}

	public async getTrackFullInfo(): Promise<any>
	{
		const json = await parser.parse();
		const tracksList = await this.getTrackList();

		let tracksAndCoords: any = {};
		for (let i = 0; i < tracksList.length; i++)
		{
			const track = tracksList[i];
			const trackInfo = json[TRACK_ORDER_HEADER][track];
			const count = await this.getCountForTrack(track);
			const flips = await this.getFlipsForTrack(track);
			tracksAndCoords[track] = {
				"state": trackInfo["State"], 
				"latitude": trackInfo["Latitude"], 
				"longitude": trackInfo["Longitude"],
				"count": count,
				"flips": flips,
				"trackType": trackInfo["Type"]
			};
		}
		return tracksAndCoords
	}

	public async getCountForTrack(rawName: string)
	{
		let json = await parser.parse();
		json = json[RACES_HEADER];
	
		const trackNameObj: TrackName = TrackName.parse(rawName);
	
		let count = 0;
		let i = 0;
		while (true)
		{
			const jsonRowHeader = "Races: " + i;
			const raceRow = json[jsonRowHeader];
			if (raceRow === undefined)
			{
				break;
			}
			// {
				// 'Seekonk Speedway': '11-02-19: Thrill Show [Asphalt Figure 8, Asphalt Road Course]'
			// }
	
	
			//TODO: consolidate with getEventsForTrack, some property bag thing
			if (raceRow[trackNameObj.baseName] != null)
			{
				if (trackNameObj.isConfiguration)
				{
					//need to look into the specifics and see if there configuration is in brackets at the end
					if (raceRow[trackNameObj.baseName].includes(trackNameObj.configuration))
					{
						count++
					}
				}
				else
				{
					count++;
				}
			}
			i++;
		}
	
		return count;
	}

	//returns only the event string as stored in the json
	public async getEventStringsForTrack(rawName: string): Promise<string[]>
	{
		let json = await parser.parse();
		json = json[RACES_HEADER];
		const trackNameObj: TrackName = TrackName.parse(rawName);
		const events = [];

		let i = 0;
		while (true)
		{
			const jsonRowHeader = "Races: " + i;
			const raceRow = json[jsonRowHeader];
			if (raceRow === undefined)
			{
				break;
			}
			
			const event = raceRow[trackNameObj.baseName];
			if (event != null)
			{
				if (trackNameObj.isConfiguration)
				{
					if (event.includes(trackNameObj.configuration))
					{
						events.push(event);
					}
				}
				else //not a configuration, add all
				{
					events.push(event);
				}
			}
			i++;
		}

		return events;
	}

	public async getFlipsForTrack(rawName: string): Promise<Flip[]>
	{
		const trackNameObj: TrackName = TrackName.parse(rawName);
		const flipDataAllTracks: Flip[] = await parser.flipsData();
	
		const foundFlips: Flip[] = flipDataAllTracks.filter((flip: Flip) => {
			return TrackName.equals(flip.trackNameObj, trackNameObj);
		})
	
		return foundFlips;
		// return flipDataAllTracks[rawName];
	}

	private getDateFromFlip(flip: any): Date //TODO
	{
		return new Date(flip.date);
	}

	public async getFlipsForEvent(trackName: string, date: Date): Promise<Flip[]>
	{
		const dateObj = new Date(date);
		const flipsForTrack: Flip[] = await this.getFlipsForTrack(trackName); //TODO: inefficient

		const flipsForEvent: Flip[] = flipsForTrack.filter((flip: Flip) => {
			return this.getDateFromFlip(flip).getTime() === dateObj.getTime();
		});

		return flipsForEvent;
	}

	public getDateFromEventString(eventString: string): Date
	{
		let dateRaw = eventString.split(":")[0];
		// return utilities.cleanDate(dateRaw);
		return new Date(dateRaw);
	}

	public async makeEnrichedEventInfoHelper(eventString: string, trackName: string, dateObj: Date): Promise<EventInfo>
	{
		if (eventString === undefined)
		{
			throw Error("Event for track " + trackName + " on date " + dateObj + " cannot be found");
		}
	
		const flipsForEvent = await this.getFlipsForEvent(trackName, dateObj)
	
		const classes = eventString.substring(eventString.indexOf(":") + 2);
	
		const eventInfoObj: EventInfo = {
			date: dateObj, 
			classes: classes, 
			flips: flipsForEvent
		};
		//TODO: notable crashes
	
		return eventInfoObj;
	}

	//returns { date: string , classes: string , flips: [flip] , notableCrashes: ?? }
	public async getEnrichedEventInfoForDate(trackName: string, date: string): Promise<EventInfo>
	{
		//TODO: deal with invalid dates that come from old events where I don't know the date
		const dateObj = new Date(date);
		const eventStrings = await this.getEventStringsForTrack(trackName); //TODO: inefficient - stop when we find it
		const eventString = eventStrings.find((event) => {
			const eventDate = this.getDateFromEventString(event);
			return eventDate.getTime() === dateObj.getTime();
		});

		return this.makeEnrichedEventInfoHelper(eventString, trackName, dateObj);
	}

	public async getAllEnrichedEventInfosForTrack(trackName: string): Promise<any> //TODO
	{
		const eventStrings = await this.getEventStringsForTrack(trackName); //TODO: inefficient - stop when we find it
	
		const promises = eventStrings.map(async(eventStr) => {
			const date = this.getDateFromEventString(eventStr);
			// if (date.getTime() != date.getTime()) //getTime is NaN for invalid dates, NaN never equals NaN, so invalid
			// {
			// 	console.error("Invalid date")
			// 	return null;
			// }
			//TODO: error handling for invalid date
			const eventInfo = await this.getEnrichedEventInfoForDate(trackName, date as any); //TODO
			return eventInfo;
		});
		
		const eventInfos = await Promise.all(promises);
		return eventInfos;
	}

	public async getBasicStats(): Promise<any> //TODO
	{
		let json = await parser.parse();
		// json = json[RACES_HEADER];
	
	
	}
}

const server: Server = new Server();

//=========================================================================================
//                                     Endpoints
//=========================================================================================

// Priority serve any static files.
// app.use(express.static(path.resolve(__dirname, '../react-ui/public'))); //I don't know what this is

//get a list of all the tracks, name only
app.get('/tracks', async function (req, res) {
	console.log("/tracks")
	res.set('Content-Type', 'application/json');

	const tracks = await server.getTrackList();

	res.json(tracks);
});

//returns a list of all the tracks along with their specific info
app.get('/tracks/info', async function (req, res) {
	console.log("/tracks/info")
	res.set('Content-Type', 'application/json');

	const trackInfos = await server.getTrackFullInfo();

	res.json(trackInfos);
});

//returns a list of all event strings for a particular track
app.get('/tracks/:trackName/events', async function (req, res) {
	console.log("/tracks/" + req.params.trackName + "/events");
	res.set('Content-Type', 'application/json');

	const events = await server.getEventStringsForTrack(req.params.trackName);

	res.json(events);
});

//get enriched event details for a track and a date
app.get('/eventDetails/:trackName/:date', async function (req, res) {
	console.log('/events/' + req.params.trackName + '/' + req.params.date);
	res.set('Content-Type', 'application/json');

	const eventInfo = await server.getEnrichedEventInfoForDate(req.params.track, req.params.date);
	
	res.json(eventInfo);
});

//get enriched event details for all events for a track
app.get('/eventDetails/:trackName', async function (req, res) {
	console.log('/eventsDetails/' + req.params.trackName);
	res.set('Content-Type', 'application/json');

	const eventInfos = await server.getAllEnrichedEventInfosForTrack(req.params.trackName);
	
	res.json(eventInfos);
});

app.get('/numRaces/:trackName/raceCount', async function (req, res) { //TODO: does this still work?
	console.log("/numRaces/" + req.params.trackName + "/raceCount")

	const count = await server.getCountForTrack(req.params.trackName);

	res.set('Content-Type', 'application/json');
	res.json({"message": count});
});

app.get('/stats', async function (req, res) {
	console.log("/stats");

	const stats = await server.getBasicStats();

	res.set('Content-Type', 'application/json');
	res.json(stats);
});



// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
// app.get('*', (req, res) => {
// 	const index = path.join(__dirname, '../client/build', 'index.html');
// 	console.log(index)
// 	//path.join(__dirname+'/../../client/build/index.html')
//   res.sendFile(index);
// });

const root = path.join(__dirname, 'client', 'build')
app.use(express.static(root));
app.get("*", (req, res) => {
    res.sendFile('index.html', { root });
})




const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`server started on port ${port}`)
});


//TODO: do we even need stats to be sent from the server? There's no unique info on that page
//TODO: flips need to include their configuration
