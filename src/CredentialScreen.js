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
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import {blue500, red500, greenA200} from 'material-ui/styles/colors';
import { Link, withRouter, Redirect} from "react-router-dom";
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {List, ListItem} from 'material-ui/List'
import axios from 'axios';
import IssuerBar from './IssuerBar';
import Select from 'react-select';
import * as Constants from "./Constants";
import * as Utils from "./Utils"

const apiBaseUrl = Constants.apiBaseUrl;

//var apiBaseUrl = ""REPLACE"";
//var apiBaseUrl = ""REPLACE"";

class CredentialScreen extends Component {

    constructor(props){
        super(props);
        Utils.checkLogin(this)
        if(props.location.hasOwnProperty("state") && props.location.state !== undefined){
        this.state={
          recipientDid: props.location.state.hasOwnProperty("recipientDid") ? props.location.state.recipientDid : "",
          credDefId: props.location.state.hasOwnProperty("credDefId")  ? props.location.state.credDefId: "",
          credentialRequestId: props.location.state.hasOwnProperty("credentialRequestId") ? props.location.state.credentialRequestId : "",
          credentialValues: {},
          credentialRequests: [],
          credentialDefinitions: [],
          pairwiseConnectionsOptions: []
        }
      } else {
        this.state={
          recipientDid: "",
          credDefId: "",
          credentialRequestId: "",
          credentialValues: {},
          credentialRequests: [],
          credentialDefinitions: [],
          pairwiseConnectionsOptions: []
        }
      }
    }

/* POST /api/credentialoffer
 {
	"recipientDid": "{{prover_issuer_pairwise_did}}",
	"credDefId": "{{cred_def_id}}"
}
*/
async sendCredentialOffer(){
 var self = this;
 var headers = {
  'Content-Type': 'application/json',
  'Authorization': localStorage.getItem("token") 
 }
 var payload = {
   'recipientDid': this.state.recipientDid,
   'credDefId': this.state.credDefId
}
 axios.post(apiBaseUrl + 'credentialoffer' ,payload, {headers: headers}).then(function (response) {
  console.log(response);
  console.log(response.status);
  if (response.status === 201) {
    alert("Credential offer successfully sent")
  }
}).catch(function (error) {
//alert(error);
//alert(JSON.stringify(payload))
console.log(error);
});

}

async listCredDefs(){
  var self = this;
  var headers = {
    'Authorization': localStorage.getItem("token")
  }
  await axios.get(apiBaseUrl + "credentialdef", {headers: headers}).then(function (response) {
    console.log(response);
    console.log(response.status);
    console.log(response.data);
    if (response.status === 200) {
      let credDefs = response.data.map((credDef) => {
        return(
          {label: credDef.data.tag, value: credDef.credDefId}
        )
      }
      )
      self.setState({credentialDefinitions: credDefs})
    }
  }).catch(function (error) {
    //alert(error);
    console.log(error);
  });
}

// GET wallet/default/connection
async listPairwiseConnectionOptions(){
  var self = this;
  var headers = {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem("token")
  }
  await axios.get(apiBaseUrl + "wallet/default/connection", {headers: headers}).then(function(response){
      console.log(response);
      console.log(response.status);
      if (response.status === 200) {
        let pairwiseConnections = response.data.map((conn) => {
            return(
              {
                  value: conn.their_did,
                  label: conn.metadata.username 
              }
            )
        })
        self.setState({
            pairwiseConnectionsOptions: pairwiseConnections
        })
      }
    }).catch(function (error) {
    //alert(error);
    console.log(error);
    });
}

/* GET /api/credentialrequest
/api/credential
*/
async listCredentialRequests(){
 var self = this;
 var headers = {
  'Content-Type': 'application/json',
  'Authorization': localStorage.getItem("token") 
 }
 await axios.get(apiBaseUrl + 'credentialrequest' , {headers: headers}).then(function (response) {
    console.log(response);
    console.log(response.status);
    if (response.status === 200) {
      let credReqs = response.data.sort(Utils.compareDates).map((credReq) => {
        //const {credentialValues} = self.state;
        var credentialValues = {}
        credReq.meta.offer.key_correctness_proof.xr_cap.filter((elem => elem[0] !== "master_secret")).map((elem) => 
          {credentialValues[elem[0]] = ""})
        return(
          <div>
            Credential requests:
            <List onClick={() => self.setState({ recipientDid: credReq.senderDid, credDefId: credReq.message.message.cred_def_id, credentialValues: credentialValues, credentialRequestId: credReq.id})}>
              <ListItem onClick={() => self.setState({ recipientDid: credReq.senderDid, credDefId: credReq.message.message.cred_def_id, credentialValues: credentialValues, credentialRequestId: credReq.id})}>
              Sender (own) DID: {credReq.recipientDid}
              </ListItem>
              <ListItem>
              Recipient DID: {credReq.senderDid}
              </ListItem>
              <ListItem>
              Credential definition ID: {credReq.message.message.cred_def_id}
              </ListItem>
              <ListItem>
              Credential request ID: {credReq.id}
              </ListItem>
              <ListItem>
                Credential attributes names:
                <List>
                {credReq.meta.offer.key_correctness_proof.xr_cap.filter((elem => elem[0] !== "master_secret")).map((elem) => 
                  {return(<ListItem>{elem[0]}</ListItem>)})}
                </List>
              </ListItem>
            </List>
          </div>
        )
      })
      self.setState({credentialRequests: credReqs})
    }
  }).catch(function (error) {
  //alert(error);
  console.log(error);
})

}

componentDidMount(){
  document.title = "issuer app"
  this.listCredentialRequests()
  this.listPairwiseConnectionOptions()
  this.listCredDefs()
  this.timer = setInterval(() => {
    this.listCredentialRequests();
    this.listPairwiseConnectionOptions();
    this.listCredDefs()}, 5000
    );
}

componentWillUnmount() {
  clearInterval(this.timer);
  this.timer = null;
}

sendCredentialClick(){
  this.acceptCredentialRequestAndSendCred()
}

sendCredentialOfferClick(){
  this.sendCredentialOffer()
}


/* POST 
{
	"credentialRequestId": "5c7071b8db4eb00010a3779d",
	"values": {
		"given_name@string": "Jesse Digital",
        "address@string": "Digitalstreet 0101",
        "birth_date@date": "1998-01-19"
	}
}
*/
async acceptCredentialRequestAndSendCred(){
  var headers = {
  'Content-Type': 'application/json',
  'Authorization': localStorage.getItem("token")
}
var payload = {
  'credentialRequestId': this.state.credentialRequestId,
  'values': this.state.credentialValues
}
axios.post(apiBaseUrl + 'credential' ,payload, {headers: headers}).then(function (response) {
  console.log(response);
  console.log(response.status);
  if (response.status === 201) {
    //alert("credential succesfully issued")
    window.location.reload()
  }
}).catch(function (error) {
//alert(error);
//alert(JSON.stringify(payload))
console.log(error);
});

}

render() {
  return(
    <div className="App">
      <MuiThemeProvider>
      <IssuerBar />
      {this.state.credentialRequests}
      

      <table className="CredentialScreenLayout">
        <tr></tr>
        <tr>
          <td>
          <div className="SendCredentialOffer">
        <p className="blockName"  >Send credential offer:</p>
        Select user:
      <br />
      <Select
          className="SelectCredential"
          inputId="react-select-single"
          TextFieldProps={{
            label: 'User',
            InputLabelProps: {
              htmlFor: 'react-select-single',
              shrink: true,
            },
            placeholder: 'Search username for DID',
          }}
          options={this.state.pairwiseConnectionsOptions}
          onChange={(event) => this.setState({recipientDid: event.value})}
        />
        Select credential Definition:
      <br />
      <Select 
	        className="SelectCredential"
          inputId="react-select-single"
          TextFieldProps={{
            label: 'User',
            InputLabelProps: {
              htmlFor: 'react-select-single',
              shrink: true,
            },
            placeholder: 'Search for credential definition ID',
          }}
          options={this.state.credentialDefinitions}
          onChange={(event) => this.setState({credDefId: event.value})}
        />
      <TextField
                className = "CredTextField"
                hintText="Set recipient DID"
                floatingLabelText="Recipient DID"
                defaultValue={this.state.recipientDid}
                onChange={(event, newValue) => this.setState({ recipientDid: newValue })}
            />
            <br />
      <TextField
                className = "CredTextField"
                hintText="Set credential defintion ID"
                floatingLabelText="Credential definition ID"
                defaultValue={this.state.credDefId}
                onChange={(event, newValue) => this.setState({ credDefId: newValue })}
            />
            <br />
            <RaisedButton label="Offer" primary={true} style={style} onClick={(event) => this.sendCredentialOfferClick(event)} />
      </div>
          </td>
          <td></td> 
        </tr>
        <tr>          
          <td></td>
          <td>
          <div className ="SendCredential">
          <p className="blockName"  >Send credential</p>
      <TextField
                className = "CredTextField"
                hintText="Set credential request ID"
                floatingLabelText="Credential request ID"
                defaultValue={this.state.credentialRequestId}
                onChange={(event, newValue) => this.setState({ credentialRequestId: newValue })}
            />
            <br />
      <TextField
                className = "CredTextField"
                hintText="Set recipient DID"
                floatingLabelText="Recipient DID"
                defaultValue={this.state.recipientDid}
                onChange={(event, newValue) => this.setState({ recipientDid: newValue })}
            />
            <br />
            <TextField
                className = "CredTextField"
                hintText="Set credential definition ID"
                floatingLabelText="Credential definition ID"
                defaultValue={this.state.credDefId}
                onChange={(event, newValue) => this.setState({ credDefId: newValue })}
            />
            <br />
            
            {Object.keys(this.state.credentialValues).map((key) => {return(
              <div>
              <TextField hintText={"Set " + key} 
              floatingLabelText={key}
              defaultValue={this.state.credentialValues[key]}
              onChange={(event, newValue) => {
                const {credentialValues} = this.state;
                credentialValues[key] = newValue;
                this.setState({ credentialValues: credentialValues})}}
                />
                <br />
                </div>
                );
              })}
              
            <RaisedButton label="Send credential" primary={true} style={style} onClick={(event) => this.sendCredentialClick(event)} />
      </div>
          </td>
        </tr>
      </table>
      </MuiThemeProvider>
    </div>
  )
}

}

const style = {
    margin: 15,
};
  
  export default withRouter(CredentialScreen);
