import React, { Component} from 'react';
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


import {white} from 'material-ui/styles/colors';
import {withRouter, Link} from "react-router-dom";
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import axios from 'axios';
import IssuerBar from "./../components/IssuerBar";
import * as Constants from "./../Constants";
import * as Utils from "./../Utils";
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import ArrowBackRounded from '@material-ui/icons/ArrowBackRounded';
import {createMuiTheme,  makeStyles} from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

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
    margin: '10vh',
  },
  newSchemaFormContent: {
    padding: '10px',
  },
  attributeList: {
    color:'#FFFFFF' , 
    textAlign:'center', 
    backgroundColor: 'rgb(0, 188, 212)', 
    marginTop: '30px',
    marginBottom: '30px',
  },
  grid:{
    width: '100%',
  },
}));

function NewSchema(props) {
  const classes = useStyles(theme1);
  // selected = the selected shema from the Schema Screen 
  let selected = (props.this.props.location.state.selected);
  console.log(selected);
  return (
   
    <div className={classes.grid}>
    <Grid item xs={12} sm={10} md={8} lg={6} xl={4} style={{margin:"auto"}}>
    <Paper className={classes.newSchemaForm}>
      <Box className={classes.headline} position="relative" >              
        <Typography variant="h6">
            Add Schema
        </Typography>
        <Box position="absolute" top={0} left={0}>
          <Link  to={"schemas"}>
            <ArrowBackRounded fontSize="large" />
          </Link>
        </Box>
        </Box>
      <Box className={classes.newSchemaFormContent} >

        <Grid item xs={8}>
          <TextField id="schemaNameInput" fullWidth 
            hintText="Enter the name of the schema"
            floatingLabelText="Schema name"
            defaultValue={props.this.state.schema_name}
            onChange={(event, newValue) => props.this.setState({ schema_name: newValue })}
          />  
          </Grid>
          <Grid item xs={8}>
          <TextField id="versionInput" fullWidth 
            hintText="Enter the version of the schema"
            floatingLabelText="Version"
            defaultValue={props.this.state.schema_version}
            onChange={(event, newValue) => props.this.setState({ schema_version: newValue })}
          />
        </Grid>
        <Paper className={classes.attributeList}>
        <Typography variant="subtitle1">
            Attributes
        </Typography>
          <Box >
            {props.this.addAttribute()}
            {props.this.state.schema_attrNames.map((attr, index) => {
                return( props.this.currentAttribute(attr, index))
                })} 
          </Box>
        </Paper>
    </Box> 
    <Button variant='contained' label="Submit"  style={{backgroundColor :'rgb(0, 188, 212)' , color:'white'}} onClick={(event) => props.this.handleClickNewSchema(event)} >
      Submit
    </Button>
  </Paper>
  </Grid>
  </div>
  );
}

//var apiBaseUrl = ""REPLACE"";
//var apiBaseUrl = ""REPLACE"";

/*
Module:superagent
superagent is used to handle post/get requests to server
*/
//var request = require('superagent');


class addASchemaScreen extends Component {
  constructor(props){
    super(props);
    Utils.checkLogin(this)

    this.state={
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
              self.setState({schema_attrNames: []});
              document.getElementById('schemaNameInput').value="";
              document.getElementById('versionInput').value=""
              self.props.history.push("/schemas");
            }
    }).catch(function (error) {
      //alert(JSON.stringify(schema_payload))
      //alert(error);
      console.log(error);
  });
  }
  

  componentWillMount(){
  }

  componentDidMount(){
    document.title = "issuer app"
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
      <Button variant="contained" label="Add Atribute"  style={{backgroundColor :'rgb(0, 188, 212)' , color:'white'}} onClick={(event) =>  {
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
        <Paper key={index} position="relative" style={ {marginTop: '10px', padding: '2px 4px', display: 'flex', alignItems: 'center'}}>
          <Box style={{    marginLeft: 8, flex: 1}}>
          {attr}
          </Box>
          <Button variant="contained" color="secondary" label="Delete"  onClick={() => {           
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
        <Box>
        <IssuerBar/>   
          <NewSchema this={this}/>
        </Box>
      </MuiThemeProvider> 
    );
  }
}

export default withRouter(addASchemaScreen);

