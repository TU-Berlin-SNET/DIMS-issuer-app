import React, { Component} from 'react';
/*
Screen:LoginScreen
Loginscreen is the main screen which the user is shown on first visit to page and after
hitting logout
*/
import './../CSS/App.css';
/*
Module:Material-UI
Material-UI is used for designing ui of the app
*/

import {withRouter, Link} from "react-router-dom";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import axios from 'axios';
import IssuerBar from "./../components/IssuerBar";
import * as Constants from "./../Constants";
import * as Utils from "./../Utils";
import CUSTOMPAGINATIONACTIONSTABLE from "./../components/tablepagination.js"
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

const apiBaseUrl = Constants.apiBaseUrl;


function SchemaTable(props) {
  return(
  <div className="grid">
    <Grid item xs={12} md={10} xl={8} style={{margin:"auto"}}>
        <Container className="tableContainer">
        <Box position="relative" >
          <Typography  variant="h6">
              Schemas
          </Typography>
          <Box position="absolute" top={0} right={0}>
            <Link  to={{
              pathname: "addASchema",
              state: {selected: props.this.state.selected, tabNr:props.this.props.tabNr},
              }}>
              <AddIcon fontSize="large" />
            </Link>
          </Box>
        </Box>
          {props.this.state.schemas}
        </Container>
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


class SchemaScreen extends Component {
  constructor(props){
    super(props);
    Utils.checkLogin(this)

    this.state={
      schemas: <CUSTOMPAGINATIONACTIONSTABLE data={[]} showAttr={["name","version", "schemaId"]}/>,
      selected: "",
    }
  }

  
  async listSchemas(){
    var self = this;
    var headers = {
      'Authorization': localStorage.getItem("token")
    }
    await axios.get(apiBaseUrl + "indyschema", {headers: headers}).then(function (response) {
      if (response.status === 200) {
        let schemas = <CUSTOMPAGINATIONACTIONSTABLE onEdit={(event, selected) => self.handleEdit(event, selected)} data={response.data} showAttr={["name","version", "schemaId"]}/>
        self.setState({schemas: schemas});
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

  handleEdit(event, selected){ //Fuction 
    this.setState({ selected: selected}); 
 } 

 handleTabChange(newTab){

  this.props.onTabChange(newTab)
}
  render() {

    return (
      <MuiThemeProvider>
        <div className='App'>
        <IssuerBar onTabChange={(newTab) => this.handleTabChange(newTab)} tabNr={this.props.tabNr}/>
          <SchemaTable this={this}/>
        </div>
      </MuiThemeProvider> 
    );
  }
}

export default withRouter(SchemaScreen);


