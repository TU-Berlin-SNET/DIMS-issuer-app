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
import { } from '@material-ui/core/styles';
import {createMuiTheme,  makeStyles} from '@material-ui/core/styles';
import { withStyles, ThemeProvider,  } from '@material-ui/styles';
import InputBase from '@material-ui/core/InputBase';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper';
import { Typography } from '@material-ui/core';
import { spacing } from '@material-ui/system';
import { positions } from '@material-ui/system';

const apiBaseUrl = Constants.apiBaseUrl;

const theme1 = createMuiTheme({
  palette: {
    primary:{
        main: 'rgb(0, 188, 212)',
     },
     secondary: {
       main: 'rgb(0, 188, 212)',
    }


    
},
});


const useStyles = makeStyles(theme1 => ({
  headline: {
    backgroundColor: 'rgb(0, 188, 212)',
    color: white,
    border: 0,
    fontSize: 24,
    borderRadius: 3,
    textAlign: 'center'
  },
  newSchemaForm: {
    width: "30%",
    margin: '10vh',
  },
  newSchemaFormContent: {
    padding: '10px',
  },
  editAttributes: {
    color:'#FFFFFF' , 
    textAlign:'center', 
    backgroundColor: 'rgb(0, 188, 212)', 
    marginTop: '30px',
    marginBottom: '30px',
  },
  SchemaTable: {
    marginBottom: "5vh",
    padding: "10px" , 
    width: "60%", 
    textAlign:'center',
    backgroundColor: 'rgb(0, 188, 212)', 
    borderTopLeftRadius: '15px' , 
    borderTopRightRadius: '15px',
    color: 'white',
  },
}));

function NewSchema(props) {
  const classes = useStyles(theme1);

  return (
    <ThemeProvider theme={theme1}>
    
    <Paper className={classes.newSchemaForm}>
      <Box fullWidth className={classes.headline}>Add a schema</Box>
      <Box className={classes.newSchemaFormContent} >
        <Box display='flex' flexDirection='column' width="50%" >
          <TextField  fullWidth 
            hintText="Enter the name of the schema"
            floatingLabelText="Schema name"
            defaultValue={props.this.state.schema_name}
            onChange={(event, newValue) => this.setState({ schema_name: newValue })}
          />  
          <TextField fullWidth 
            hintText="Enter the version of the schema"
            floatingLabelText="Version"
            defaultValue={props.this.state.schema_version}
            onChange={(event, newValue) => this.setState({ schema_version: newValue })}
          />
        </Box> 
        <Paper className={classes.editAttributes}>
        attributes
          <Box >
            {props.this.addAttribute()}
            {props.this.state.schema_attrNames.map((attr, index) => {
                return( props.this.currentAttribute(attr, index))
                })} 
          </Box>
        </Paper>
    </Box> 
    <RaisedButton label="Submit" primary={true} onClick={(event) => this.handleClickNewSchema(event)} />
  </Paper>
  </ThemeProvider>
  );
}

function SchemaTable(props) {
  const classes = useStyles();
  return(
  <Paper  className={classes.SchemaTable}>
  Schemas:
  {props.this.state.schemas}
  </Paper>
  );
}


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
      schemas: <CUSTOMPAGINATIONACTIONSTABLE schemas={[]} showAttr={["name","version", "schemaId"]}/>,
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
        let schemas = <CUSTOMPAGINATIONACTIONSTABLE schemas={response.data} showAttr={["name","version", "schemaId"]}/>
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
          placeholder="Add a new Attribute"
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
        <Paper position="relative" style={ {marginTop: '10px', padding: '2px 4px', display: 'flex', alignItems: 'center'}}>
          <Box style={{    marginLeft: 8, flex: 1}}>
          {attr}
          </Box>
          <Button variant="contained" color="secondary" label="Delete"  primary={true} onClick={() => {           
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
      <MuiThemeProvider>
        <IssuerBar/>   
        <Box display='flex' padding='5' flexDirection='column' alignItems='center'>
          <NewSchema this={this}/>
          <SchemaTable this={this}/>
        </Box>
      </MuiThemeProvider> 
    );
  }
}
const style = {
  margin: 15,
};







export default withRouter(SchemaScreen);




