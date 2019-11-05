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

import {withRouter, Link} from "react-router-dom";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import axios from 'axios';
import IssuerBar from "./../components/IssuerBar";
import * as Constants from "./../Constants";
import * as Test from "./../test";
import * as Utils from "./../Utils";
import Footer from "./../components/footer"
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Checkbox from '@material-ui/core/Checkbox';
import ArrowBackRounded from '@material-ui/icons/ArrowBackRounded';

var QRCode = require('qrcode.react');

const apiBaseUrl = Constants.apiBaseUrl;
const mongoDBBaseUrl = Constants.mongoDBBaseUrl;

var username =''


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
      person_id: props.location.state.person_id,
      person_did:'',
      person_firstname: props.location.state.person_firstname,
      person_lastname: props.location.state.person_lastname,
      person_verkey:'',
      username: '',
      onboarded:true,
      myDid: props.location.state.person_did,
      sendCredentialOfferCheck: false,
      role: Utils.getRole(),
      sendProofCheck: true
    }
  }
  
  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = null;
  }

  //GET  /api/connection/:myDid
  pollNewConnectionStatus(){
    console.log(this.state.myDid)
      var self = this;
      var headers = {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem("token") 
      }
      axios.get(apiBaseUrl + "connection/" +  self.state.myDid , {headers: headers}).then((response) => {
        console.log(response.status)
        if(response.status === 200){
          let status = JSON.parse(response.data.acknowledged)
          if(status === true){
            self.setState({person_did: response.data.theirDid})
            self.addDidToPersonInformation()
            if(self.state.sendCredentialOfferCheck === true){
              this.props.history.push({
                pathname: '/sendCredOffer',
                state: { myDid: self.state.myDid, 
                         person_id: self.state.person_id,
                         justOnboarded: true,
                        modelName: self.props.location.state.modelName}
              })
            } 
            else if (self.state.sendProofCheck === true){    
              this.props.history.push({
                pathname: '/proofs',
                state: { myDid: self.state.myDid, 
                         person_id: self.state.person_id,
                         modelName: self.props.location.state.modelName}
              })
            }
            else{
              self.props.history.push({
                pathname: '/db',
                state : {
                  justOnboarded: true,
                }
              })
            }
          }
        }
      })
    }



    handleOnboarding(event) {
      var self = this;
      var payload = {
          "did": this.state.person_did,
          "verkey": this.state.person_verkey,
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
                  console.log(response.data)
              }
            }).catch(function (error){
              console.log(error)
            })
          }  


  componentDidMount(){
    document.title = "issuer app"
    this.getWallet()
    this.timer = setInterval(() => this.pollNewConnectionStatus(), 5000);
  }

 async createConnectionOffer(){
  var self = this;

    var headers = {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem("token") 
    }
    console.log(self.state.username)
     let payload_conn = {
      "meta":{
        "username" : self.state.person_firstname + "_" + self.state.person_lastname
       },
       "data":{
         "app": username
       }
                }
             await   axios.post(apiBaseUrl + 'connectionoffer' ,payload_conn, {headers: headers})
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

 async getWallet(){
    var self = this;
    var headers = {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem("token") 
    }
  await axios.get(apiBaseUrl + "user/me" , {headers: headers}).then((response) => {

      if(response.status === 200){
        console.log(response)
          username = response.data.username
          this.createConnectionOffer()
      }
    }).catch((error)=> {
        console.log(error)
    })
  }

handleCredentialOfferCheckChange =  event => {
  this.setState({sendCredentialOfferCheck: event.target.checked});
};

handleSendProofCheckChange = event => {
  this.setState({sendProofCheck: event.target.checked})
}
/*
  Function:handleLogout
  Parameters: event
  Usage:This fxn is used to end user session and redirect the user back to login page
  */
 async addDidToPersonInformation() {

  let self = this
  let headers = {
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem("token") 
  }

  let person_payload={did: self.state.myDid}

  await axios.put(mongoDBBaseUrl  + self.props.location.state.modelName + '/' + self.state.person_id, person_payload, {headers}).then(function (response) {
          if (response.status === 200) {
          }
  }).catch(function (error) {
    //alert(JSON.stringify(schema_payload))
    //alert(error);
    console.log(error);
});

 }


showCheckbox(){
  if(this.state.role === 'shop'){
    return(
      <Box >
        send proof request now?
        <Checkbox  
          onChange={this.handleSendProofCheckChange}
          color='primary'
          checked={this.state.sendProofCheck}
          value="sendProofChecked"
        />
      </Box>)
  }
  else{
    return(
      <Box >
        send credentials now?
        <Checkbox  
          onChange={this.handleCredentialOfferCheckChange}
          color='primary'
          checked={this.state.sendCredentialOfferCheck}
          value="onboardChecked"
        />
      </Box>)}
}

handleTabChange(newTab){
  console.log(newTab)
  this.props.onTabChange(newTab)
}



  render() {
    return (
      <MuiThemeProvider>
      <div className="App">
      <IssuerBar onTabChange={(newTab) => this.handleTabChange(newTab)} tabNr={this.props.tabNr}/>
      <Grid item xs={12} style={{margin:"auto"}}>
      <Container maxWidth={false} className="tableContainer">
        <Grid container  
              item 
              direction="row"
              justify='space-evenly'
              spacing={4}
              xs={12} style={{margin:"auto"}}>
          <Grid item container spacing={0} xs={12}>
            <Grid item xs={1} position='relative'>
              <Box position='absolute' left={16}>
                <Link  to={"db"}>
                  <ArrowBackRounded style={{color:'white'}} fontSize="large" />
                </Link>
              </Box>
            </Grid>
            <Grid item xs={10}>
              <Typography variant="h5">
                  Onboard {this.props.location.state.modelName.slice(0,this.props.location.state.modelName.length -1)}
              </Typography> 
            </Grid>
          <Grid item xs={1} position='relative'>
          </Grid>     
        </Grid>
        <Grid item xs={12} />
        <Grid item container xs={12}
              justify='center'
              component={Paper}
              spacing={8}
        >
          <Grid item xs={12}>
            <RenderQR isOnboarded={this.state.onboarded} connectionMessage={this.state.connection_message}/> 
          </Grid>
          <Grid item xs={2} />
          <Grid item xs={8}>
            <Typography children={'Scan the QR Code wih your mobile app'} /> 
          </Grid>
          <Grid item xs={2}>
            {this.showCheckbox()}
          </Grid>
          </Grid>
          <Grid item xs={12} />
     </Grid>
        </Container>
      </Grid>
      <Footer />
      </div>
          </MuiThemeProvider>
    );
  }
}

const style = {
  margin: 15,
};


export default withRouter(OnboardingScreen);