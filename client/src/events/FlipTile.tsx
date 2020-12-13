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
  render()
  {
    const flip: Flip = this.props.flip;
    return <div>
      {flip.carClass}
      {flip.rotations}
      {flip.notes}
    </div>
  }
}
