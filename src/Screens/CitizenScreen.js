import React, { Component } from 'react';
/*
Screen:LoginScreen
Loginscreen is the main screen which the user is shown on first visit to page and after
hitting logout
*/
import './../CSS/App.css';

/*
Module:Material-UI
Material-UI is used for designing ui of the app
*/

import {withRouter} from "react-router-dom";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IssuerBar from'./../components/IssuerBar'

/*
Module:superagent
superagent is used to handle post/get requests to server
*/
// var request = require('superagent');

class CitizenScreen extends Component {
  constructor(props){
    super(props);

    this.state={
    }
  }

  componentDidMount(){

  }
  /*
  Function:handleCloseClick
  Parameters: event,index
  Usage:This fxn is used to remove file from filesPreview div
  if user clicks close icon adjacent to selected file
  */


 handleTabChange(newTab){
  this.props.onTabChange(newTab)
}
openIssuerDB(){
  this.props.history.push('/issuerDB')
}

  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <IssuerBar onTabChange={(newTab) => this.handleTabChange(newTab)} tabNr={this.props.tabNr}/>

          <Box position='absolute' top='40%'  left='30%'>
            <Button size='large' color='primary' variant='contained' onClick={(event)=> this.openIssuerDB()}>Issuer DB</Button> 
          </Box>
          <Box position='absolute'  top='40%'  right='30%'>
            <Button size='large' color='primary' variant='contained'>Verifier DB</Button> 
          </Box>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withRouter(CitizenScreen);