import React, { Component } from 'react';
/*
Screen:LoginScreen
Loginscreen is the main screen which the user is shown on first visit to page and after
hitting logout
*/
import  './../CSS/App.css';

/*
Module:Material-UI
Material-UI is used for designing ui of the app
*/

import {withRouter} from "react-router-dom";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import axios from 'axios';
import IssuerBar from "./../components/IssuerBar";
import * as Constants from "./../Constants";
import * as Utils from "./../Utils";
import CUSTOMPAGINATIONACTIONSTABLE from "./../components/tablepagination.js"
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

// var request = require('superagent');
const apiBaseUrl = Constants.apiBaseUrl;

//var apiBaseUrl = ""REPLACE"";
//var apiBaseUrl = ""REPLACE"";


function CredentialDefTable(props) {
  return(
  <div className="grid">
    <Grid item xs={12} md={10} xl={8} style={{margin:"auto"}}>
        <Container className="tableContainer" >
        <Box position="relative" >
          <Typography  variant="h6">
            Credential Defintions 
          </Typography>
        </Box>
          {props.this.state.credDefs}
        </Container>
    </Grid>
  </div>
  );
}

class CredentialDefScreen extends Component {
/*
{
	"schemaId": "{{schema_id}}",
	"tag": "jesse-credential-def3",
	"supportRevocation": false
}
*/
  constructor(props){
    super(props);
    Utils.checkLogin(this)
    this.state={
      credDefs: <CUSTOMPAGINATIONACTIONSTABLE data={[]} />,
      schemaId: "Click on the schema to select ID",
      tag: "Add your tag",
      supportRevocation: false,
      selected: "",
    }
  }
  
  async createCredentialDef(event){
    var self = this;
    var headers = {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem("token") 
    }
    var credDef_payload = { 
      "schemaId": self.state.schemaId, 
      "tag": self.state.tag, 
      "supportRevocation": self.state.supportRevocation
    }
    await axios.post(apiBaseUrl + "credentialdef", credDef_payload, {headers: headers}).then(function (response) {
      console.log(response);
            console.log(response.status);
            if (response.status === 201) {
              alert("credential definition sucessfully created!")
              self.listCredDefs()
            }
    }).catch(function (error) {
      alert(JSON.stringify(credDef_payload))
      alert(error);
      console.log(error);
  });
  }
  
  handleGoToIssuingClick(credDefId){
    this.props.history.push({pathname: "/credential",state: {credDefId: credDefId}});
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
    let credDefs = <CUSTOMPAGINATIONACTIONSTABLE onEdit={(event, selected) => self.handleEdit(event, selected)} data={response.data} showAttr={["wallet", "credDefId", "data.ver"]}/>
        self.setState({credDefs: credDefs})
      }
    }).catch(function (error) {
      //alert(error);
      console.log(error);
    });
  }

  handleEdit(event, selected){ //Fuction 
    this.setState({ selected: selected}); 
 } 

  componentWillMount(){

  }

  componentDidMount(){
    document.title = "issuer app"
    this.listCredDefs()
  }

  handleClickNewSchema(event){
    this.createCredentialDef(event)
  }
  /*
  Function:handleCloseClick
  Parameters: event,index
  Usage:This fxn is used to remove file from filesPreview div
  if user clicks close icon adjacent to selected file
  */

 handleTabChange(newTab){
  this.props.onTabChange(newTab)
}


  render() {
    return (

      <MuiThemeProvider>
        <div className="App">
        <IssuerBar onTabChange={(newTab) => this.handleTabChange(newTab)} tabNr={this.props.tabNr}/>
          <CredentialDefTable this={this}/>
           {/* 
            <TextField
                hintText="Enter the schema id or click on the schema to select it"
                floatingLabelText="Schema id"
                value={this.state.schemaId}
                onChange={(event, newValue) => this.setState({ schemaId: newValue })}
            />
            <br />
            <TextField
                hintText="Enter the tag for the schema"
                floatingLabelText="Tag"
                value={this.state.tag}
                onChange={(event, newValue) => this.setState({ tag: newValue })}
            />
            <br />
              Revocation:
              <select value={this.state.supportRevocation} onChange={(event, newValue) => this.setState({ supportRevocation: JSON.parse(event.target.value) })}>
              <option value={true}>enabled</option>
              <option value={false}>disabled</option>
              </select>
            <br />
            <RaisedButton label="Submit" primary={true} style={style} onClick={(event) => this.handleClickNewSchema(event)} />

            */}
                     
        </div>


    </MuiThemeProvider>
    );
  }
}

const style = {
  margin: 15,
};
export default withRouter(CredentialDefScreen);