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
import {blue500, red500, greenA200, grey100} from 'material-ui/styles/colors';
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
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import DeleteIcon from '@material-ui/icons/Delete';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import KeyboardVoiceIcon from '@material-ui/icons/KeyboardVoice';
import Icon from '@material-ui/core/Icon';
import SaveIcon from '@material-ui/icons/Save';

import IconButton from '@material-ui/core/IconButton';

import { makeStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import SearchIcon from '@material-ui/icons/Search';


import Paper from '@material-ui/core/Paper';
const apiBaseUrl = Constants.apiBaseUrl;



//var apiBaseUrl = ""REPLACE"";
//var apiBaseUrl = ""REPLACE"";

/*
Module:superagent
superagent is used to handle post/get requests to server
*/
var request = require('superagent');

const useStyles = makeStyles({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4,
  },
});


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
        let schemas = <CUSTOMPAGINATIONACTIONSTABLE schemas={response.data}/>
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
      <Paper style={ {padding: '2px 4px', display: 'flex', alignItems: 'center', width: '400'}}>
          <InputBase style={{    marginLeft: 8, flex: 1}}
              placeholder="Add new Attribute"
              onChange={
                (event) => 
                { 
                  this.setState({ newAttrName: event.target.value})
                }
              }
          />
         <RaisedButton label="Add attribute" primary={true} onClick={() => 
          {
            var schema_attrNames = this.state.schema_attrNames;
            schema_attrNames.push(this.state.newAttrName);
            this.setState({ schema_attrNames: schema_attrNames})
            alert(schema_attrNames)
          }} />
      </Paper>
  )}


  currentAttribute(attr, index){
    return(
        <Paper style={ {padding: '2px 4px', display: 'flex', alignItems: 'center', width: '400'}}>
              <InputBase  style={{    marginLeft: 8, flex: 1}}
              hintText="attribute name"
              floatingLabelText={"Schema attribute " + (index + 1)}
              value={attr}
              onChange={(event, newValue) => { 
                var schema_attrNames = this.state.schema_attrNames;
                schema_attrNames.splice(index,1,newValue);
                this.setState({ schema_attrNames: schema_attrNames})
                }}/>
         <Button  variant="contained" color="secondary" label="Delete"  primary={true} onClick={() => { 
           
                  var schema_attrNames = this.state.schema_attrNames;
                  schema_attrNames.splice(index,1);
                  this.setState({ schema_attrNames: schema_attrNames})
                  alert(schema_attrNames)}} >
                  <DeleteIcon/>
                  DELETE
                  </Button>
        </Paper>
    )}



 toGrid() {
  return (
    <MuiThemeProvider>
         <IssuerBar/>

    <Container  className='container'  style={{style, position:'relative', gridColumnStart: '1', gridColumnEnd: '13' }}>


        <div style={{  gridColumnStart: '3', gridColumnEnd: '11' }}>
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
        <div style= {{backgroundColor: '#61dafb', gridColumn: '5/8', marginTop: '3vh', borderTopLeftRadius: '15px' , borderTopRightRadius: '15px', color: 'white'}}>Attributes</div> 
         <div  style={{position: 'relative' , backgroundColor: 'whitesmoke' , border: 'solid', borderColor: '#61dafb',   gridColumnStart: '3', gridColumnEnd: '11' }}>
         
         {this.addAttribute()}

         {this.state.schema_attrNames.map((attr, index) => {
            return( this.currentAttribute(attr, index))
            })} 
            <RaisedButton label="Submit" primary={true} style={{position: 'absolute', right: '0', bottom: '-50px' ,gridColumnStart: '6', gridColumnEnd: '7' }} onClick={(event) => this.handleClickNewSchema(event)} />
        </div>
        <div style= {{position: 'relative', top: '150px' ,gridColumn: '4/9', backgroundColor: '#61dafb', left: '0', right:'0', margin:'auto', borderTopLeftRadius: '15px' , borderTopRightRadius: '15px', color: 'white'}}>
            Schemas:
            {this.state.schemas}
         </div>
      </Container>

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




