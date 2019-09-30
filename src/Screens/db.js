import React, { Component } from 'react';

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
import Avatar from '@material-ui/core/Avatar';
import AddIcon from '@material-ui/icons/Add';
import Snackbar from './../components/customizedSnackbar'


const mongoDBBaseUrl = Constants.mongoDBBaseUrl;
const apiBaseUrl = Constants.apiBaseUrl;
const model = localStorage.getItem('model')



function DB(props) {
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
              {model[0].toUpperCase() +  model.slice(1)}
            </Typography> 
            </Grid>
          <Grid item xs={1} position='relative'>
            <Box position='absolute' right={16}>
              <Button onClick={(event) => props.this.newPerson()}>
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
                    {props.this.state.db}
          </Grid>
          <Grid item xs={12} />
          </Grid>
     
        </Container>
    </Grid>
  </div>
  );
}


class DBScreen extends Component {
  constructor(props){
    super(props);
    Utils.checkLogin(this)
    if( props.location.hasOwnProperty("state") && props.location.state !== undefined){
    this.state={
      db:  <CUSTOMPAGINATIONACTIONSTABLE data={[]} showAttr={[]}/>,
      selected: '',
      credReq: null,
      checkIfNewPerson:  props.location.state.hasOwnProperty("newEntry") ?  props.location.state.newEntry  : false, 
      justOnboarded: props.location.state.hasOwnProperty("justOnboarded") ? props.location.state.justOnboarded : false,
      justSentCredentialOffer: props.location.state.hasOwnProperty("justSentCredentialOffer") ? props.location.state.justSentCredentialOffer : false,
      justIssuedCredentials: props.location.state.hasOwnProperty("justIssuedCredentials") ? props.location.state.justIssuedCredentials : false,
      snackbarOpen: false,
      snackbarMessage: "",
      snackbarVariant: "sent",
      model: "",
    }
  }
  else{
    this.state={
      db:  <CUSTOMPAGINATIONACTIONSTABLE data={[]} showAttr={[]}/>,
      activeDB: 'Issuer DB',
      issuerDB : 'hallo',
      verifierDB : 'Tschüss',
      selected: '',
      credReq: null,
      CheckIfNewPerson: false,
      model: "",
    }
  }
  }

  componentDidMount(){
    console.log(model)
    this.getDB();
    document.title = "DIMS"
    
    if(this.state.checkIfNewPerson === true){
      this.setState({snackbarVariant: "sent", snackbarOpen: true, snackbarMessage: "added new " + model + " successfully"});
      this.forceUpdate()
    }
    if(this.state.justOnboarded === true){
      this.setState({snackbarVariant: "sent", snackbarOpen: true, snackbarMessage: "connection to " + model + " established"});
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

  }

 async  listPersons(){
   let self = this
  var headers = {
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem("token") 
  }
  await axios.get(Constants.mongoDBBaseUrl + model, {headers}).then(function (response) {
    console.log(response);
    if (response.status === 200) {
      let persons = <CUSTOMPAGINATIONACTIONSTABLE 
      onEdit={(event, selected) => self.handleEdit(event, selected)} 
      onDoubleClick={(selected) => self.openPersonView(selected)}
      
      rowFunctions= {[
     { 
       rowFunction: function (selected){self.removePerson(selected)},
      rowFunctionName : 'Delete',
      rowFunctionIcon : <DeleteIcon />
     },
    { 
      rowFunction: function(selected){self.editPerson(selected)},
      rowFunctionName: 'Edit',
      rowFunctionIcon: <EditIcon />,
    },
    {
      rowFunction: function (selected){self.onboardPerson(selected)},
      rowFunctionName: 'Onboard',
      rowFunctionIcon: <OnboardIcon />,
    },
    {
      rowFunction: function (selected){self.sendCredentialOffer(selected)},
      rowFunctionName: 'send credential offer',
      rowFunctionIcon: <CredentialIcon />,
    },
    {
      rowFunction: function (selected){self.openPersonView(selected)},
      rowFunctionName: 'send and view credentials',
      rowFunctionIcon: <MessageIcon />,
    }
      ]}

      data={response.data.map(
        (person) => {
          if(person.hasOwnProperty('picture') && person.picture !== ""){
            let base64Img = person['picture']
            person['photo'] = <Grid container justify="center" alignItems="center">
                                  <Avatar src={base64Img}/>
                               </Grid>
          } else {
            person['photo'] = <Grid container justify="center" alignItems="center">
                                  <Avatar>{person.firstName[0]}</Avatar>
                               </Grid>
          }
          person['first name'] = person.firstName
          person['family name'] = person.familyName
          return(person)
        }
      )} 
      showAttr={['id', 'first name', 'family name','photo']}/>
      self.setState({db: persons})
    }
  }).catch(function (error) {
    console.log(error);
  });
}

async removePerson(selected) {

  let self = this
  let headers = {
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem("token") 
  }

  await axios.delete(mongoDBBaseUrl + model + "/" + selected.id, {headers}).then(function (response) {
          if (response.status === 204) {
            self.setState({snackbarVariant: "sent", snackbarOpen: true, snackbarMessage: "removed " + model + " successfully"});
            self.forceUpdate()
            self.listPersons()
          }
  }).catch(function (error) {
    console.log(error);
});

}


openPersonView(selected){
  //the photo field cannot be cloned
  delete selected['photo']
  this.props.history.push({
    pathname: '/person',
    state: { person: selected}
  })
}

editPerson(selected){
  this.props.history.push({
    pathname: '/newPerson',
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

onboardPerson(selected){
  this.props.history.push({
    pathname: '/onboarding',
    state: { person_id: selected.id,
             person_firstName: selected.firstName,
             person_familyName: selected.familyName,
             person_did: selected.did }
  })
}

sendCredentialOffer(selected){
  this.props.history.push({
    pathname: '/sendCredOffer',
    state: { myDid: selected.did, person_id: selected.id, }
  })
}

handleEdit(event, selected){ //Fuction 
  this.setState({ selected: selected}); 
} 

 handleTabChange(newTab){
  this.props.onTabChange(newTab)
}


newPerson(){
  this.props.history.push({
    pathname: '/newPerson',
    state: {                
    }
  })
}

getDB(){
  console.log(localStorage.getItem('role'))

      this.listPersons()
  
}

  render() {
    return (
      <MuiThemeProvider>
        <Box  className="App">
          <IssuerBar onTabChange={(newTab) => this.handleTabChange(newTab)} tabNr={this.props.tabNr}/>
          <DB this={this} />
          <Snackbar message={this.state.snackbarMessage}
                  variant={this.state.snackbarVariant} 
                  snackbarOpen={this.state.snackbarOpen} 
                  closeSnackbar={() => this.setState({snackbarOpen: false})} 
        />
            <Footer />
        </Box>
      </MuiThemeProvider>
    );
  }
}

export default withRouter(DBScreen);