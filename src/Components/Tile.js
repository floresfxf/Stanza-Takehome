import React, { Component } from 'react';

import Subtitle from '../Components/Subtitle.js'

import {GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Loyalty from 'material-ui/svg-icons/action/loyalty';

export default class Tile extends Component {
  render(){
    return(
      <GridTile
        title={this.props.tileVal.node.name}
        className="item"
        subtitle={<Subtitle dateTime={this.props.tileVal.node.dates.start} />}
        actionIcon={<IconButton href={this.props.tileVal.node.ticketingPrimary}><Loyalty color="white" /></IconButton>}
      >
        <img src={this.props.tileVal.node.images.medium} alt="Oops!"/>
      </GridTile>
    )
  }
}
