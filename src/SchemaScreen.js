import React, { Component, Children} from 'react';
import ReactDOM from 'react-dom';
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
import {blue500, red500, greenA200, grey100, white} from 'material-ui/styles/colors';
import { Link, withRouter, Redirect} from "react-router-dom";
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {List, ListItem} from 'material-ui/List'
import axios from 'axios';
import IssuerBar from './IssuerBar';
import * as Constants from "./Constants"
import * as Utils from "./Utils"
import CUSTOMPAGINATIONACTIONSTABLE from "./tablepagination.js"
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import DeleteIcon from '@material-ui/icons/Delete';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import KeyboardVoiceIcon from '@material-ui/icons/KeyboardVoice';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Save';


import { withStyles, ThemeProvider} from '@material-ui/styles';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import SearchIcon from '@material-ui/icons/Search';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper';
import { mt} from '@material-ui/system/spacing';
import { Typography } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import yellow from '@material-ui/core/colors/yellow';

const apiBaseUrl = Constants.apiBaseUrl;

/* const StyledButton = withStyles({
  root: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    borderRadius: 3,
    border: 0,
    color: 'white',
    height: 48,
    padding: '0 30px',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  },
  label: {
    textTransform: 'capitalize',
  },
})(Button);

function ClassesShorthand() {
  return <StyledButton>classes shorthand</StyledButton>;
}
*/



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
        let schemas = <CUSTOMPAGINATIONACTIONSTABLE schemas={response.data} showAttr={["name","version", "_id"]}/>
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



 addAttribute(){
  return(
    <Paper style={ {padding: '2px 4px', display: 'flex', alignItems: 'center'}}>
      <InputBase id="attributeNameInput" style={{    marginLeft: 8, flex: 1}}
          placeholder="Add new Attribute"
          onChange={
            (event) => 
            { 
              this.setState({ newAttrName: event.target.value})
            }
          }
      />
      <Button variant="contained" label="Add Atribute" color='primary' primary={true} onClick={(event) =>  {
        var schema_attrNames = this.state.schema_attrNames;
        schema_attrNames.push(this.state.newAttrName);
        this.setState({ schema_attrNames: schema_attrNames}

        );   document.getElementById('attributeNameInput').value=""}} >
        <AddIcon/>
        Add Atribute
      </Button>  
 
    </Paper>
  )}


  currentAttribute(attr, index){
    return(
        <Paper style={ {padding: '2px 4px', display: 'flex', alignItems: 'center'}}>
          <InputBase  style={{    marginLeft: 8, flex: 1}}
            hintText="attribute name"
            floatingLabelText={"Schema attribute " + (index + 1)}
            value={attr}
            onChange={(event) => { 
              var schema_attrNames = this.state.schema_attrNames;
              schema_attrNames.splice(index,1, event.target.value);
              this.setState({ schema_attrNames: schema_attrNames})
            }}/>
          <Button align='right' variant="contained" color="secondary" label="Delete"  primary={true} onClick={() => {           
            var schema_attrNames = this.state.schema_attrNames;
            schema_attrNames.splice(index,1);
            this.setState({ schema_attrNames: schema_attrNames})
            }} >
            <DeleteIcon/>
            DELETE
          </Button>
        </Paper>
    )}




  render() {
    return (
      <MuiThemeProvider >
        <IssuerBar/>
          <Box display='flex' padding='5' flexDirection='column'alignItems='center'>
            <Box mb={5} width="50%">

              <Box display='flex' flexDirection='column' color='white' width="50%" >
                <TextField  fullWidth 
                  hintText="Enter the name of the schema"
                  floatingLabelText="Schema name"
                  defaultValue={this.state.schema_name}
                  onChange={(event, newValue) => this.setState({ schema_name: newValue })}
                />  
                <TextField fullWidth 
                  hintText="Enter the version of the schema"
                  floatingLabelText="Version"
                  defaultValue={this.state.schema_version}
                  onChange={(event, newValue) => this.setState({ schema_version: newValue })}
                />
              </Box> 
              <Paper  style= {{ color:'#FFFFFF' , textAlign:'center', backgroundColor: '#61dafb', borderTopLeftRadius: '15px' , borderTopRightRadius: '15px'}}>
              Attributes
                <Box  style={{  backgroundColor: 'whitesmoke' , border: 'solid', borderColor: '#61dafb' }}>

                  {this.addAttribute()}
                  {this.state.schema_attrNames.map((attr, index) => {
                      return( this.currentAttribute(attr, index))
                      })} 
                </Box>
              </Paper> 
              <RaisedButton label="Submit" primary={true} m='auto' style={{ bottom:'-40px'}} onClick={(event) => this.handleClickNewSchema(event)} />
            </Box>
            <Box mt={5} width='50%' >
            <Paper  style= {{ textAlign:'center', backgroundColor: '#61dafb', borderTopLeftRadius: '15px' , borderTopRightRadius: '15px', color: 'white'}}>
              Schemas:
              {this.state.schemas}
          </Paper>
          </Box>
        </Box>
      </MuiThemeProvider> 
    );
  }
}
const style = {
  margin: 15,
};







export default withRouter(SchemaScreen);




