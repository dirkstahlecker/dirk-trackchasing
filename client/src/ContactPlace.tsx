import React from 'react';
import {observer} from "mobx-react";
import {observable, action, makeObservable} from "mobx";

export interface ContactPlaceProps
{

}

@observer
export class ContactPlace extends React.Component<ContactPlaceProps>
{
  render()
  {
    return <div className="contact-place">
      {/* <button onClick={this.props.navMachine.goHome}>Go Home</button> */}
      Contact: <a href="mailto:TrackchaserDirk@gmail.com">TrackchaserDirk@gmail.com</a>
    </div>;
  }
}