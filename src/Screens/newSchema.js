import React, { Component} from 'react';
/*
Screen:LoginScreen
Loginscreen is the main screen which the user is shown on first visit to page and after
hitting logout
*/
/*
Module:Material-UI
Material-UI is used for designing ui of the app
*/

import './../CSS/App.css';

import {withRouter, Link} from "react-router-dom";
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import axios from 'axios';
import IssuerBar from "./../components/IssuerBar";
import * as Constants from "./../Constants";
import * as Utils from "./../Utils";
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import ArrowBackRounded from '@material-ui/icons/ArrowBackRounded';
import {createMuiTheme,  makeStyles} from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container'
import Footer from "./../components/footer"


const apiBaseUrl = Constants.apiBaseUrl;


const useStyles = makeStyles(() => ({
  headline: {
    border: 0,
    fontSize: 24,
    borderRadius: 3,
    textAlign: 'center'
  },
  attributeList: {
    color:'#FFFFFF' , 
    textAlign:'center', 
    marginTop: '30px',
    marginBottom: '30px',
  },
}));

function NewSchema(props) {
  const classes = useStyles();
  // selected = the selected shema from the Schema Screen 
  let selected = (props.this.props.location.state.selected);
  return (
   
    <div className="grid">
      <Container maxWidth='false'className="tableContainer">       
        <Box >
          <Grid container   
            direction="row"
            justify='space-evenly'
            spacing={4}
            xs={12} 
            style={{margin:"auto"}}>
                        <Grid item xs={12}>
                          <Box position='relative'>
                            <Box position="absolute" top={0} left={0}>
                              <Link  to={"schemas"}>
                                <ArrowBackRounded style={{color:'white'}} fontSize="large" />
                              </Link>
                            </Box>
                            <Typography variant="h5">
                                create new schema
                            </Typography>      
                            </Box>
                         </Grid>
                  <Grid item container xs={6}
                        justify='center'
                        component={Paper}>
                        <Grid item container xs={12} spacing={4}>
                        <Grid item container xs={12} justify='center'>
                          <Grid item xs={6}>
                              <TextField id="schemaNameInput" fullWidth 
                                hintText="Enter the name of the schema"
                                floatingLabelText="Schema name"
                                defaultValue={props.this.state.schema_name}
                                onChange={(event, newValue) => props.this.setState({ schema_name: newValue })}
                              />  
                          </Grid>
                        </Grid>
                        <Grid item container xs={12} justify='center'>
                          <Grid item xs={6}>
                            <TextField id="versionInput" fullWidth 
                              hintText="Enter the version of the schema"
                              floatingLabelText="Version"
                              defaultValue={props.this.state.schema_version}
                              onChange={(event, newValue) => props.this.setState({ schema_version: newValue })}
                            />
                          </Grid>
                        </Grid>
                        <Grid item container xs={12} justify='center'>
                          <Grid item xs={6}>
                            {props.this.addAttribute()}
                          </Grid>
                        </Grid>
                        <Grid item container xs={12} justify='center'>
                              <Grid container mt={20} spacing={4} justify='center' >
                                    {props.this.state.schema_attrNames.map((attr, index) => {
                                        return( props.this.currentAttribute(attr, index))
                                        })} 
                              </Grid>
                        </Grid>       
                  </Grid>
                  </Grid>
                  <Grid item container 
                        justify='center'
                        xs={12}>
                        <Button style={{color:'white'}} onClick={(event) => props.this.handleClickNewSchema(event)}>
                          Submit
                        </Button>
                  </Grid>
            </Grid>
        </Box>
  </Container>
  </div>
  );
}


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
    console.log(schema_payload)
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
          placeholder="new attribute name"
          onChange={
            (event) => 
            { 
              this.setState({ newAttrName: event.target.value})
            }
          }
      />
      <Button variant="contained" label="Add Atribute"  color='primary' onClick={(event) =>  {
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
   
      <Grid key={index} item>
        <Card>
          <Box position= 'relative' minWidth={100} minHeight={100}>
            <CardContent>
              <Typography variant="body2" color="textSecondary" >
                    {attr}
              </Typography>
            </CardContent>
            <Box position='absolute'  bottom={0} right={0}>
              <IconButton  color="secondary" 
                  onClick={() => {           
                    var schema_attrNames = this.state.schema_attrNames;
                    schema_attrNames.splice(index,1);
                    this.setState({ schema_attrNames: schema_attrNames})
              }}> 
                 <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </Card>
      </Grid>
    )}
    handleTabChange(newTab){
      this.props.onTabChange(newTab)
    }

  render() {
    return (
      <MuiThemeProvider>
        <div className='App'>
        <IssuerBar onTabChange={(newTab) => this.handleTabChange(newTab)} tabNr={this.props.tabNr}/>
          <NewSchema this={this}/>
          <Footer />
        </div>
      </MuiThemeProvider> 
    );
  }
}

export default withRouter(addASchemaScreen);

