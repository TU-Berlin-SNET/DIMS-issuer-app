import React, { Component } from 'react';
/*
Screen:LoginScreen
Loginscreen is the main screen which the user is shown on first visit to page and after
hitting logout
*/
import './../App.css';
/*
Module:Material-UI
Material-UI is used for designing ui of the app
*/

import RaisedButton from 'material-ui/RaisedButton';
import {withRouter} from "react-router-dom";
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {List, ListItem} from 'material-ui/List'
import axios from 'axios';
import IssuerBar from "./../components/IssuerBar";
import * as Constants from "./../Constants";
import * as Utils from "./../Utils";

// var request = require('superagent');
const apiBaseUrl = Constants.apiBaseUrl;

//var apiBaseUrl = ""REPLACE"";
//var apiBaseUrl = ""REPLACE"";

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
      schemas: [],
      credDefs: [],
      schemaId: "Click on the schema to select ID",
      tag: "Add your tag",
      supportRevocation: false
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
  
  async listSchemas(){
    var self = this;
    var headers = {
      'Authorization': localStorage.getItem("token")
    }
    await axios.get(apiBaseUrl + "indyschema", {headers: headers}).then(function (response) {
      console.log(response);
      console.log(response.status);
      console.log(response.data);
      if (response.status === 200) {
        let schemas = response.data.map((schema) => {
          return(
            <div>
              <List onClick={() => self.setState({schemaId: schema.schemaId})}>
                <ListItem>
                {schema.name}
                </ListItem>
                <ListItem>
                {schema.version}
                </ListItem>
                <ListItem>
                {schema.schemaId}
                </ListItem>
                <ListItem>
                  Attribute Names:
                  <List>
                  {schema.attrNames.map((attr) => {return(<ListItem>{attr}</ListItem>)})}
                  </List>
                </ListItem>
              </List>
            </div>
          )
        }
        )
        self.setState({schemas: schemas})
      }
    }).catch(function (error) {
      //alert(error);
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
        let credDefs = response.data.map((credDef) => {
          return(
            <div>
              <List>
                <ListItem>
                {credDef.credDefId}
                <RaisedButton label="Issue credential" 
                primary={true} style={style} 
                onClick={() => self.handleGoToIssuingClick(credDef.credDefId)} 
                />
                </ListItem>
                <ListItem>
                {credDef.wallet}
                </ListItem>
                <ListItem>
                {credDef.data.ver}
                </ListItem>
                <ListItem>
                {credDef.data.schemaId}
                </ListItem>
                <ListItem>
                  Attributes:
                  <List>
                  {Object.keys(credDef.data.value.primary.r).map((key) => 
                    {return(<ListItem>{"key: " + key + " value: " + credDef.data.value.primary.r[key]}</ListItem>)})}
                  </List>
                </ListItem>
              </List>
            </div>
          )
        }
        )
        self.setState({credDefs: credDefs})
      }
    }).catch(function (error) {
      //alert(error);
      console.log(error);
    });
  }

  componentWillMount(){

  }

  componentDidMount(){
    document.title = "issuer app"
    this.listSchemas()
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

  render() {
    return (
      <div className="App">
      <MuiThemeProvider>
        <div>
          <IssuerBar />
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
        </div>
        <div>
          Schemas:
        {this.state.schemas}
        </div>
        <div>
          Credential Definitions:
        {this.state.credDefs}
        </div>
    </MuiThemeProvider>
      </div>
    );
  }
}

const style = {
  margin: 15,
};
export default withRouter(CredentialDefScreen);