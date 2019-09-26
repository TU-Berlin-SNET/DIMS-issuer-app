import React, { Component } from 'react';
/*
Screen:LoginScreen
Loginscreen is the main screen which the user is shown on first visit to page and after
hitting logout
*/
import './../CSS/App.css';

/*
Module:Material-UIimport Snackbar from './../components/customizedSnackbar'

Material-UI is used for designing ui of the app
*/

import {withRouter, Link} from "react-router-dom";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IssuerBar from'./../components/IssuerBar';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import * as Utils from "./../Utils";
import CUSTOMPAGINATIONACTIONSTABLE from "./../components/tablepagination.js";
import axios from 'axios';
import * as Constants from "./../Constants";
import OnboardIcon from "@material-ui/icons/Work";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from '@material-ui/icons/Edit';
import CredentialIcon from '@material-ui/icons/Assignment';
import Paper from '@material-ui/core/Paper';
import Footer from "./../components/footer";
import MessageIcon from '@material-ui/icons/Message';
import SearchIcon from '@material-ui/icons/Message';
import Avatar from '@material-ui/core/Avatar';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AddIcon from '@material-ui/icons/Add';
import Snackbar from './../components/customizedSnackbar'


const mongoDBBaseUrl = Constants.mongoDBBaseUrl;
const apiBaseUrl = Constants.apiBaseUrl;



/*
Module:superagent
superagent is used to handle post/get requests to server
*/
// var request = require('superagent');

function CitizensTable(props) {
  return(
  <div className="grid">
    <Grid item xs={12}  style={{margin:"auto"}}>
        <Container maxWidth='false' className="tableContainer">
        <Grid container   
              direction="row"
              justify='space-evenly'
              spacing={4}
              xs={12} style={{margin:"auto"}}>
       <Grid item container spacing={0} xs={12}>
            <Grid item xs={1} />
            <Grid item xs={10}>
            <Typography variant="h5">
              Citizens
            </Typography> 
            </Grid>
          <Grid item xs={1} position='relative'>
            <Box position='absolute' right={16}>
              <Button onClick={(event) => props.this.newCitizen()}>
                <AddIcon style={{color:'white'}} fontSize="large" /> 
              </Button>
            </Box>
          </Grid> 
          
        </Grid>
      <Grid item xs={12} />
      <Grid item container xs={12}
        justify='center'
        component={Paper}
        spacing={8}
        >
                    {props.this.state.citizensTable}
          </Grid>
          <Grid item xs={12} />
          </Grid>
     
        </Container>
    </Grid>
    <Footer />
  </div>
  );
}


class CitizenScreen extends Component {
  constructor(props){
    super(props);
    Utils.checkLogin(this)
    if( props.location.hasOwnProperty("state") && props.location.state !== undefined){
    this.state={
      citizensData:[],
      citizensTable:  <CUSTOMPAGINATIONACTIONSTABLE data={[]} showAttr={[]}/>,
      selected: '',
      credReq: null,
      checkIfNewCitizen:  props.location.state.hasOwnProperty("newCitizen") ?  props.location.state.newCitizen  : false, 
      justOnboarded: props.location.state.hasOwnProperty("justOnboarded") ? props.location.state.justOnboarded : false,
      justSentCredentialOffer: props.location.state.hasOwnProperty("justSentCredentialOffer") ? props.location.state.justSentCredentialOffer : false,
      justIssuedCredentials: props.location.state.hasOwnProperty("justIssuedCredentials") ? props.location.state.justIssuedCredentials : false,
      snackbarOpen: false,
      snackbarMessage: "",
      snackbarVariant: "sent",
    }
  }
  else{
    this.state={
      citizensData:[],
      citizensTable:  <CUSTOMPAGINATIONACTIONSTABLE data={[]} showAttr={[]}/>,
      activeDB: 'Issuer DB',
      issuerDB : 'hallo',
      verifierDB : 'Tschüss',
      selected: '',
      credReq: null,
      CheckIfNewCitizen: false,
    }
  }
  }

  componentDidMount(){
    this.listCitizens();
    if(this.state.checkIfNewCitizen === true){
      this.setState({snackbarVariant: "sent", snackbarOpen: true, snackbarMessage: "added new citizen successfully"});
      this.forceUpdate()
    }
    if(this.state.justOnboarded === true){
      this.setState({snackbarVariant: "sent", snackbarOpen: true, snackbarMessage: "connection to citizen established"});
      this.forceUpdate()
    }
    if(this.state.justSentCredentialOffer === true){
      this.setState({snackbarVariant: "sent", snackbarOpen: true, snackbarMessage: "credential offer sent"});
      this.forceUpdate()
    }
    if(this.state.justIssuedCredentials === true){
      this.setState({snackbarVariant: "sent", snackbarOpen: true, snackbarMessage: "credentials sent"});
      this.forceUpdate()
    }
    document.title = "DIMS"
  }

 async  listCitizens(){
   let self = this
  var headers = {
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem("token") 
  }
  await axios.get(Constants.mongoDBBaseUrl + "citizens", {headers}).then(function (response) {
    console.log(response);
    if (response.status === 200) {
      let citizens = <CUSTOMPAGINATIONACTIONSTABLE 
      onEdit={(event, selected) => self.handleEdit(event, selected)} 
      onDoubleClick={(selected) => self.openCitizenView(selected)}
      
      rowFunctions= {[
     { 
       rowFunction: function (selected){self.removeCitizen(selected)},
      rowFunctionName : 'Delete',
      rowFunctionIcon : <DeleteIcon />
     },
    { 
      rowFunction: function(selected){self.editCitizen(selected)},
      rowFunctionName: 'Edit',
      rowFunctionIcon: <EditIcon />,
    },
    {
      rowFunction: function (selected){self.onboardCitizen(selected)},
      rowFunctionName: 'Onboard',
      rowFunctionIcon: <OnboardIcon />,
    },
    {
      rowFunction: function (selected){self.sendCredentialOffer(selected)},
      rowFunctionName: 'send credential offer',
      rowFunctionIcon: <CredentialIcon />,
    },
    {
      rowFunction: function (selected){self.openCitizenView(selected)},
      rowFunctionName: 'send and view credentials',
      rowFunctionIcon: <MessageIcon />,
    }
      ]}

      data={response.data.map(
        (citizen) => {
          if(citizen.hasOwnProperty('picture') && citizen.picture !== ""){
            let base64Img = citizen['picture']
            citizen['photo'] = <Grid container justify="center" alignItems="center">
                                  <Avatar src={base64Img}/>
                               </Grid>
          } else {
            citizen['photo'] = <Grid container justify="center" alignItems="center">
                                  <Avatar>{citizen.firstName[0]}</Avatar>
                               </Grid>
          }
          citizen['first name'] = citizen.firstName
          citizen['family name'] = citizen.familyName
          return(citizen)
        }
      )} 
      showAttr={['id', 'first name', 'family name','photo']}/>
      self.setState({citizensTable: citizens})
    }
  }).catch(function (error) {
    console.log(error);
  });
}

async removeCitizen(selected) {

  let self = this
  let headers = {
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem("token") 
  }

  await axios.delete(mongoDBBaseUrl + "citizens/" + selected.id, {headers}).then(function (response) {
          if (response.status === 204) {
            self.setState({snackbarVariant: "sent", snackbarOpen: true, snackbarMessage: "removed citizen successfully"});
            self.forceUpdate()
            self.listCitizens()
          }
  }).catch(function (error) {
    console.log(error);
});

}


openCitizenView(selected){
  //the photo field cannot be cloned
  delete selected['photo']
  this.props.history.push({
    pathname: '/citizen',
    state: { citizen: selected}
  })
}

editCitizen(selected){
  this.props.history.push({
    pathname: '/newCitizen',
    state: {            
      "id": selected.id,
      "familyName": selected.familyName,
      "firstName": selected.firstName,
      "dateOfBirth": selected.dateOfBirth,
      "placeOfBirth": selected.placeOfBirth,
      "address": selected.currentAddress,
      "gender": selected.gender,
      "legalId": selected.legalId,
      "legalName": selected.legalName,
      "legalAdress":selected.legalAdress,
      "vatRegistration": selected.vatRegistration,
      "taxReference": selected.taxReference,
      "lei": selected.lei,
      "eori": selected.eori,
      "seed": selected.seed,
      "sic": selected.sic,
    }
  })
}

onboardCitizen(selected){
  this.props.history.push({
    pathname: '/onboarding',
    state: { citizen_id: selected.id,
             citizen_firstName: selected.firstName,
             citizen_familyName: selected.familyName,
             citizen_did: selected.did }
  })
}

sendCredentialOffer(selected){
  this.props.history.push({
    pathname: '/sendCredOffer',
    state: { myDid: selected.did, citizen_id: selected.id, }
  })
}

handleEdit(event, selected){ //Fuction 
  this.setState({ selected: selected}); 
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

newCitizen(){
  this.props.history.push({
    pathname: '/newCitizen',
    state: {                
    }
  })
}

  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <IssuerBar onTabChange={(newTab) => this.handleTabChange(newTab)} tabNr={this.props.tabNr}/>
          <CitizensTable this={this} />
          <Snackbar message={this.state.snackbarMessage}
                  variant={this.state.snackbarVariant} 
                  snackbarOpen={this.state.snackbarOpen} 
                  closeSnackbar={() => this.setState({snackbarOpen: false})} 
        />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withRouter(CitizenScreen);