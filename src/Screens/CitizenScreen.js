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
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IssuerBar from'./../components/IssuerBar'
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import * as Utils from "./../Utils";
import CUSTOMPAGINATIONACTIONSTABLE from "./../components/tablepagination.js"
import axios from 'axios';
import * as Constants from "./../Constants";
import OnboardIcon from "@material-ui/icons/Work"
import DeleteIcon from "@material-ui/icons/Delete"
import EditIcon from '@material-ui/icons/Edit'
import CredentialIcon from '@material-ui/icons/Assignment'
import Tooltip from '@material-ui/core/Tooltip';
import ConfirmDialog from './../components/confirm'

const mongoDBBaseUrl = Constants.mongoDBBaseUrl;



/*
Module:superagent
superagent is used to handle post/get requests to server
*/
// var request = require('superagent');

function CitizensTable(props) {
  return(
  <div className="grid">
    <Grid item xs={12} md={10} xl={8} style={{margin:"auto"}}>
        <Container className="tableContainer">
        <Box position="relative" >
          <Typography  variant="h6">
              Citizens
          </Typography>
        </Box>
          {props.this.state.citizensTable}
          <Box >
            
            <Button size='large' style={{color:'white'}}  onClick={(event)=> props.this.newCitizen()}>ADD NEW CITIZEN</Button> 
          </Box>
        </Container>
    </Grid>
  </div>
  );
}


class CitizenScreen extends Component {
  constructor(props){
    super(props);
    Utils.checkLogin(this)
    this.state={
      citizensData:[],
      citizensTable:  <CUSTOMPAGINATIONACTIONSTABLE data={[]} showAttr={[]}/>,
      activeDB: 'Issuer DB',
      issuerDB : 'hallo',
      verifierDB : 'Tschüss',
      selected: ''
    }
  }
  /*
  Function:handleCloseClick
  Parameters: event,index
  Usage:This fxn is used to remove file from filesPreview div
  if user clicks close icon adjacent to selected file
  */

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
      rowFunction: function (selected){self.sendCredentials(selected)},
      rowFunctionName: 'send credentials',
      rowFunctionIcon: <CredentialIcon />,
    }


      ]}

      data={response.data} 
      showAttr={["id", 'firstName', 'familyName']}/>

      self.setState({citizensTable: citizens})
      console.log(citizens)
    }
  }).catch(function (error) {
    //alert(error);
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
          if (response.status === 200) {
            alert("new Citizen sucessfully removed!")
          }
  }).catch(function (error) {
    //alert(JSON.stringify(schema_payload))
    //alert(error);
    console.log(error);
});

self.listCitizens()
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
    state: { citizen_id: selected.id }
  })
}

sendCredentials(selected){
  this.props.history.push({
    pathname: '/sendCredOffer',
    state: { my_did: selected.did }
  })
}



handleEdit(event, selected){ //Fuction 
  this.setState({ selected: selected}); 
} 

 componentDidMount(){
  this.listCitizens();
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
          <div className='grid'>
          <Box position = 'absolute'  top='10%' width='100%'>
          <Grid
            container
            direction="row"
            justify="space-evenly"
            alignItems="flex-start"
          >
            <Grid item>
              <Button id='issuerButton' color='secondary' variant='contained' onClick={(event)=> this.openIssuerDB(event)} >Issuer DB</Button> 
            </Grid>
            <Grid item>
              <Button id='verifierButton' color='primary' variant='contained' onClick={(event)=> this.openVerifierDB(event)}>Verifier DB</Button> 
            </Grid>
            </Grid>
          </Box>
          </div>
          <CitizensTable this={this} />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withRouter(CitizenScreen);