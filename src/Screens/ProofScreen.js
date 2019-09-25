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
import TextField from '@material-ui/core/TextField';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import {List, ListItem} from '@material-ui/core'
import axios from 'axios';
import IssuerBar from "./../components/IssuerBar"
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Container from '@material-ui/core/Container'
import Chip from '@material-ui/core/Chip';
import { orange, amber, green, red } from '@material-ui/core/colors';
import * as Constants from "./../Constants";
import * as Utils from "./../Utils";
import SendIcon from '@material-ui/icons/Send';
import ArrowBackRounded from '@material-ui/icons/ArrowBackRounded';
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import MoreAttributes from './../components/moreAttributesDialog';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import Snackbar from '@material-ui/core/Snackbar';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import { lighten, makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';

const apiBaseUrl = Constants.apiBaseUrl;

const variantIcon = {
  sent: CheckCircleIcon,
  error: ErrorIcon,
};

const useStylesSendProofSnackbar = makeStyles(theme => ({
  sent: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
}));

function SendProofSnackbarContentWrapper(props) {
  const classes = useStylesSendProofSnackbar();
  const { className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={clsx(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={clsx(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton key="close" aria-label="close" color="inherit" onClick={onClose}>
          <CloseIcon className={classes.icon} />
        </IconButton>,
      ]}
      {...other}
    />
  );
}

SendProofSnackbarContentWrapper.propTypes = {
  className: PropTypes.string,
  message: PropTypes.string,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(['sent','error']).isRequired,
};

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
          pairwiseConnectionsOptions: [],
          credDef: {attributes: [],
            value: "Tv17sXzVYtbjgs7cmKh3WW:3:CL:106:Proof_of_Income",
            label: ""},
            snackbarOpen: false,
            proofSendRes: "",
            proofSentMessage: "",
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
          pairwiseConnectionsOptions: [],
          credDef: {attributes: [],
            value: "Tv17sXzVYtbjgs7cmKh3WW:3:CL:106:Proof_of_Income",
            label: ""},
            snackbarOpen: false,
            proofSendRes: "",
            proofSentMessage: "",
        }
      }
      }

      handleSelectValueChange(event, index, value){
        this.setState({recipientDid: event.target.value["value"], recipientUsername: event.target.value["label"]})
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
    //alert("proof request successfully sent")
    self.setState({proofSendRes: "sent", snackbarOpen: true, proofSentMessage: "proof request successfully sent"});
  }
}).catch(function (error) {
//alert(error);
//alert(JSON.stringify(payload))
console.log(error);
self.setState({proofSendRes: "error", snackbarOpen: true, proofSentMessage: "error"});
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
  document.title = "issuer app"
  Utils.listCredDefs(this)
  this.listPairwiseConnectionOptions()
  this.timer = setInterval(() => {this.listPairwiseConnectionOptions()},5000)
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

handleSnackbarOpen() {
  this.setState({snackbarOpen: true})
}

handleSnackbarClose(event, reason) {
  this.setState({snackbarOpen: false});
  if (reason === 'clickaway') {
    return;
  }
} 

currentAttribute(attr, index){
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
      <div className="grid">
      <Container maxWidth='false' className="tableContainer">
      <Box> 
      <Grid container   
      direction="row"
      justify='space-evenly'
      spacing={4}
      xs={12} style={{margin:"auto"}}>
        <Grid item xs={12}>
            <Typography variant="h5">
              Send Proof Request
            </Typography> 
        </Grid>
      <Grid item xs={12} />
      <Grid item container xs={12}
        justify='center'
        component={Paper}
        spacing={8}
        >
        <Grid item container xs={4} justify='center'   >
        Credential definition ID:
          <Select value={this.state.credDef.value}
            defaultValue={this.state.credDef.value}
            style={{width: (this.state.credDef.value.length * 10) + 'px'}}

            renderValue={() => this.state.credDef.value}
                onChange={(event) => 
                  {
                    this.setState({credDef: event.target.value, requested_attributes: event.target.value["attributes"].map((attr => [attr, event.target.value.value]))})
                  }
                }
            >
              {this.state.credentialDefinitions.map((credD, key)=> {
                return(
                  <MenuItem value={credD} key={key} >{credD.value}</MenuItem>
                )})}
            </Select>
        </Grid>

        <Grid item container xs={12} justify='center'>
          <Grid item xs={12}>
            <Typography variant="h6">
              Select Recipient by Username
            </Typography>   
          </Grid> 
          <Grid item xs={12}>
              <FormControl variant="outlined" >
                <InputLabel htmlFor="did-helper">Username</InputLabel>
                  <Select
                    onChange={(event,index,value) => this.handleSelectValueChange(event,index,value)}
                  inputProps={{
                    name: 'name',
                    id: 'did-helper',
                  }}
                    name="Username"
                    value={this.state.recipientUsername}
                    renderValue={() => this.state.recipientUsername}
                  >
                  {
                    this.state.pairwiseConnectionsOptions.map(
                      (conn) => {
                        return(
                          <MenuItem key={conn["value"]} value={conn}>{conn["label"]}</MenuItem>
                        )
                      }
                    )
                  }
              </Select>
            <FormHelperText>Select recipient DID by username</FormHelperText>
          </FormControl>
          </Grid>
          <Grid item xs={6} >
          </Grid>
        </Grid>

        <Grid item container xs={12} justify='center'>
          <Grid item xs={12}>
            <Typography variant="h6">
              Attributes
            </Typography>   
          </Grid> 
          <Grid container spacing={4} justify='space-evenly' item xs={12}>

          {this.state.requested_attributes.map((attr, index) => {
                       return( this.currentAttribute(attr, index) )
                  })}  
          </Grid>
        </Grid>      
        <Grid container item xs={12} justify='center'>
          <Button variant="outlined" color="primary" style={style} onClick={(event) => this.sendProofRequestClick(event)}>
          Send proof request <SendIcon />
          </Button>
        </Grid>

      </Grid>
      <Grid item  xs={12} />
          <ProofTable />
      </Grid>
      </Box>
      </Container>
    </div>
      </div>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={this.state.snackbarOpen}
        autoHideDuration={6000}
        onClose={() => this.handleSnackbarClose()}
      >
        <SendProofSnackbarContentWrapper
          onClose={() => this.handleSnackbarClose()}
          variant={this.state.proofSendRes}
          message={this.state.proofSentMessage}
        />
      </Snackbar>
      </ThemeProvider>
    </div>
  )
}

}

const style = {
    margin: 15,
};
  
  export default withRouter(ProofScreen);