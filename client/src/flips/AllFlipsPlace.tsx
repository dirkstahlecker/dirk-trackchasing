import React from 'react';
import {observer} from "mobx-react";
import {observable, action, makeObservable, computed, runInAction, when} from "mobx";
import { RaceTile } from '../events/RaceTile';
import { Flip, EventObj, TrackName, Track, Race } from '../Types';
import { API } from '../API';
import { Link } from 'react-router-dom';
import { FlipInfoMachine } from './FlipInfoMachine';
import { printDate } from '../utilities';

export interface AllFlipsPlaceProps
{
  flipInfoMachine: FlipInfoMachine;
}

@observer
export class AllFlipsPlace extends React.Component<AllFlipsPlaceProps>
{
  private renderFlipRow(flip: Flip): JSX.Element
  {
    return <div>
      <span>{printDate(flip.date)}</span>
      <span>{flip.trackName}</span>
      <span>{flip.classStr}</span>
      <span>{flip.rotations}</span>
      <span>{flip.surface}</span>
      <span>{flip.fullfender}</span>
      <span>{flip.occurred}</span>
      <span>{flip.video}</span>
      <span>{flip.didnotsee}</span>
      <span>{flip.driver}</span>
      <span>{flip.notes}</span>
    </div>;
  }

  render()
  {
    const flips: Flip[] | null = this.props.flipInfoMachine.flips;

    return <div className="all-flips-place">
      <h2>Flips</h2>
      {/* {
        flips && flips.length > 0 &&
        <>
          {flips.map((flip: Flip) => {
            return this.renderFlipRow(flip);
          })}
        </>
      } */}

        <div>
          <table><tbody>
            <tr>
              <td>Date</td>
              <td>Track</td>
              <td>Class</td>
              <td>Rotations</td>
              <td>Surface</td>
              <td>Full-fender</td>
              <td>Occurred</td>
              <td>Video</td>
              <td>Didn't see</td>
              <td>Driver</td>
              <td>Notes</td>
            </tr>
          {
            flips != null && 
            flips.map((flip: Flip) => (
              <tr key={flip.flip_id}>
                <td>{printDate(flip.date)}</td>
                <td><Link to={`/track/${"TODO"}`}>{flip.trackName}</Link></td>
                <td>{flip.classStr}</td>
                <td>{flip.rotations}</td>
                <td>{flip.surface}</td>
                <td>{flip.fullfender ? "TRUE" : "FALSE"}</td>
                <td>{flip.occurred}</td>
                <td>{flip.video ? "TRUE" : "FALSE"}</td>
                <td>{flip.didnotsee ? "TRUE" : "FALSE"}</td>
                <td>{flip.driver}</td>
                <td>{flip.notes}</td>
              </tr>
            ))
          }
          </tbody></table>
        </div>

    </div>;
  }
}
