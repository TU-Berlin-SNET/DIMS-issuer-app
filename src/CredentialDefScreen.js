import React, { Component } from 'react';
/*
Screen:LoginScreen
Loginscreen is the main screen which the user is shown on first visit to page and after
hitting logout
*/
import './App.css';
/*
Module:Material-UI
Material-UI is used for designing ui of the app
*/
import injectTapEventPlugin from 'react-tap-event-plugin';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import {blue500, red500, greenA200} from 'material-ui/styles/colors';
import { Link, withRouter, Redirect} from "react-router-dom";
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {List, ListItem} from 'material-ui/List'
import axios from 'axios';

var request = require('superagent');

var apiBaseUrl = ""REPLACE"";

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

    this.state={
      schemas: [],
      credDefs: [],
      schemaId: "UM8WENh7B5DsvQZfeMGp57:2:sample_schema:1.0",
      tag: "Martina-Italian-ID-card",
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
      "supportRevocation": false
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
              <List>
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
      alert(error);
      console.log(error);
    });
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
      alert(error);
      console.log(error);
    });
  }

  componentWillMount(){

  }

  componentDidMount(){
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
            <TextField
                hintText="Enter the id of the selected schema"
                floatingLabelText="Schema id"
                onChange={(event, newValue) => this.setState({ schemaId: newValue })}
            />
            <br />
            <TextField
                hintText="Enter the tag for the schema"
                floatingLabelText="Tag"
                onChange={(event, newValue) => this.setState({ tag: newValue })}
            />
            <br />
              <select value={this.state.supportRevocation} onChange={(event, newValue) => this.setState({ supportRevocation: newValue })}>
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