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

/*
Module:superagent
superagent is used to handle post/get requests to server
*/
var request = require('superagent');

var apiBaseUrl = ""REPLACE"";

class SchemaScreen extends Component {
  constructor(props){
    super(props);

    this.state={
      schemas: [],
      schema_name: "certificate_of_employment",
      schema_version: "1.0",
      schema_attrNames: ["Name@string", "Company@string", "Title@string", "Date@date", "Location@string" ,"Salary@string"]
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
      alert(JSON.stringify(schema_payload))
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
            <TextField
                hintText="Enter the name of the schema"
                floatingLabelText="Schema name"
                onChange={(event, newValue) => this.setState({ schema_name: newValue })}
            />
            <br />
            <TextField
                hintText="Enter the version of the schema"
                floatingLabelText="Version"
                onChange={(event, newValue) => this.setState({ shchema_version: newValue })}
            />
            <br />
            <TextField
                hintText="Enter the attributes of the schema"
                floatingLabelText="Schema attributes"
                onChange={(event, newValue) => this.setState({ schema_attrNames: JSON.parse(newValue) })}
            />
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