import React, { Component } from 'react';
/*
Screen:LoginScreen
Loginscreen is the main screen which the user is shown on first visit to page and after
hitting logout
*/
//import './../CSS/App.css';
/*
Module:Material-UI
Material-UI is used for designing ui of the app
*/
import injectTapEventPlugin from 'react-tap-event-plugin';

import ProofTable from './ProofTable'


import { Link, withRouter, Redirect} from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import {List, ListItem} from '@material-ui/core'
import axios from 'axios';
import IssuerBar from "./../components/IssuerBar"
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
//import Select from 'react-select'
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Container from '@material-ui/core/Container'
import Chip from '@material-ui/core/Chip';
import { orange, amber, green, red } from '@material-ui/core/colors';
import * as Constants from "./../Constants";
import * as Utils from "./../Utils"

const apiBaseUrl = Constants.apiBaseUrl;

class ProofScreen extends Component {

    constructor(props){
        super(props);
        Utils.redirectToLogin(this)
        let proofOfIncome = [
          ["Bank"], ["Last name"], ["First name"], ["Date of birth"] ,
          ["Month 1"], ["Income month 1"],["Balance month 1"],
          ["Month 2"], ["Income month 2"],["Balance month 2"],
          ["Month 3"], ["Income month 3"],["Balance month 3"]
        ].map((elem) => [elem[0].replace(/\s/g, "_")]).map((elem) => [elem[0],"Tv17sXzVYtbjgs7cmKh3WW:3:CL:106:Proof_of_Income"])
        let IDCard = [["Issuing municipality"], ["Last name"], 
        ["Given name"], ["Place of birth"], ["Date of birth"] ,["Sex"]
        ,["Number of birth registration"],["Height"],["Municipality of residence"],
        ["Address"],["Issuing date"],["Expiration date"],["Nationality"],["Fiscal code"],["Signature"],["Validity to travel"]].map((elem) => [elem[0].replace(/\s/g, "_")]).map((elem) => [elem[0],"Tv17sXzVYtbjgs7cmKh3WW:3:CL:106:Italian_ID_Card"])
        var requestedAttrs = proofOfIncome//.concat(IDCard)
        if(props.location.hasOwnProperty("state") && props.location.state !== undefined){
        this.state={
          recipientDid: props.location.state.hasOwnProperty("recipientDid") ? props.location.state.recipientDid : "",
          recipientUsername: "",
          credDefId: props.location.state.hasOwnProperty("credDefId")  ? props.location.state.credDefId: "Tv17sXzVYtbjgs7cmKh3WW:3:CL:106:Proof_of_Income",
          credentialValues: {},
          credentialRequests: [],
          credentialDefinitions: [],
          requested_attributes: requestedAttrs,
          proofRequestName: "IncomeVerify",
          proofRequestVersion: "1.0",
          proofs: [],
          pairwiseConnectionsOptions: []
        }
      } else {
        this.state={
          recipientDid: "",
          recipientUsername: "",
          credDefId: "Tv17sXzVYtbjgs7cmKh3WW:3:CL:106:Proof_of_Income",
          proofId: "",
          credentialDefinitions: [],
          requested_attributes: requestedAttrs,
          proofRequestName: "IncomeVerify",
          proofRequestVersion: "1.0",
          proofs: [],
          pairwiseConnectionsOptions: []
        }
      }
      }


      handleTabChange(newTab){
        this.props.onTabChange(newTab)
      }
      openIssuerDB(event){
        this.changeActiveDB(event)
          this.setState({db: this.state.issuerDB})
      }
      
      openVerifierDB(event){
          this.changeActiveDB(event)
          this.setState({db: this.state.verifierDB})
      }
      
      changeActiveDB(event){
      
        let issuerButton = document.getElementById('issuerButton')
        let verifierButton = document.getElementById('verifierButton')
      
        if(event.target.innerHTML === 'Issuer DB'){
            verifierButton.style.backgroundColor = '#6980ff'
            issuerButton.style.backgroundColor = '#FF7C7C' 
        }
        else if(event.target.innerHTML =='Verifier DB'){
          verifierButton.style.backgroundColor =  '#FF7C7C' 
          issuerButton.style.backgroundColor = '#6980ff'
        }
      }

/* POST /api/proofrequest
 {
	"recipientDid": "GS7rMbi48CsBSBXjiovZAA",
	"proofRequest": {
		"name": "NameVerify",
		"version": "1.0",
		"requested_attributes": {
			"attr1_referent": {
				"name": "given_name@string",
				"restrictions": [{ "cred_def_id": "{{cred_def_id}}" }]
			}
		},
		"requested_predicates": { }
	}
} attrs:
[
        "Bank", "Last name", 
        "First name", "Date of birth" ,
        "Month 1", "Income month 1","Balance month 1",
        "Month 2", "Income month 2","Balance month 2",
        "Month 3", "Income month 3","Balance month 3"
      ]
*/
async sendProofRequest(){
 var self = this;
 var headers = {
  'Content-Type': 'application/json',
  'Authorization': localStorage.getItem("token") 
 }

let requestedAttrs = this.state.requested_attributes.reduce(function(map, obj) {
  map["map"][obj[0].toLowerCase().replace(/\s/g, "_") + "_referent"] = {"name": obj[0].toLowerCase().replace(/\s/g, ""), "restrictions": [{ "cred_def_id": obj[1] }]};
  map["index"] = map["index"] + 1;
  return map;
}, {"map":{},"index":1})["map"];
var payload =  {
    "recipientDid": this.state.recipientDid,
    "proofRequest": {
      "name": this.state.proofRequestName,
      "version": this.state.proofRequestVersion,
      "requested_attributes": requestedAttrs,
      "requested_predicates": { }
    }
  }
 axios.post(apiBaseUrl + 'proofrequest' ,payload, {headers: headers}).then(function (response) {
  console.log(response);
  console.log(response.status);
  if (response.status === 201) {
    alert("proof request successfully sent")
  }
}).catch(function (error) {
//alert(error);
//alert(JSON.stringify(payload))
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


sendProofRequestClick(){
  this.sendProofRequest()
}

/* GET /api/proof
*/
async listProofs(){
 var self = this;
 var headers = {
  'Content-Type': 'application/json',
  'Authorization': localStorage.getItem("token") 
 }
 await axios.get(apiBaseUrl + 'proof' , {headers: headers}).then(function (response) {
    console.log(response);
    console.log(response.status);
    if (response.status === 200) {
      let proofs = <List>{response.data.sort(Utils.compareDates).map((proof) => {if(proof.status === "received"){
        return(
          <ListItem>
          <div>
            Proof:
            <List onClick={() => {self.setState({ recipientDid: proof.did, proofId: proof.id})}}>
              <ListItem onClick={() => {self.setState({ recipientDid: proof.did, proofId: proof.id})}}>
              Sender DID: {proof.did}
              </ListItem>
              <ListItem>
              Status: {proof.status}
              </ListItem>
              <ListItem>
              Credetial definition: {proof.proof.identifiers[0].cred_def_id}
              </ListItem>
              <ListItem>
              Schema: {proof.proof.identifiers[0].schema_id}
              </ListItem>
              <ListItem>
              Wallet: {proof.wallet}
              </ListItem>
              <ListItem>
              Created at: {proof.createdAt}
              </ListItem>
              <ListItem>
              Proof ID: {proof.id}
              </ListItem>
              <ListItem>
                <List>
                {Object.keys(proof.proof.requested_proof.revealed_attrs).map((key) => {return(
                  <ListItem>
                  {key.replace("_referent","").replace(/_/g, " ") + ": " + proof.proof.requested_proof.revealed_attrs[key]["raw"]}
                  </ListItem>
                )})}
                </List>
              </ListItem>
              <ListItem>
              <Button label="Verify" primary={true} style={style} onClick={(event) => self.verifyProofIdClick(event,proof.id)} />
              </ListItem>
            </List>
          </div>
          </ListItem>
        )} else {return (
          <ListItem>
          <div>
            Proof:
            <List onClick={() => {self.setState({ recipientDid: proof.did, proofId: proof.id})}}>
              <ListItem onClick={() => {self.setState({ recipientDid: proof.did, proofId: proof.id})}}>
              Sender DID: {proof.did}
              </ListItem>
              <ListItem>
              Status: {proof.status}
              </ListItem>
              <ListItem>
              Created at: {proof.createdAt}
              </ListItem>
              <ListItem>
              Proof ID: {proof.id}
              </ListItem>
              <ListItem>
              <Button label="Verify" primary={true} style={style} onClick={(event) => self.verifyProofIdClick(event,proof.id)} />
              </ListItem>
            </List>
          </div>
          </ListItem>
        )}
      })}</List>
      self.setState({proofs: proofs})
    alert(proofs)
    }
  }).catch(function (error) {
  //alert(error);
  console.log(error);
})

}

/* GET /api/proof/:proof_request_id

*/
async verifyProof(){
var self = this;
 var headers = {
  'Content-Type': 'application/json',
  'Authorization': localStorage.getItem("token") 
 }
 await axios.get(apiBaseUrl + 'proof/' + this.state.proofId , {headers: headers}).then(function (response) {
    console.log(response);
    console.log(response.status);
    if (response.status === 200) {
      let proof = response.data
      if(typeof(proof.isValid) == 'undefined'){
        alert("Verification failed. Please try again!")
      } else {
        let isValid = proof.isValid ? "is" : "is not"
        alert("Proof " + isValid + " valid!")
    }
    }
  }).catch(function (error) {
  console.log(error);
})
}

verifyProofClick(event){
  this.verifyProof()
}

verifyProofIdClick(event,id){
  this.setState({proofId: id})
  this.verifyProof()
}

componentDidMount(){
  document.title = "verifier app"
  this.listProofs()
  this.listPairwiseConnectionOptions()
  this.timer = setInterval(() => {this.listProofs(); this.listPairwiseConnectionOptions()},5000)
}

componentWillUnmount(){
  clearInterval(this.timer)
  this.timer = null
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

render() {
  return(
    <div className="App">
      <ThemeProvider>
      <div>
      <IssuerBar onTabChange={(newTab) => this.handleTabChange(newTab)} tabNr={this.props.tabNr}/>
          <div>
      Send proof request to DID:
      <br />
      <TextField
                hintText="Set recipient DID"
                floatingLabelText="Recipient DID"
                defaultValue={this.state.recipientDid}
                value={this.state.recipientDid}
                onChange={(event, newValue) => this.setState({ recipientDid: newValue })}
            />
      <br />
      Credential definition ID:
      <br />
      <TextField
                hintText="Set credential defintion ID"
                floatingLabelText="Credential definition ID"
                defaultValue={this.state.credDefId}
                value={this.state.credDefId}
                onChange={(event, newValue) => this.setState({ credDefId: newValue })}
            />
            <br />
            <br />
            Select recipient DID by username:
        <br />
        <FormControl variant="outlined" >
        <Select
          value={this.state.recipientUsername}
          onChange={(event) => {this.setState({recipientDid: event.target.value["value"], recipientUsername: event.target.value["label"]})}
        }
          //labelWidth="200px"
        >
        {
          this.state.pairwiseConnectionsOptions.map(
            (conn) => {
              return(
                <MenuItem value={conn}>{conn["label"]}</MenuItem>
              )
            }
          )
        }
        </Select>
      </FormControl>
        <div>
        Select requested attributes:
      {this.state.requested_attributes.map((attr, index) => {
        return(
                <Chip
        label={attr[0].replace("_referent","").replace(/_/g, " ")}
        onDelete={() => { 
          var requested_attributes = this.state.requested_attributes;
          requested_attributes.splice(index,1);
          this.setState({ requested_attributes: requested_attributes})}}
        variant="outlined"
        className="chip"
        />)})
      }
            </div>
            <br />
            <Button label="Send proof request" primary={true} style={style} onClick={(event) => this.sendProofRequestClick(event)} />
      </div>
      <ProofTable />
      <br />
      {/*this.state.proofs*/}
      </div>
      </ThemeProvider>
    </div>
  )
}

}

const style = {
    margin: 15,
};
  
  export default withRouter(ProofScreen);