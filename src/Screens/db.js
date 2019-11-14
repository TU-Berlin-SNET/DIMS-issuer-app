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
import ProofRequestIcon from '@material-ui/icons/QuestionAnswer'
import Paper from '@material-ui/core/Paper';
import Footer from "./../components/footer";
import MessageIcon from '@material-ui/icons/Message';
import Avatar from '@material-ui/core/Avatar';
import AddIcon from '@material-ui/icons/Add';
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore'
import ConfirmDialog from './../components/confirm'
import Snackbar from './../components/customizedSnackbar'
import Checkbox from '@material-ui/core/Checkbox'


const mongoDBBaseUrl = Constants.mongoDBBaseUrl;
const apiBaseUrl = Constants.apiBaseUrl;
var role
var numOfEntries = 0




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
      models: {},
      modelName: "",
      confirmDialogOpen: false,
      confirmDialogTitle: "",
      confirmDialogMessage: "",
      displayRows: [true, false]
    }
  }
  else{
    this.state={
      db:  <CUSTOMPAGINATIONACTIONSTABLE data={[]} showAttr={[]}/>,
      selected: '',
      credReq: null,
      CheckIfNewPerson: false,
      models: {},
      modelName: "",
      snackbarOpen: false,
      snackbarMessage: "",
      snackbarVariant: "sent",
      confirmDialogOpen: false,
      confirmDialogTitle: "",
      confirmDialogMessage: "",
      displayRows: [true, false]

    }
  }
  }

  componentDidMount(){
    this.getModels()
    document.title = "DIMS"
    if(this.state.checkIfNewPerson === true){
      this.setState({snackbarVariant: "sent", snackbarOpen: true, snackbarMessage: "added new " + this.state.modelName+ " successfully"});
      this.forceUpdate()
    }
    if(this.state.justOnboarded === true){
      this.setState({snackbarVariant: "sent", snackbarOpen: true, snackbarMessage: "connection to " + this.state.modelName+ " established"});
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

  getModels(){
       role = localStorage.getItem('role')
      let self = this
      let headers = {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem("token") 
      }
       axios.get(mongoDBBaseUrl + "models/" + role, {headers}).then(function (response) {
              if (response.status === 200) {
                self.handleModelsLoaded(response.data)
              }
      }).catch(function (error) {
        console.log(error);
    })
  }


  handleModelsLoaded = (data) => {
    this.setState({
        models: data,
        modelName: Object.keys(data)[0]
    }, () => {
     this.getDB()
    })
}

handleNewModel = (modelName) => {
  this.setState({
    modelName
  }, () => { this.getDB()})
}


  nextModel(){
    var modelNames = Object.keys(this.state.models)
    if(modelNames.indexOf(this.state.modelName) < modelNames.length-1){
      return(
        <Grid  item  xs={4} >
          <Button style={{color:'white'}} onClick={() => this.handleNextModelClick()}> 
            <NavigateNextIcon />
          </Button>
        </Grid>
      )
    }
    else return( <Grid item xs={4} />)
}

  handleNextModelClick(){
    var modelNames = Object.keys(this.state.models)
    var nextModel = modelNames[modelNames.indexOf(this.state.modelName) +1]
    this.handleNewModel(nextModel)
  }


  prevModel(){
    if(this.state.models !== null){
    var modelNames = Object.keys(this.state.models)
    if(modelNames.indexOf(this.state.modelName) > 0){
      return(
        <Grid  item  xs={4} >
          <Button style={{color:'white'}} onClick={() => this.handlePrevModelClick()}> 
            <NavigateBeforeIcon />
          </Button>
        </Grid>
      )
    }
    else return( <Grid item xs={4} />)
  }
}

  handlePrevModelClick(){
    var modelNames = Object.keys(this.state.models)
    var prevModel = modelNames[modelNames.indexOf(this.state.modelName) - 1]
    this.handleNewModel(prevModel)
  }


 listPersons(){
  numOfEntries = 0 
  let showAttr

  if(role !== 'shop')
    showAttr=['id','photo', 'firstname', 'lastname']
  else 
    showAttr =['id','firstname', 'lastname']

   let self = this
  var headers = {
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem("token") 
  }
   axios.get(Constants.mongoDBBaseUrl + self.state.modelName, {headers}).then(function (response) {
    if (response.status === 200) {

     let  revealedData = response.data.filter((person) => 
       person.firstname !== " " && person.lastname !== " "
     )

     let hiddenData = response.data.filter((person) => 
        person.firstname === " " || person.lastname === " "
     )

     let hiddenAndRevealedData = response.data
     let lastAddedPerson = response.data[response.data.length-1]
     numOfEntries =  parseInt(lastAddedPerson.id, 10)
    let data

    let displayRows = self.state.displayRows.toString()

     switch(displayRows){
       case 'true,true': 
          data = hiddenAndRevealedData
          break; 
        case 'false,true': 
          data = hiddenData
          break;
        case 'true,false': 
          data = revealedData
          break;
        case 'false,false':
          data = []
          break;
        default:
          console.log(self.state.displayRows)
          data = revealedData
          break;
     }


      let persons = <CUSTOMPAGINATIONACTIONSTABLE 
      onEdit={(event, selected) => self.handleEdit(event, selected)} 
      onDoubleClick={(selected) => self.openPersonView(selected)}
      
      rowFunctions= {[
     { 
       rowFunction: function (selected){self.handleRemovePersonClick(selected)},
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
    },
    {
      rowFunction: function (selected){self.sendProofRequest(selected)},
      rowFunctionName: 'send ProofRequest',
      rowFunctionIcon: <ProofRequestIcon />,
    }
      ]}


      data={data.map(
        (person) => {
          if(person.hasOwnProperty('picture') && person.picture !== ""){
            let base64Img = person['picture']
            person['photo'] = <Grid container justify="center" alignItems="center">
                                  <Avatar src={base64Img}/>
                               </Grid>
          } else {
            person['photo'] = <Grid container justify="center" alignItems="center">
                                  <Avatar>Photo</Avatar>
                               </Grid>
          }
          return(person)
        }
      )} 
     showAttr={showAttr}
      />
      self.setState({db: persons})
    }
  }).catch(function (error) {
    console.log(error);
    var db = <CUSTOMPAGINATIONACTIONSTABLE 
                  data={[]}
                  showAttr={['id', 'first name', 'family name','photo']}
              />
    self.setState({db})
    self.forceUpdate()
  });
}

handleRemovePersonClick(){
  let modelName = this.state.modelName
  this.setState({confirmDialogOpen: true, confirmDialogMessage: "remove " + modelName.slice(0, modelName.length-1) + " from DB?"}, () => this.forceUpdate());
}


async removePerson(agree) {

  if(agree){
    let self = this
    let headers = {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem("token") 
    }

    await axios.delete(mongoDBBaseUrl + self.state.modelName + "/" + self.state.selected.id, {headers}).then(function (response) {
            if (response.status === 204) {
              self.setState({snackbarVariant: "sent", snackbarOpen: true, snackbarMessage: "removed " + self.state.modelName + " successfully"});
              self.forceUpdate()
              self.listPersons()
            }
    }).catch(function (error) {
      console.log(error);
  });
}

}


openPersonView(selected){
  //the photo field cannot be cloned
  delete selected['photo']
  this.props.history.push({
    pathname: '/person',
    state: { person: selected,
             modelName: this.state.modelName}
  })
}

editPerson(selected){
  delete selected['photo']
console.log(selected)
  this.props.history.push({
    pathname: '/newPerson',
    state: {            
      person: selected,
      modelName : this.state.modelName,
      updatePerson: true,
    }
  })
}

onboardPerson(selected){
  this.props.history.push({
    pathname: '/onboarding',
    state: { person_id: selected.id,
             person_firstname: selected.firstname,
             person_lastname: selected.lastname,
             person_did: selected.did,
             modelName: this.state.modelName
            }
  })
}

sendCredentialOffer(selected){
  this.props.history.push({
    pathname: '/sendCredOffer',
    state: { myDid: selected.did, person_id: selected.id, modelName: this.state.modelName}
  })
}

sendProofRequest(selected){
  this.props.history.push({
    pathname: '/proofs',
    state: { myDid: selected.did, person_id: selected.id, modelName: this.state.modelName}
  })
}

handleEdit(event, selected){ //Fuction 
  this.setState({ selected: selected}, () => this.forceUpdate()); 
} 

 handleTabChange(newTab){
  this.props.onTabChange(newTab)
}


newPerson(){
  if(role === 'government' || role === 'bank'){
    this.props.history.push({
      pathname: '/newPerson',
      state: {          
        modelName: this.state.modelName,
        updatePerson: false
      }
    })
  }
  else{
        
      var self = this;
      var headers = {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem("token") 
      }

      var payload = {
        id: numOfEntries +1,
        firstname: " ",
        lastname: " ",

      }

         axios.post(mongoDBBaseUrl + self.state.modelName , payload, {headers}).then(function (response) {
              if (response.status === 200) {

                self.props.history.push({
                  pathname: '/onboarding',
                  state: {          
                    person_id: numOfEntries + 1,
                    person_firstname: " ",
                    person_lastname: " ",
                    person_did:  undefined,
                    modelName: self.state.modelName
                  }
                })
              
         
              }
          }).catch(function (error) {
                  console.log(error);
          });
      }     
}

getDB(){
    this.listPersons() 
}

handleShowHiddenRowsChange(event){
  let displayRows =this.state.displayRows
  displayRows[1] = event.target.checked
  this.setState({displayRows}, () =>
    this.getDB()
  )
}

handleShowRevealedRowsChange(event){
  let displayRows =this.state.displayRows
  displayRows[0] = event.target.checked
  this.setState({displayRows}, () =>
    this.getDB()
  )
}

checkBoxesForFilterOptions(){
  if(role === 'shop'){
    return(
      <Grid item container xs={12}>
      <Grid item xs={8} />
      <Grid item xs={2} >
        show revealed data
        <Checkbox  
          style={{color: 'default'}}
          onChange={(event) => this.handleShowRevealedRowsChange(event)}
          style={{color:'#ffffff'}}
          checked={this.state.displayRows[0]}
          value={this.state.displayRows[0]}
        />
      </Grid>
      <Grid item xs={2} >
        show hidden data
        <Checkbox  
          style={{color: 'default'}}
          onChange={(event) => this.handleShowHiddenRowsChange(event)}
          style={{color:'#ffffff'}}
          checked={this.state.displayRows[1]}
          value={this.state.displayRows[1]}
        />
      </Grid>
    </Grid>
    )
  }
}



  render() {
    return (
      <MuiThemeProvider>
        <Box  className="App">
          <IssuerBar onTabChange={(newTab) => this.handleTabChange(newTab)} tabNr={this.props.tabNr} parentContext={this}/>
          <div className="grid">
            <Grid item xs={12} >
                <Container maxWidth={false} className="tableContainer">
                <Grid container   
                      item
                      direction="row"
                      justify='space-evenly'
                      spacing={4}
                      style={{margin:"auto"}}
                      xs={12}>
                    <Grid item container spacing={0} xs={12}>
                      <Grid item xs={1} />
                      <Grid container  item xs={10}>
                        {this.prevModel()}
                        <Grid item xs={4}>
                          <Typography variant="h5">
                            {this.state.modelName}
                          </Typography> 
                        </Grid>
                        {this.nextModel()}
                      </Grid>
                  <Grid item xs={1} position='relative'>
                    <Box position='absolute' right={16}>
                      <Button onClick={(event) => this.newPerson()}>
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
                  <Grid item xs={12}>
                            {this.state.db}
                  </Grid>
                </Grid>
                <Grid item xs={12} />
                 {this.checkBoxesForFilterOptions()}
                </Grid>
            
                </Container>
            </Grid>
          </div>
          <Snackbar message={this.state.snackbarMessage}
                  variant={this.state.snackbarVariant} 
                  snackbarOpen={this.state.snackbarOpen} 
                  closeSnackbar={() => this.setState({snackbarOpen: false})} 
        />
        <ConfirmDialog open={this.state.confirmDialogOpen}
                       title={this.state.confirmDialogTitle}
                       message={this.state.confirmDialogMessage}
                      
                       removePerson={(agree) => {this.setState({confirmDialogOpen: false}, 
                                                  () =>{
                                                    this.forceUpdate()
                                                    this.removePerson(agree)
                                                  } )}
                       }
        />
            <Footer />
        </Box>
      </MuiThemeProvider>
    );
  }
}

export default withRouter(DBScreen);