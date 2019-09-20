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
import Table from 'material-ui/Table/Table'
import TableBody from 'material-ui/Table/TableBody';
import TableCell from 'material-ui/Table';
import TableHead from 'material-ui/Table';
import TablePagination from 'material-ui/Table';
import TableRow from 'material-ui/Table/TableRow';
import TableSortLabel from 'material-ui/Table';
import CUSTOMPAGINATIONACTIONSTABLE from "./../components/tablepagination.js"

import Checkbox from 'material-ui/Checkbox';

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

class CredentialRequestTable extends Component {
  constructor(props){
    super(props);
    Utils.checkLogin(this)

    this.state={
      schema_name: "",
      schema_version: "",
      newAttrName: "",
      selectedCredReq: null,
      credReqsData: [],
      schema_attrNames: 
      [
      ].map((elem) => elem.replace(/\s/g, "_"))
    }
  }
  

  componentDidMount(){
    document.title = "issuer app"
    this.getCredentialRequests()
    this.timer = setInterval(() => {
      this.getCredentialRequests()
    }, 5000);
  }
  
  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = null;
  }

  /*
  Function:handleCloseClick
  Parameters: event,index
  Usage:This fxn is used to remove file from filesPreview div
  if user clicks close icon adjacent to selected file
  */


async getCredentialRequests(){
  var self = this;
  var headers = {
   'Content-Type': 'application/json',
   'Authorization': localStorage.getItem("token") 
  }
  await axios.get(apiBaseUrl + 'credentialrequest' , {headers: headers}).then(function (response) {
     console.log(response);
     console.log(response.status);
     if (response.status === 200) {
       let credReqsData = response.data.sort(Utils.compareDates).map((credReq) => {
         //const {credentialValues} = self.state;
         var credentialValues = {}
         credReq.meta.offer.key_correctness_proof.xr_cap.filter((elem => elem[0] !== "master_secret")).map((elem) => 
           {return credentialValues[elem[0]] = ""})
         let credReqData =
             {"recipientDID": credReq.recipientDid, 
             "senderDID": credReq.senderDid,
             "schemaId": credReq.meta.offer.schema_id, 
             "credDefId": credReq.message.message.cred_def_id,
             "requestId": credReq.id,
                 "attributes": credReq.meta.offer.key_correctness_proof.xr_cap.filter((elem => elem[0] !== "master_secret")).map((elem) => 
                   {return(elem[0])}),
              "createdAt": credReq.createdAt
                  };
         return(credReqData)
       })
       self.setState({credentialRequestsData: credReqsData})
     }
   }).catch(function (error) {
   console.log(error);
 })
}

 render(){
   return(<CUSTOMPAGINATIONACTIONSTABLE data={this.state.credReqsData} showAttr={["recipientDid","senderDID", "schemaId"]}/>)
 }
  
}

export default CredentialRequestTable;