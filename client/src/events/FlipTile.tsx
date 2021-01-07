import React from 'react';
import {observer} from "mobx-react";
import {observable, action, makeObservable, runInAction} from "mobx";
import { Flip } from '../Types';

export interface FlipTileProps
{
  flip: Flip;
}

@observer
export class FlipTile extends React.Component<FlipTileProps>
{
  private renderFlipVideo(flip: Flip): JSX.Element
  {
    return <video width="320" height="240" controls>
      <source src={`assets/flips/mp4/${flip.flipId}.mp4`} type="video/mp4"/>
      Your browser does not support the video tag.
    </video>;

    //TODO: multiple videos, like texas (onboard and outside)
  }

  render()
  {
    const flip: Flip = this.props.flip;
    return <div>
      {flip.carClass}
      {flip.rotations}
      {flip.notes}
      <br/>
      {this.renderFlipVideo(flip)}
    </div>
  }
}
