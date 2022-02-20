import React from 'react';
import {observer} from "mobx-react";
import {observable, action, makeObservable, runInAction, computed} from "mobx";
import {Race} from '../Types';
import { API } from '../API';

export class RaceInfoMachine
{
	constructor()
	{
		makeObservable(this);
	}

	@observable
	public mostRecentRace: any | null = null;

	public async fetchMostRecent(): Promise<void>
	{
		this.mostRecentRace = await API.fetchMostRecentRace();
	}
}
