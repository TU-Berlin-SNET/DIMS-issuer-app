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

import PropTypes from 'prop-types';
import { Link, withRouter, Redirect} from "react-router-dom";
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import {List, ListItem, Table, TableHead, TableBody, TableRow, TableCell} from '@material-ui/core'
import axios from 'axios';
import IssuerBar from "./../components/IssuerBar"
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Container from '@material-ui/core/Container'
import * as Constants from "./../Constants";
import * as Utils from "./../Utils";
import SendIcon from '@material-ui/icons/Send';
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Snackbar from './../components/customizedSnackbar';
import Footer from "./../components/footer";
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'


const apiBaseUrl = Constants.apiBaseUrl;
var loaded = false

class ProofScreen extends Component {

    constructor(props){
        super(props);
        Utils.redirectToLogin(this)
        /*
        let proofOfIncome = [
          ["bank"], ["Last name"], ["First name"], ["Date of birth"] ,
          ["Month 1"], ["Income month 1"],["Balance month 1"],
          ["Month 2"], ["Income month 2"],["Balance month 2"],
          ["Month 3"], ["Income month 3"],["Balance month 3"]
        ]
        */
        let proofOfIncome1 = [
          ["id"], ["firstname"], ["lastname"] ,
           ["dateofbirth"], ["placeofbirth"], ["gender"],
           ["address"]
        ].map((elem) => [elem[0].replace(/\s/g, "_")]).map((elem) => [elem[0],"LMttqGZBmGcE4RcJAPZsrd:3:CL:153:naturalPerson"])
        
        let proofOfIncome2 = [
          ["bank"], ["incomemonth1"], ["incomemonth2"], ["incomemonth3"],
           ["balancemonth1"], ["balancemonth2"], ["balancemonth3"]
        ].map((elem) => [elem[0].replace(/\s/g, "_")]).map((elem) => [elem[0],"X8vHHB47bYsQLVFGDdJxSF:3:CL:168:income"])

let proofOfIncome = proofOfIncome1.concat(proofOfIncome2)


        let IDCard = [["Issuing municipality"], ["Last name"], 
        ["Given name"], ["Place of birth"], ["Date of birth"] ,["Sex"]
        ,["Number of birth registration"],["Height"],["Municipality of residence"],
        ["Address"],["Issuing date"],["Expiration date"],["Nationality"],["Fiscal code"],["Signature"],["Validity to travel"]].map((elem) => [elem[0].replace(/\s/g, "_")]).map((elem) => [elem[0],"Tv17sXzVYtbjgs7cmKh3WW:3:CL:106:Italian_ID_Card"])
        var requestedAttrs = proofOfIncome//.concat(IDCard)
        if(props.location.hasOwnProperty("state") && props.location.state !== undefined){
        this.state={
          recipientDid: '',
          myDid: props.location.state.hasOwnProperty("myDid")  ? props.location.state.myDid : "",
          recipientUsername: "",
          credDefId: props.location.state.hasOwnProperty("credDefId")  ? props.location.state.credDefId: "4zQUw7VESVNQifgqjES2Ef:3:CL:139:Proof_of_Income",
          credentialValues: {},
          credentialRequests: [],
          credentialDefinitions: [],
          requested_attributes: requestedAttrs,
          proofRequestName: "IncomeVerify",
          proofRequestVersion: "1.0",
          proofs: [],
          pairwiseConnectionsOptions: [],
          credDef: {attributes: [],
          value: "4zQUw7VESVNQifgqjES2Ef:3:CL:139:Proof_of_Income",
          label: ""},
          snackbarOpen: false,
          snackbarMessage: "",
          snackbarVariant: "sent",
        }
      } else {
        this.state={
          recipientDid: "",
          recipientUsername: "",
          credDefId: "4zQUw7VESVNQifgqjES2Ef:3:CL:139:Proof_of_Income",
          proofId: "",
          credentialDefinitions: [],
          requested_attributes: requestedAttrs,
          proofRequestName: "IncomeVerify",
          proofRequestVersion: "1.0",
          proofs: [],
          pairwiseConnectionsOptions: [],
          credDef: {attributes: [],
          value: "4zQUw7VESVNQifgqjES2Ef:3:CL:139:Proof_of_Income",
          label: ""},
          snackbarOpen: false,
          snackbarMessage: "",
          snackbarVariant: "sent",
        }
      }
      }


      handleTabChange(newTab){
        this.props.onTabChange(newTab)
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
console.log(self.state.requested_attributes)
var temp = self.mapRequestedAttributes(self.state.requested_attributes)
console.log(temp)
self.setState({
  requested_attributes: temp
}, () => {
    let requestedAttrs = self.state.requested_attributes.reduce(function(map, obj) {
      map["map"][obj[0].toLowerCase().replace(/\s/g, "_") + "_referent"] = {"name": obj[0].toLowerCase().replace(/\s/g, ""), "restrictions": [{ "cred_def_id": obj[1] }]};
      map["index"] = map["index"] + 1;
      return map;
    }, {"map":{},"index":1})["map"];
console.log(requestedAttrs)
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
        self.setState({snackbarVariant: "sent", snackbarOpen: true, snackbarMessage: "proof request successfully sent"}, () => 
        self.props.history.push({
          pathname: '/db',
          state: { }
        })
      );
      }
    }).catch(function (error) {
          console.log(error);
          self.setState({snackbarVariant: "error", snackbarOpen: true, snackbarMessage: "error"});
    });
}
)
 
}

sendProofRequestClick(){
  this.sendProofRequest()
}



verifyProofClick(event){
  this.verifyProof()
}

verifyProofIdClick(event,id){
  this.setState({proofId: id})
  this.verifyProof()
}

componentDidMount(){
  document.title = "issuer app"
  Utils.listCredDefs(this)
  this.getTheirDid()
  this.checkAllAttributes()
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

getTheirDid(){
  let self = this
  var headers = {
  'Content-Type': 'application/json',
  'Authorization': localStorage.getItem("token")
}

    axios.get(apiBaseUrl + 'connection/' + self.state.myDid ,{headers: headers}).then(function (response) {
      console.log(response)
      if (response.status === 200) {
          self.state.recipientDid = response.data.theirDid
      }
    }).catch(function (error) {
    //alert(error);
    //alert(JSON.stringify(payload))
    console.log(error);
    });
}


/*currentAttribute(attr, index){
  return(
    <Grid item xs={3}>
                  <Chip
        label={attr[0].replace("_referent","").replace(/_/g, " ")}
        onDelete={() => { 
          var requested_attributes = this.state.requested_attributes;
          requested_attributes.splice(index,1);
          this.setState({ requested_attributes: requested_attributes})}}
        variant="outlined"
        className="chip"
        />
</Grid> )
}
*/


mapRequestedAttributes(requested_attributes){
  var requestedAttrs = []
  Object.keys(requested_attributes).map((index) => {

    if(this.state[index] === true){
      requestedAttrs.push(requested_attributes[index])
    }
  })
  console.log(requestedAttrs)
  return requestedAttrs
}


checkAllAttributes(){
  console.log(this.state.requested_attributes)
  for(let attr of this.state.requested_attributes){
    this.setState({...this.state, [this.state.requested_attributes.indexOf(attr)] : false},() =>  {
      loaded = true
      this.forceUpdate()
    } 
    )  }
}


 handleAttributeCheckChange(index, value){
    this.setState({ [index]: value } , () => console.log(this.state));
    
  };



currentAttribute(attr, index){
  if(loaded){
  return(
    <TableRow key={index}>
      <TableCell>
         {attr[0].replace("_referent","").replace(/_/g, " ")}
      </TableCell>
      <TableCell>
        <FormControl>
        <FormGroup>

      <FormControlLabel
        control={
          <Checkbox
          checked={this.state[index]}
          onChange={(event) => this.handleAttributeCheckChange(index, event.target.checked)}
          inputProps={{
            'aria-label': 'primary checkbox',
          }}
        />
 
        }
      />
      </FormGroup>
      </FormControl>

      </TableCell>
    </TableRow>
  )
      }
}

render() {
  return(
    <div className="App">
      <MuiThemeProvider>
      <div>
      <IssuerBar onTabChange={(newTab) => this.handleTabChange(newTab)} tabNr={this.props.tabNr} parentContext={this}/>
      <div className="grid">
      <Grid item xs={12}  style={{margin:"auto"}}>

      <Container maxWidth={false} className="tableContainer">
      <Grid container   
            direction="row"
            justify='space-evenly'
            spacing={4}
            style={{margin:"auto"}}>
            <Grid item container spacing={0} xs={12}>
              <Grid item xs={12}>
                  <Typography variant="h5">
                    Send Proof Request
                  </Typography> 
              </Grid>
            </Grid>       
            <Grid item xs={12} />

            <Grid item container xs={12}
              justify='center'
              component={Paper}
              spacing={8}
              >
                <Grid item container  xs={6} alignItems='center' justify='center'   >
                  <Grid item xs={6}>
                        Credential definition ID:
                          <Select value={this.state.credDef.value}
                            style={{width: (this.state.credDef.value.length * 10) + 'px'}}

                            renderValue={() => this.state.credDef.value}
                                onChange={(event) => 
                                  {
                                    console.log(event.target.value.value)
                                    this.setState({credDef: event.target.value, requested_attributes: event.target.value["attributes"].map((attr => [attr, event.target.value.value]))}, 
                                    () => {loaded = false 
                                      this.checkAllAttributes()})
                                  }
                                }
                            >
                              {this.state.credentialDefinitions.map((credD, key)=> {
                                return(
                                  <MenuItem value={credD} key={key} >{credD.value}</MenuItem>
                                )})}
                            </Select>
                    </Grid>
                </Grid>

                <Grid item container xs={6} justify='center' >
                  <Grid item xs={12}>
                    <Typography variant="h6">
                      Attributes
                    </Typography>   
                  </Grid> 
                  <Grid container item xs={6}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            attribute
                          </TableCell>
                          <TableCell>
                            check
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                      {this.state.requested_attributes.map((attr, index) => 
                              this.currentAttribute(attr, index) 
                          )}  
                      </TableBody>
                    </Table>     
                  </Grid>
                </Grid>      
              <Grid container item xs={12} justify='center'>
                <Button variant="outlined" color="primary" style={style} onClick={(event) => this.sendProofRequestClick(event)}>
                  Send proof request <SendIcon />
                </Button>
              </Grid>
            </Grid>
          <Grid item  xs={12} />
        </Grid>
      </Container>
      </Grid>
    </div>
      </div>

      <Snackbar message={this.state.snackbarMessage}
                  variant={this.state.snackbarVariant} 
                  snackbarOpen={this.state.snackbarOpen} 
                  closeSnackbar={() => this.setState({snackbarOpen: false})} 
        />
            <Footer />
      </MuiThemeProvider>
    </div>
  )
}

}

const style = {
    margin: 15,
};
  
  export default withRouter(ProofScreen);