import React, { Component } from 'react';
/*
Screen:LoginScreen
Loginscreen is the main screen which the user is shown on first visit to page and after
hitting logout
*/
/*
Module:Material-UI
Material-UI is used for designing ui of the app
*/

import Button from '@material-ui/core/Button';
import {withRouter} from "react-router-dom";
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import axios from 'axios';
import Select from 'react-select';
import IssuerBar from "./../components/IssuerBar";
import * as Constants from "./../Constants";
import * as Utils from "./../Utils";
import CUSTOMPAGINATIONACTIONSTABLE from "./../components/tablepagination.js"
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import AcceptIcon from '@material-ui/icons/Done'

const apiBaseUrl = Constants.apiBaseUrl;

//var apiBaseUrl = ""REPLACE"";
//var apiBaseUrl = ""REPLACE"";


function CredentialTable(props) {
  return(
  <div className="grid">
    <Grid item xs={12} md={10} xl={8} style={{margin:"auto"}}>
        <Container className="tableContainer">
        <Box position="relative" >
          <Typography  variant="h6">
              Credentials
          </Typography>
        </Box>
          {props.this.state.credentialRequests}
        </Container>
    </Grid>
  </div>
  );
}

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
          credentialRequests:  <CUSTOMPAGINATIONACTIONSTABLE data={[]} showAttr={[]}/>,
          credentialDefinitions: [],
          pairwiseConnectionsOptions: [],
          selected: "",
        }
      }
    }

/* POST /api/credentialoffer
 {
	"recipientDid": "{{prover_issuer_pairwise_did}}",
	"credDefId": "{{cred_def_id}}"
}
*/

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
      
   /*   let data = response.data.sort(Utils.compareDates).map((credReq) => {
        //const {credentialValues} = self.state;
        credReq.meta.offer.key_correctness_proof.xr_cap.filter((elem => elem[0] !== "master_secret"))       
      }) */
      
     let credReqs = <CUSTOMPAGINATIONACTIONSTABLE 
     onEdit={(event, selected) => self.handleEdit(event, selected)} 
     data={response.data} 
     showAttr={["recipientDid","senderDid", "id"]}
     rowFunctions={[
      { 
        rowFunction: function (selected){self.sendCredentials(selected)},
       rowFunctionName : 'accept and send',
       rowFunctionIcon : <AcceptIcon />
      }
     ]}/>
     
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
  this.timer = setInterval(() => {
    this.listCredentialRequests();
    this.listPairwiseConnectionOptions();
    }, 5000
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

handleEdit(event, selected){ //Fuction 
  this.setState({ selected: selected}); 
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
sendCredentials(selected){

  this.props.history.push({
    pathname: '/sendCredentials',
    state: { credReq: selected}
    })
}

handleTabChange(newTab){
  this.props.onTabChange(newTab)
}


render() {
  return(
    <MuiThemeProvider>
    <div className="App">
    <IssuerBar onTabChange={(newTab) => this.handleTabChange(newTab)} tabNr={this.props.tabNr}/>
      <CredentialTable this={this}/>
      
          <div className="SendCredentialOffer">
            
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
                    </div>
      
    </div>
    </MuiThemeProvider>
  )
}

}

const style = {
    margin: 15,
};
  
  export default withRouter(CredentialScreen);
