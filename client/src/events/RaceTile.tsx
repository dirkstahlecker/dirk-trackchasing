import React from 'react';
import {observer} from "mobx-react";
import {observable, action, makeObservable, runInAction} from "mobx";
import { Race } from '../Types';
import { printDate } from '../utilities';

export interface RaceTileProps
{
  race: Race;
}

@observer
export class RaceTile extends React.Component<RaceTileProps>
{
  constructor(props: RaceTileProps)
  {
    super(props);

    this.fetchRecapIfAvailable();
  }

	//determine if we have a recap
	private async fetchRecapIfAvailable(): Promise<void>
	{
		// const x = this.props.machine.currentTrack!.name.replaceAll(/\s/, "_");
		// const y = this.props.machine.currentTrack!.da
		// const pdfName = `${}`
		// const recapFile = await fetch(`/recaps/8-21-21_Perris_Auto_Speedway.pdf`)


    
	}

  render()
  {
    return <div className="event-place">
      {printDate(this.props.race.date)}: {this.props.race.classes}
    </div>;
  }
}
