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
import Paper from '@material-ui/core/Paper'

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
          credentialRequests:  <CUSTOMPAGINATIONACTIONSTABLE data={[]} showAttr={[]}/>,
          credentialDefinitions: [],
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
async sendCredentialOffer(){
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



componentDidMount(){
  document.title = "issuer app"
  this.listCredDefs()
  this.timer = setInterval(() => {
    this.listCredDefs()}, 5000
    );
}

componentWillUnmount() {
  clearInterval(this.timer);
  this.timer = null;
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

handleTabChange(newTab){
  console.log(newTab)
  this.props.onTabChange(newTab)
}


render() {
  return(
    <MuiThemeProvider>
    <div className="App">
    <IssuerBar onTabChange={(newTab) => this.handleTabChange(newTab)} tabNr={this.props.tabNr}/>
      
          <div className="SendCredentialOffer">


      </div>


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
                <Box p={2}>
                  <Typography children={'Send credential Offer'} /> 
               </Box>
                <Grid item xs={12} >
                    <Box height='8vh' />       
                </Grid>
                <Grid item xs={8}>
                   Select Cred Definition:
                  <Select 
                      className="SelectCredential"
                      inputId="react-select-single"
                      TextFieldProps={{
                        label: 'Credential Definiton',
                        InputLabelProps: {
                          htmlFor: 'react-select-single',
                          shrink: true,
                        },
                        placeholder: 'Search for credential definition ID',
                      }}
                      options={this.state.credentialDefinitions}
                      onChange={(event) => this.setState({credDefId: event.value})}
                  />
                  </Grid>
                  <Grid item xs={12} >
                    <Box height='8vh' />       
                </Grid>
                <Box p={2}>
                <Button  color='primary' variant='contained' onClick={(event) => this.sendCredentialOfferClick(event)}>Offer</Button>
               </Box>
              </Grid>
            </Grid>
            </Box>
      </Grid>
      </div>
    </MuiThemeProvider>
  )
}

}

const style = {
    margin: 15,
};
  
  export default withRouter(CredentialScreen);
