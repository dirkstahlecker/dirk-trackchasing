import { Pool, QueryResult } from 'pg'
//tslint:disable
const pg = require('pg');
// tslint:enable

export type TrackDbObj = { 
  track_id: number,
  name: string,
  state: string,
  city: string,
  surface: string,
  length: number | null,
  type: string,
  isconfiguration: boolean | null,
  ordernumber: number | null,
  latitude: number | null,
  longitude: number | null,
  recap: string | null
};

///////////////////////////////////////////////////////////////
//Don't touch below here
///////////////////////////////////////////////////////////////

const connString = process.env.DATABASE_URL
  || 'postgresql://dirkstahlecker@localhost:5432/trackchasing';
// console.log("connString: " + connString);

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
