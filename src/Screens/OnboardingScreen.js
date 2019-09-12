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
const mongoDBBaseUrl = Constants.mongoDBBaseUrl;




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
      myDid: "",
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
      axios.get(apiBaseUrl + "connection/" + '4ERnq5sBAWuNf4zdpWHTRN' /*  this.state.myDid */ , {headers: headers}).then((response) => {
        console.log(response.status)
        if(response.status === 200){
          let status = JSON.parse(response.data.acknowledged)
          if(status === true){
          //  alert('onboarded new Citizen succsessfully')

            this.setState({citizen_did: response.data.theirDid})
            self.addDidToCitizenInformation()
          //  Utils.sendCredentialOffer(theirDid,self.state.credDefId)
            //this.props.history.push({pathname: "/credential",state: {credDefId: credDefId}});
          }
        }
      })
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
                    self.setState({connection_message: JSON.stringify(response.data.message), myDid: response.data.meta.myDid})
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
 async addDidToCitizenInformation() {

  let self = this
  let headers = {
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem("token") 
  }

  let citizen_payload={did: this.state.myDid}

  await axios.put(mongoDBBaseUrl + "citizens/" + this.state.citizen_id, citizen_payload, {headers}).then(function (response) {
          if (response.status === 200) {
          }
  }).catch(function (error) {
    //alert(JSON.stringify(schema_payload))
    //alert(error);
    console.log(error);
});

 }

handleTabChange(newTab){
  console.log(newTab)
  this.props.onTabChange(newTab)
}

goTosendCredentialScreen(){
  this.props.history.push({
    pathname: '/sendCredOffer',
    state: { myDid: this.state.myDid}
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