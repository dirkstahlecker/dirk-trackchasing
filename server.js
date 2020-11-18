const express = require('express');
const path = require('path');

const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

function getTrackList()
{
  const json = parse()
  let trackList = Object.keys(json["Track Order"]) //tested and appears to work

  return trackList
}

function parse()
{
  console.log("parsing")
  //take the json downloaded from google sheets in json format and parse it
  var fs=require('fs');
  var data=fs.readFileSync(path.resolve(__dirname, 'events_data.json'), 'utf8');
  var json=JSON.parse(data);

  return json
}

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../react-ui/public')));

//look through the json downloaded from google sheets and parse it
app.get('/tracksList', function (req, res) {
	console.log("/tracksList")
	res.set('Content-Type', 'application/json');

	const tracks = getTrackList();

	res.json({"message": tracks});
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Password generator listening on ${port}`);
