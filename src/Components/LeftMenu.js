import React, { Component } from 'react';

import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

export default class LeftMenu extends Component {
  render(){
    return(
      <Drawer
       docked={false}
       width={200}
       open={this.props.drawer}
       onRequestChange={(drawerOpen) => this.props.drawerChange(drawerOpen)}
     >
       <h3>Category/Location</h3>

       {this.props.category.map((cat, i)=><MenuItem key={i} value={cat} onClick={this.props.handleLeftClose.bind(this, cat)}>{cat}</MenuItem>)}

     </Drawer>
    )
  }
}
