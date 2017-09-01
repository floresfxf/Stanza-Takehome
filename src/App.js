import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

import {GridList, GridTile} from 'material-ui/GridList';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Snackbar from 'material-ui/Snackbar';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Loyalty from 'material-ui/svg-icons/action/loyalty';

const baseURL = `https://www.stanza.dance/api/graphql?query=%7B%0A%20%20calendar(shortname%3A%20%22livenation%22)%20%7B%0A%20%20%20%20name%0A%20%20%20%20images%20%7B%0A%20%20%20%20%20%20large%0A%20%20%20%20%7D%0A%20%20%20%20subscriberCount%0A%20%20%20%20upcomingEvents%3A%20events(first%3A%2010%2C%20filterBy%3A%20%7Bpast%3A%20false%7D)%20%7B%0A%20%20%20%20%20%20edges%20%7B%0A%20%20%20%20%20%20%20%20node%20%7B%0A%20%20%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20%20%20category%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20ticketingPrimary%0A%20%20%20%20%20%20%20%20%20%20images%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20small%0A%20%20%20%20%20%20%20%20%20%20%20%20medium%0A%20%20%20%20%20%20%20%20%20%20%20%20large%0A%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20dates%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20start%0A%20%20%20%20%20%20%20%20%20%20%20%20end%0A%20%20%20%20%20%20%20%20%20%20%20%20allDay%0A%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A`
//The query after URI encoding^

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      image: '',
      events: [],
      name: '',
      subCount: 0,
      headerImage:'',
      open: false,
      category: []
    }
  }
  componentDidMount(){//Load dad after component mounts (quicker loading time)
    const self = this;
    axios.get(baseURL)
    .then(function (response) {
      const res = response.data.data.calendar;
      let arr = {};
      res.upcomingEvents.edges.forEach((tile)=>{
        if (!arr[tile.node.category.name]){
          arr[tile.node.category.name] = 1; //No duplicates
        }
      })
      let newArr = ['All',...Object.keys(arr)]; //All option to turn off filters
      self.setState({
        events: res.upcomingEvents.edges,
        origEvents: res.upcomingEvents.edges,
        name: res.name,
        subCount: (parseInt(res.subscriberCount,10)/ 1000).toFixed(1), //to isplay as x.xk subs
        headerImage: res.images.large,
        category: newArr
      })
    })
  }
 handleToggle = () => this.setState({drawerOpen: !this.state.open});
 handleClose = (cat) => { //set filter
   this.setState({
     drawerOpen: false
   },() => {
     this.filter(cat);
   });
 };
  handleTouchTap = () => {
    this.setState({
      open: true,
    });
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };
  filter = (label)  =>{ //show all if label is All
    if (label === "All"){
      const events = [...this.state.origEvents]; //dont mutate original state
      this.setState({
        events: events
      })
    }else{
      const newEvents = this.state.origEvents.filter((event)=>{ //filter based on selection
        return event.node.category.name === label;
      })
      this.setState({
        events: newEvents
      })
    }
  }
  render() {
    return (
      <div className="App">
        <div className="bg-wrap" style={{backgroundImage:`url(${this.state.headerImage})` }}>
          <div className="App-header">
            {/* <div> */}
            <div className="title"><IconButton
              className="iconTop"
              onClick={this.handleToggle}
              iconStyle={{color:'white',}}
              ><MoreVertIcon /></IconButton>

              <h2>{this.state.name}</h2></div>

              <RaisedButton
                label="Add to Calendar"
                style={styles.subButton}
                backgroundColor="#EFAE45"
                labelColor='#fff'
                onClick={this.handleTouchTap}/>

              <h4>{this.state.subCount}K Subscribers</h4>

              <Drawer
               docked={false}
               width={200}
               open={this.state.drawerOpen}
               onRequestChange={(drawerOpen) => this.setState({drawerOpen})}
             >
               <h3>Category/Location</h3>
               {this.state.category.map((cat, i)=><MenuItem key={i} value={cat} onClick={this.handleClose.bind(this, cat)}>{cat}</MenuItem>)}


             </Drawer>
          </div>
        </div>

        <div style={styles.root}>
          <GridList
            cellHeight={300}
            style={styles.gridList}
            cols={3}
          >
            {this.state.events.map((tile, i) => (
              <GridTile
                key={i}
                title={tile.node.name}
                className="item"
                subtitle={<div>
                            <div>
                              <b>{new Date(tile.node.dates.start).toLocaleDateString()}</b>
                            </div>
                            <div>
                              <b>{new Date(tile.node.dates.start).toLocaleTimeString()}</b>
                            </div>
                          </div>}
                actionIcon={<div><span><IconButton href={tile.node.ticketingPrimary}><Loyalty color="white" /></IconButton></span><span><i className="fa fa-ticket" aria-hidden="true"></i></span></div>}
              >
                <img src={tile.node.images.medium} alt="Oops!"/>
              </GridTile>
            ))}

          </GridList>
        </div>
        <Snackbar//for subscribe button confirmation
          open={this.state.open}
          message="Event added to your calendar"
          autoHideDuration={4000}
          onRequestClose={this.handleRequestClose}
        />
      </div>
    );
  }
}

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingTop: 5
  },
  iconStyles:{
  marginRight: 24,
},
  gridList: {
    width: '100%',
    height: 450,
    overflowY: 'auto',
  },
  subButton :{
    margin: 12,

  }
};

export default App;
