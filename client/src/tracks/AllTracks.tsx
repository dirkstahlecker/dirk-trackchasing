import React from 'react';
import {observer} from "mobx-react";
import {observable, action, computed} from "mobx";
import { TrackInfoMachine } from './TrackInfoMachine';
import { TrackTile } from './TrackTile';
import { Track } from '../Types';
import { printDate } from '../utilities';

export interface AllTracksPlaceProps
{
  trackInfoMachine: TrackInfoMachine;
}

@observer
export class AllTracksPlace extends React.Component<AllTracksPlaceProps>
{
  private get sortedTracks(): Track[]
  {
    const sortedTracks: Track[] = this.props.trackInfoMachine.tracks.slice().sort((a: Track, b: Track) => {
      if (a.ordernum === null && b.ordernum === null) //both null, they're equal
      {
        return 0;
      }
      else if (a.ordernum === null) //only a is null, it's less than b
      {
        return -1;
      }
      else if (b.ordernum === null) //only b is null, it's lss than a
      {
        return 1;
      }

      if (a.ordernum < b.ordernum) //a less than b
      {
        return -1;
      }
      else if (b.ordernum < a.ordernum) //b is less than a
      {
        return 1;
      }
      return 0; //they're equal
    });

    return sortedTracks;
  }

  render()
  {
    return <div className="contact-place">
      <h2>Tracks I've Visited</h2>
      {/* <button onClick={this.props.navMachine.goHome}>Go Home</button> */}
      {
        this.sortedTracks.length > 0 &&
        <div>
          <table><tbody>
            <tr>
              <td></td>
              <td>Track</td>
              <td>Date</td>
              <td>State</td>
              <td>City</td>
              <td>Type</td>
              <td>Surface</td>
            </tr>
          {this.sortedTracks.map((track: Track) => (
            <tr key={track.track_id}>
              <td>{track.ordernum}</td>
              <td>
                <a onClick={() => this.props.navMachine.goToTrackPage(track)}>
                  {track.name}
                </a>
              </td>
              <td>{printDate(this.props.trackInfoMachine.findFirstRaceForTrack(track.track_id))}</td>
              <td>{track.state}</td>
              <td>{track.city}</td>
              <td>{track.type}</td>
              <td>{track.surface}</td>
            </tr>
          ))}
          </tbody></table>
        </div>
      }
    </div>
  }
}
