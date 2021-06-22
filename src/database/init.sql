CREATE TABLE tracks
(
  track_id        SERIAL PRIMARY KEY,
  name            text NOT NULL,
  state           varchar(2) NOT NULL,
  city            text NOT NULL,
  surface         text NOT NULL,
  length          decimal,
  type            text NOT NULL,
  isConfiguration boolean,
  orderNumber     integer, --visited order number
  latitude        decimal,
  longitude       decimal,
  recap           text
);

INSERT INTO tracks (name, state, city, surface, length, type, isConfiguration, orderNumber, latitude, longitude) VALUES
('Seekonk Speedway', 'MA', 'Seekonk', 'Asphalt', '0.33', 'Oval', 'false', '18', '41.784545', '-71.302063');

CREATE TABLE races
(
  race_id SERIAL PRIMARY KEY,
  track_id integer NOT NULL references tracks(track_id),
  raceDate DATE NOT NULL,
  raceName text, --ex. "Kokomo Smackdown" or "USAC Eastern Storm"; optional
  raceClasses text NOT NULL
);

INSERT INTO races (track_id, racedate, raceClasses) VALUES
('2', '9-02-17', 'Pro Stocks, Late Models, Street Stocks, Sport Trucks');

CREATE TABLE flips
(
  flip_id     SERIAL PRIMARY KEY NOT NULL,
  race_id     integer NOT NULL references races(race_id),
  class       text NOT NULL,
  rotations   text,
  notes       text,
  fullFender  boolean NOT NULL,
  whenOccured text NOT NULL,
  video       boolean,
  didNotSee   boolean
);

INSERT INTO flips (race_id, class, rotations, notes, fullFender, whenOccured, video) VALUES
('2', 'Pro Stock', '1/2', 'Larry Gelinas got put into the wall exiting 2 in the heat, climbed the wall and slid on the roof into 3, where he hit the outside wall and rolled back on the wheels, ending up in the middle of 3', 'true', 'Heat', 'true')


-- CREATE TABLE names
-- (
--   name_id      SERIAL PRIMARY KEY NOT NULL,
--   displayname  text not null
-- );

-- CREATE TABLE firstlast
-- (
--   firstandlast_id    SERIAL PRIMARY KEY NOT NULL,
--   name_id            integer not null references names(name_id),
--   firstname          text not null,
--   lastname           text not null
-- );
