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
import axios from 'axios';
import IssuerBar from "./../components/IssuerBar";
import * as Constants from "./../Constants";
import * as Utils from "./../Utils";

import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
var QRCode = require('qrcode.react');

const apiBaseUrl = Constants.apiBaseUrl;



function RenderQR(props){
  if(props.isOnboarded){
    return <QRCode value={props.connectionMessage} size={256}/>
  } else {
    return null
  }
}


class OnboardingScreen extends Component {
  constructor(props){
    super(props);
    Utils.checkLogin(this)
    this.state={
      //TODO: change username
      connection_message: '',
      citizen_id: props.location.state.citizen_id,
      citizen_did:'',
      citizen_verkey:'',
      onboarded:true,
      newMyDid: "",
      sendCredentialOfferCheck: true,
    }
  }
  
  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = null;
  }

  //GET  /api/connection/:myDid
  pollNewConnectionStatus(){
      var self = this;
      var headers = {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem("token") 
      }
      axios.get(apiBaseUrl + "connection/" + this.state.newMyDid, {headers: headers}).then((response) => {
        console.log(response.status)
        if(response.status === 200){
          let status = JSON.parse(response.data.acknowledged)
          if(status === true){
            alert('onboarded new Citizen succsessfully')
            this.setState({citizen_did: response.data.theirDid})
          //  Utils.sendCredentialOffer(theirDid,self.state.credDefId)
            self.setState({newMyDid: ""})
            //this.props.history.push({pathname: "/credential",state: {credDefId: credDefId}});
          }
        }
      })
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
                }
                axios.post(apiBaseUrl + 'connectionoffer' ,payload_conn, {headers: headers})
                .then(function (response) {
                  console.log(response);
                  console.log(response.status);
                  if (response.status === 201) {
                    self.setState({connection_message: JSON.stringify(response.data.message), onboarded: true})
                  }
                }).catch(function (error) {
                  //alert(error);
                  console.log(error);
              });

            } else if (response.status === 204) {
                console.log("TODO: handle onboarding errors");
                //alert("TODO: handle onboarding errors")
            }
            else {
                console.log("Onboarding is unsuccesful");
                alert("Onboarding is unsuccesful");
            }
        })
        .catch(function (error) {
            //alert(error);
            console.log(error);
        });
}

  componentDidMount(){
    document.title = "issuer app"
    this.timer = setInterval(() => this.pollNewConnectionStatus(), 5000);
    var self = this;
    var headers = {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem("token") 
    }
     let payload_conn = {
       id : self.state.citizen_id
                }
                axios.post(apiBaseUrl + 'connectionoffer' ,payload_conn, {headers: headers})
                 .then(function (response) {
                  console.log(response);
                  console.log(response.status);
                  if (response.status === 201) {
                    self.setState({connection_message: JSON.stringify(response.data.message), newMyDid: response.data.meta.myDid})
                  }
                }).catch(function (error) {
                  //alert(error);
                  console.log(error);
              }); 

  }


handleCredentialOfferCheckChange =  event => {
  this.setState({sendCredentialOfferCheck: event.target.checked});
};
/*
  Function:handleLogout
  Parameters: event
  Usage:This fxn is used to end user session and redirect the user back to login page
  */


handleTabChange(newTab){
  console.log(newTab)
  this.props.onTabChange(newTab)
}

goTosendCredentialScreen(){
  this.props.history.push({
    pathname: '/sendCredOffer',
    state: { citizen_did: this.state.citizen_did }
  })
}


  render() {
    return (
      <MuiThemeProvider>
      <div className="App">
      <IssuerBar onTabChange={(newTab) => this.handleTabChange(newTab)} tabNr={this.props.tabNr}/>
  
      <Grid item xs={8} md={6} xl={4} style={{margin:"auto"}}>
    <Box position='relative' marginTop='15vh'>
      <Grid item xs={12}>
            <Grid
                component= {Paper}
                container
                direction="row"
                justify="center"
                alignItems="flex-start"
                >
                {/*padding*/}
                <Box position='absolute' top='8%' left='0' right='0'>
                  <Typography>Onboard Citizen {this.props.location.state.firstName} {this.props.location.state.familyName}</Typography> 
               </Box>
                <Grid item xs={12} >
                    <Box height='8vh' />       
                </Grid>
                  <RenderQR isOnboarded={this.state.onboarded} connectionMessage={this.state.connection_message}/> 
                  <Grid item xs={12} >
                    <Box height='8vh' />       
                  </Grid>
              </Grid>
              <Box position='absolute' bottom='8%' left='0' right='0'>
                <Typography children={'Scan the QR Code wih your mobile app'} /> 
               </Box>
            </Grid>
            <Box position='absolute' bottom="8%" right= {8}>
                    send credentials now?
                <Checkbox  
                    onChange={this.handleCredentialOfferCheckChange}
                    color='primary'
                    checked={this.state.sendCredentialOfferCheck}
                    value="onboardChecked"
                />
                </Box>
            </Box>
      </Grid>
      <Button  color="primary" style={style} onClick={(event) => this.goTosendCredentialScreen(event)}>Send Credential</Button>
      </div>
          </MuiThemeProvider>
    );
  }
}

const style = {
  margin: 15,
};

export default withRouter(OnboardingScreen);