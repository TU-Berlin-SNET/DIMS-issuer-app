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
import IssuerBar from './IssuerBar';
import * as Constants from "./Constants"
import * as Utils from "./Utils"
const apiBaseUrl = Constants.apiBaseUrl;

//var apiBaseUrl = ""REPLACE"";
//var apiBaseUrl = ""REPLACE"";

/*
Module:superagent
superagent is used to handle post/get requests to server
*/
var request = require('superagent');

class SchemaScreen extends Component {
  constructor(props){
    super(props);
    Utils.checkLogin(this)
    /*this.state={
      schemas: [],
      schema_name: "Italian_ID_Card",
      schema_version: "1.0",
      schema_attrNames: ["Issuing municipality", "Last name", 
       "Given name", "Place of birth", "Date of birth" ,"Sex"
       ,"Number of birth registration","Height","Municipality of residence",
       "Address","Issuing date","Expiration date","Nationality","Fiscal code","Signature","Validity to travel"].map((elem) => elem.replace(/\s/g, "_"))
    }*/
    this.state={
      schemas: [],
      schema_name: "Proof_of_Income",
      schema_version: "0.5",
      newAttrName: "",
      schema_attrNames: 
      [
        "Bank", "Last name", 
        "First name", "Date of birth" ,
        "Month 1", "Income month 1","Balance month 1",
        "Month 2", "Income month 2","Balance month 2",
        "Month 3", "Income month 3","Balance month 3"
      ].map((elem) => elem.replace(/\s/g, "_"))
    }
  }

  async createSchema(event){
    var self = this;
    var headers = {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem("token") 
    }
    var schema_payload = { 
      "name": self.state.schema_name, 
      "version": self.state.schema_version, 
      "attrNames": self.state.schema_attrNames
    }
    await axios.post(apiBaseUrl + "indyschema", schema_payload, {headers: headers}).then(function (response) {
      console.log(response);
            console.log(response.status);
            if (response.status === 201) {
              alert("new schema sucessfully created!")
              self.listSchemas()
            }
    }).catch(function (error) {
      //alert(JSON.stringify(schema_payload))
      //alert(error);
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
      //alert(error);
      console.log(error);
    });
  }

  componentWillMount(){

  }

  componentDidMount(){
    this.listSchemas()
  }

  handleClickNewSchema(event){
    this.createSchema(event)
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
                hintText="Enter the name of the schema"
                floatingLabelText="Schema name"
                defaultValue={this.state.schema_name}
                onChange={(event, newValue) => this.setState({ schema_name: newValue })}
            />
            <br />
            <TextField
                hintText="Enter the version of the schema"
                floatingLabelText="Version"
                defaultValue={this.state.schema_version}
                onChange={(event, newValue) => this.setState({ shchema_version: newValue })}
            />
            <br />
            {this.state.schema_attrNames.map((attr, index) => {
              return(
              <div>
                <TextField hintText="Enter the attribute name"
                floatingLabelText={"Schema attribute " + (index + 1)}
                value={attr}
                onChange={(event, newValue) => { 
                  var schema_attrNames = this.state.schema_attrNames;
                  schema_attrNames.splice(index,1,newValue);
                  this.setState({ schema_attrNames: schema_attrNames})
                  }}/>
              <RaisedButton label="Delete" primary={true} style={style} onClick={() => { 
                    var schema_attrNames = this.state.schema_attrNames;
                    schema_attrNames.splice(index,1);
                    this.setState({ schema_attrNames: schema_attrNames})
                    alert(schema_attrNames)}} />
                    </div>)})} 
            <br />
            <TextField
                hintText="Add schema atribute"
                floatingLabelText="Attribute name"
                onChange={
                  (event, newValue) => 
                  { 
                    this.setState({ newAttrName: newValue})
                  }
                }
            />
            <RaisedButton label="Add attribute" primary={true} style={style} onClick={() => 
            {
              var schema_attrNames = this.state.schema_attrNames;
              schema_attrNames.push(this.state.newAttrName);
              this.setState({ schema_attrNames: schema_attrNames})
              alert(schema_attrNames)
            }} />
            <br />
            <RaisedButton label="Submit" primary={true} style={style} onClick={(event) => this.handleClickNewSchema(event)} />
        </div>
        <div>
          Schemas:
        {this.state.schemas}
        </div>
    </MuiThemeProvider>
      </div>
    );
  }
}

const style = {
  margin: 15,
};
export default withRouter(SchemaScreen);