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
import { withRouter} from "react-router-dom";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import axios from 'axios';
import IssuerBar from "./../components/IssuerBar";
import * as Constants from "./../Constants";
import * as Utils from "./../Utils";
import Container from '@material-ui/core/Container';
import CUSTOMPAGINATIONACTIONSTABLE from "./../components/tablepagination.js"
import Grid from '@material-ui/core/Grid';
import {  makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography';

const apiBaseUrl = Constants.apiBaseUrl;

function CredentialTable(props) {
  return(
  <div className="grid">
    <Grid item xs={12}  style={{margin:"auto"}}>
        <Container maxWidth='false'  className="tableContainer">
        <Box position="relative" >
          <Typography  variant="h6">
              Proofs
          </Typography>
        </Box>
          {props.this.state.proofs}
        </Container>
    </Grid>
  </div>
  );
}

class ProofScreen extends Component {

    constructor(props){
        super(props);
        Utils.checkLogin(this)
        let proofOfIncome = [
          ["Bank"], ["Last name"], ["First name"], ["Date of birth"] ,
          ["Month 1"], ["Income month 1"],["Balance month 1"],
          ["Month 2"], ["Income month 2"],["Balance month 2"],
          ["Month 3"], ["Income month 3"],["Balance month 3"]
        ].map((elem) => [elem[0].replace(/\s/g, "_")]).map((elem) => [elem[0],"3V3hNz25KVFvg8JdAQWqqu:3:CL:49:Proof_of_Income"])
        let IDCard = [["Issuing municipality"], ["Last name"], 
        ["Given name"], ["Place of birth"], ["Date of birth"] ,["Sex"]
        ,["Number of birth registration"],["Height"],["Municipality of residence"],
        ["Address"],["Issuing date"],["Expiration date"],["Nationality"],["Fiscal code"],["Signature"],["Validity to travel"]].map((elem) => [elem[0].replace(/\s/g, "_")]).map((elem) => [elem[0],"WDxzddggRk2HnmY6rc5AHg:3:CL:54:Italian_ID_Card"])
        var requestedAttrs = proofOfIncome//.concat(IDCard)
        if(props.location.hasOwnProperty("state") && props.location.state !== undefined){
        this.state={
          recipientDid: props.location.state.hasOwnProperty("recipientDid") ? props.location.state.recipientDid : "",
          credDefId: props.location.state.hasOwnProperty("credDefId")  ? props.location.state.credDefId: "3V3hNz25KVFvg8JdAQWqqu:3:CL:49:Proof_of_Income",
          credentialValues: {},
          credentialRequests: [],
          credentialDefinitions: [],
          requested_attributes: requestedAttrs,
          proofRequestName: "IncomeVerify",
          proofRequestVersion: "1.0",
          proofs: <CUSTOMPAGINATIONACTIONSTABLE 
            data={[]} 
            showAttr={[]}
            showAttr={["did","status", "proof.identifiers[0].cred_def_id", "proof.identifiers[0].schema_id", "wallet", "createdAt", "id"]}
          />,
          
        }
      } else {
        this.state={
          recipientDid: "",
          credDefId: "3V3hNz25KVFvg8JdAQWqqu:3:CL:49:Proof_of_Income",
          proofId: "",
          credentialDefinitions: [],
          requested_attributes: requestedAttrs,
          proofRequestName: "IncomeVerify",
          proofRequestVersion: "1.0",
          proofs: <CUSTOMPAGINATIONACTIONSTABLE 
          data={[]} 
          showAttr={[]}
          showAttr={["did","status", "proof.identifiers[0].cred_def_id", "proof.identifiers[0].schema_id", "wallet", "createdAt", "id"]}
        />,
        }
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
    if (response.status === 200) {
      let proofs = <CUSTOMPAGINATIONACTIONSTABLE 
      onEdit={(event, selected) => self.handleEdit(event, selected)} 
      data={response.data} 
      showAttr={["did","status", "proof.identifiers[0].cred_def_id", "proof.identifiers[0].schema_id", "wallet", "createdAt", "id"]}/>
      self.setState({proofs: proofs})
    }
      /*{
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
              <RaisedButton label="Verify" primary={true} style={style} onClick={(event) => self.verifyProofIdClick(event,proof.id)} />
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
              <RaisedButton label="Verify" primary={true} style={style} onClick={(event) => self.verifyProofIdClick(event,proof.id)} />
              </ListItem>
            </List>
          </div>
          </ListItem>
        )}
      })}</List> 
/*      response.data.sort(Utils.compareDates).map((proof) => {
        if(proof.status === "received") receivedProofs.push(proof)
        else pendingProofs.push(proof)
      }) */

   //   self.setState({proofs: proofs})
   // }
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

handleEdit(event, selected){ //Fuction 
  this.setState({ selected: selected}); 
} 

handleTabChange(newTab){
  console.log(newTab)
  this.props.onTabChange(newTab)
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
      <MuiThemeProvider>
      <div>
      <IssuerBar onTabChange={(newTab) => this.handleTabChange(newTab)} tabNr={this.props.tabNr}/>
      <CredentialTable this={this}/>
      
       {/*   <div>
      Send proof request:
      <br />
      <TextField
                hintText="Set recipient DID"
                floatingLabelText="Recipient DID"
                defaultValue={this.state.recipientDid}
                value={this.state.recipientDid}
                onChange={(event, newValue) => this.setState({ recipientDid: newValue })}
            />
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
            Optional: select recipient by username:
      <Select
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
        <br />
        Select requested attributes:
      <List>{this.state.requested_attributes.map((attr, index) => {
              return(
              <div>
                <ListItem>
                {attr[0]}
              <RaisedButton label="Remove" primary={true} style={style} onClick={() => { 
                    var requested_attributes = this.state.requested_attributes;
                    requested_attributes.splice(index,1);
                    this.setState({ requested_attributes: requested_attributes})
                    }} />
                    </ListItem></div>)})}
                    </List>
            <br />
            <RaisedButton label="Send proof request" primary={true} style={style} onClick={(event) => this.sendProofRequestClick(event)} />
      </div>     
                  */}

    {/* <div>
      Verify Proof received from DID {this.state.recipientDid}:
      <br />
      <TextField
                hintText="Set proof ID"
                floatingLabelText="Proof ID"
                defaultValue={this.state.proofId}
                onChange={(event, newValue) => this.setState({ proofId: newValue })}
            />
            <br />
            <RaisedButton label="Verify proof" primary={true} style={style} onClick={(event) => this.verifyProofClick(event)} />
      </div>    
      */}
      
      </div>
      </MuiThemeProvider>
    </div>

  )
}

}

const style = {
    margin: 15,
};
  
  export default withRouter(ProofScreen);

