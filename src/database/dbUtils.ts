//tslint:disable
const pg = require('pg');
// tslint:enable
import { Pool, QueryResult } from 'pg'

export type TrackDbObj = { 
  track_id: number,
  name: string,
  state: string,
  city: string,
  surface: string,
  length: number | null,
  type: string,
  parent_track_id: number | null,
  ordernum: number | null,
  latitude: number | null, //TODO: how does this deal with negative numbers?
  longitude: number | null,
  recap: string | null
};

export type Race = {
  race_id: number,
  track_id: number,
  date: Date,
  event_name: string | null,
  classes: string
}

export type Flip = {
  flip_id: number,
  race_id: number,
  class: string,
  rotations: string | null,
  notes: string | null,
  fullfender: boolean,
  occurred: string,
  video: boolean | null,
  didnotsee: boolean | null
}

export type BasicStats = {
  total_races: number,
  total_facilities: number,
  countable_tracks: number,
  total_days: number,
  states: StateStats[]
}

export type StateStats = {
  state: string,
  facilities: number,
  configs: number
}

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
// Don't touch the following - Heroku gets very finnicky about it

const connString = process.env.DATABASE_URL
  || 'postgresql://dirkstahlecker@localhost:5432/trackchasing';
  
console.log("connString: " + connString);

let pool: Pool;
if (process.env.DATABASE_URL)
{
  pool = new Pool({
    connectionString : connString,
    ssl: { rejectUnauthorized: false }
  });
}
else
{
  pool = new Pool({
    connectionString: connString
  });
}

// wrapper to make a query and do error handling
export async function makeQuery(query: string): Promise<any>
{
  try
  {
    const result = await pool.query(query);
    return result;
  }
  catch (e)
  {
    console.error("ERROR with query " + query);
    throw e;
  }
}
