import React, { Component } from 'react';
/*
Screen:LoginScreen
Loginscreen is the main screen which the user is shown on first visit to page and after
hitting logout
*/
import './App.css';
/*
Module:Material-UI
Material-UI is used for designing ui of the app
*/
import injectTapEventPlugin from 'react-tap-event-plugin';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import {blue500, red500, greenA200} from 'material-ui/styles/colors';
import { Link, withRouter, Redirect} from "react-router-dom";
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import axios from 'axios';
import IssuerBar from "./IssuerBar"

var QRCode = require('qrcode.react');

var apiBaseUrl = ""REPLACE"";

function RenderQR(props){
  if(props.isOnboarded){
    return <QRCode value={props.connectionMessage} size={256}/>
  } else {
    return null
  }

}

/*
Module:superagent
superagent is used to handle post/get requests to server
*/
var request = require('superagent');

class OnboardingScreen extends Component {
  constructor(props){
    super(props);

    this.state={
      //TODO: change username
      username: '',
      connection_message: '',
      citizen_did:'',
      citizen_verkey:'',
      onboarded:true,
      printingmessage:'',
      printButtonDisabled:false
    }
  }

  handleOnboarding(event) {
    var self = this;
    var payload = {
        "did": this.state.citizen_did,
        "verkey": this.state.citizen_verkey,
        "role": "NONE"
    }
    var headers = {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem("token") 
    }
    axios.post(apiBaseUrl + 'nym' ,payload, {headers: headers})
        .then(function (response) {
            console.log(response);
            console.log(response.status);
            if (response.status === 200) {
                console.log("Onboarding successfully executed");
                console.log(response.data);
                var payload_conn = {
                  "meta": {
                    "username": self.state.username
                  },
                  "data": {
                    "app": "<your-app-or-service-name>"
                  }
                }
                axios.post(apiBaseUrl + 'connectionoffer' ,payload_conn, {headers: headers})
                .then(function (response) {
                  console.log(response);
                  console.log(response.status);
                  if (response.status === 201) {
                    self.setState({connection_message: JSON.stringify(response.data.message), onboarded: true})
                  }
                }).catch(function (error) {
                  alert(error);
                  console.log(error);
              });

            } else if (response.status === 204) {
                console.log("TODO: handle onboarding errors");
                alert("TODO: handle onboarding errors")
            }
            else {
                console.log("Onboarding is unsuccesful");
                alert("Onboarding is unsuccesful");
            }
        })
        .catch(function (error) {
            alert(error);
            console.log(error);
        });
}

  componentDidMount(){
    if(this.state.onboarded){
    var self = this;
    var headers = {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem("token") 
    }
     var payload_conn = {
                  "meta": {
                    "username": self.state.username
                  },
                  "data": {
                    "app": "<your-app-or-service-name>"
                  }
                }
                axios.post(apiBaseUrl + 'connectionoffer' ,payload_conn, {headers: headers})
                .then(function (response) {
                  console.log(response);
                  console.log(response.status);
                  if (response.status === 201) {
                    self.setState({connection_message: JSON.stringify(response.data.message)})
                  }
                }).catch(function (error) {
                  alert(error);
                  console.log(error);
              });
            } 

  }
  /*
  Function:handleCloseClick
  Parameters: event,index
  Usage:This fxn is used to remove file from filesPreview div
  if user clicks close icon adjacent to selected file
  */

 handleSelect(event) {
  var self = this;
  var headers = {
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem("token") 
  }
  this.setState({
    onboarded: event.target.value
  });
  if(event.target.value === true){
     var payload_conn = {
                  "meta": {
                    "username": self.state.username
                  },
                  "data": {
                    "app": "issuer app"
                  }
                }
              axios.post(apiBaseUrl + 'connectionoffer' ,payload_conn, {headers: headers})
                .then(function (response) {
                  console.log(response);
                  console.log(response.status);
                  if (response.status === 201) {
                    self.setState({connection_message: JSON.stringify(response.data.message)})
                  }
                }).catch(function (error) {
                  alert(error);
                  console.log(error);
              });
            } 
}

handleCloseClick(event,index){

}

handleClick(event){
  
}
/*
  Function:toggleDrawer
  Parameters: event
  Usage:This fxn is used to toggle drawer state
  */
/*
  Function:toggleDrawer
  Parameters: event
  Usage:This fxn is used to close the drawer when user clicks anywhere on the 
  main div
  */
handleDivClick(event){
  
}
/*
  Function:handleLogout
  Parameters: event
  Usage:This fxn is used to end user session and redirect the user back to login page
  */
handleLogout(event){
  // console.log("logout event fired",this.props);
  localStorage.clear();
  var self = this;
  self.props.history.push("/");
}

  render() {
    return (
      <div className="App">
      <div>
      <center>
      <MuiThemeProvider>
      <IssuerBar />
      <TextField
                hintText="Enter username of citizen"
                floatingLabelText="Citizen username"
                onChange={(event, newValue) => this.setState({ username: newValue })}
            />
            <br/>
      <TextField
                hintText="Enter citizen DID"
                floatingLabelText="Citizen DID"
                onChange={(event, newValue) => this.setState({ citizen_did: newValue })}
            />
            <br/>
            <TextField
                hintText="Enter citizen verkey"
                floatingLabelText="Citizen verkey"
                onChange={(event, newValue) => this.setState({ citizen_verkey: newValue })}
            />
             <br />
           <RaisedButton label="Onboard citizen" primary={true} style={style} onClick={(event) => this.handleOnboarding(event)}/>
      </MuiThemeProvider>
      </center>
      </div>
      <div>
        Is the citizen already onboarded? <br />
            <MuiThemeProvider>
              <select value={this.state.onboarded} onChange={this.handleSelect.bind(this)}>
              <option value={true}>Already onboarded</option>
              <option value={false}>Not yet onboarded</option>
              </select>
            </MuiThemeProvider>
          </div>
          <div onClick={(event) => this.handleDivClick(event)}>
          <center>
          <br />
          <div>
          <br />
          <RenderQR isOnboarded={this.state.onboarded} connectionMessage={this.state.connection_message}/>
          <br />
          </div>
          <br />
          </center>
      <MuiThemeProvider>
           <RaisedButton label="Logout" primary={true} style={style} onClick={(event) => this.handleLogout(event)}/>
      </MuiThemeProvider>
          </div>
          </div>
    );
  }
}

const style = {
  margin: 15,
};

export default withRouter(OnboardingScreen);