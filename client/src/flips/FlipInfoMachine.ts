import React from 'react';
import {observable, action, makeObservable} from "mobx";
import { Flip } from '../Types';
import { API } from '../API';

export class FlipInfoMachine
{
  constructor()
  {
    makeObservable(this);
    this.fetchAllFlips();
  }

  @observable
  public flips: Flip[] | null = null;

  private async fetchAllFlips(): Promise<void>
  {
    const flips: Flip[] = await API.fetchAllFlips();
    if (flips.length > 0)
    {
      this.flips = flips;
    }
  }


}
