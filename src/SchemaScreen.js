import React, { Component} from 'react';

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
import { makeStyles } from '@material-ui/styles';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
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

    this.state={
      schemas: [],
      schema_name: "",
      schema_version: "",
      newAttrName: "",
      schema_attrNames: 
      [
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
    document.title = "issuer app"
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


 toGrid() {
  return (
    <MuiThemeProvider>
         <IssuerBar/>

    <div  className='container'  style={{ position:'relative', gridColumnStart: '1', gridColumnEnd: '13' }}>


        <div style={{position: 'relative',   gridColumnStart: '3', gridColumnEnd: '7' }}>
            <TextField  style={{display: 'block', gridColumnStart: '8', gridColumnEnd: '9' }}
                  hintText="Enter the name of the schema"
                  floatingLabelText="Schema name"
                  defaultValue={this.state.schema_name}
                  onChange={(event, newValue) => this.setState({ schema_name: newValue })}
              />
          
          <TextField  style={{display: 'block', gridColumnStart: '8', gridColumnEnd: '9' }}
                hintText="Enter the version of the schema"
                floatingLabelText="Version"
                defaultValue={this.state.schema_version}
                onChange={(event, newValue) => this.setState({ schema_version: newValue })}
            />
        </div>
        
         <div  style={{position: 'relative', border: 'solid', borderColor: '#61dafb',   gridColumnStart: '3', gridColumnEnd: '7' }}>
         Attribute
         {this.state.schema_attrNames.map((attr, index) => {
            return(
            <div>
              <TextField style={{gridColumnStart: '3', gridColumnEnd: '5' }}
              hintText="Enter the attribute name"
              floatingLabelText={"Schema attribute " + (index + 1)}
              value={attr}
              onChange={(event, newValue) => { 
                var schema_attrNames = this.state.schema_attrNames;
                schema_attrNames.splice(index,1,newValue);
                this.setState({ schema_attrNames: schema_attrNames})
                }}/>
              <RaisedButton  style={{style, gridColumnStart: '5', gridColumnEnd: '6' }} label="Delete" primary={true} onClick={() => { 
                  var schema_attrNames = this.state.schema_attrNames;
                  schema_attrNames.splice(index,1);
                  this.setState({ schema_attrNames: schema_attrNames})
                  alert(schema_attrNames)}} />
            </div>)})} 
            <RaisedButton label="Submit" primary={true} style={{style, position: 'absolute', right: '0', bottom: '-50px' ,gridColumnStart: '6', gridColumnEnd: '7' }} onClick={(event) => this.handleClickNewSchema(event)} />
          </div>
      
         <div style={{gridColumnStart: '8', gridColumnEnd: '13' }}>
          <TextField style={{display: 'block', gridColumnStart: '8', gridColumnEnd: '9' }}
              hintText="Add schema atribute"
              floatingLabelText="Attribute name"
              onChange={
                (event, newValue) => 
                { 
                  this.setState({ newAttrName: newValue})
                }
              }
          />
          <RaisedButton label="Add attribute" primary={true} style={{style, float:'left' , gridColumnStart: '8', gridColumnEnd: '9' }} onClick={() => 
          {
            var schema_attrNames = this.state.schema_attrNames;
            schema_attrNames.push(this.state.newAttrName);
            this.setState({ schema_attrNames: schema_attrNames})
            alert(schema_attrNames)
          }} />
        </div>

   {/*   
       <div style={{gridColumnStart: '3', gridColumnEnd: '8', position:'absolute', bottom:'-100px'}}>
            Schemas:
            {this.state.schemas}
         </div>
        */}
      </div>

</MuiThemeProvider>

  );
}
  render() {
    return (
      <div className="App"> {this.toGrid()}
      </div>
    );
  }
}

const style = {
  margin: 15,
};






export default withRouter(SchemaScreen);