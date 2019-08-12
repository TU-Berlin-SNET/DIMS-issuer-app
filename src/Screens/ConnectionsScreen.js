import React, { Component } from 'react';
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

import RaisedButton from 'material-ui/RaisedButton';
import {withRouter} from "react-router-dom";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import axios from 'axios';
import IssuerBar from "./../components/IssuerBar";
import * as Constants from "./../Constants";
import * as Utils from "./../Utils";
import CUSTOMPAGINATIONACTIONSTABLE from "./../components/tablepagination.js"
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import {createMuiTheme,  makeStyles} from '@material-ui/core/styles';


const apiBaseUrl = Constants.apiBaseUrl;

const useStyles = makeStyles(theme => ({
    ConnectionTable: {
      margin: '10vh',
      padding: "10px" , 
      textAlign:'center',
      backgroundColor: 'rgb(0, 188, 212)', 
      borderTopLeftRadius: '15px' , 
      borderTopRightRadius: '15px',
      color: 'white',
    },
    grid:{
      width: '100%',
    },
  }));

function SchemaTable(props) {
    const classes = useStyles();
    return(
        <div className={classes.grid}>
        <Grid item xs={12} md={10} xl={8} style={{margin:"auto"}}>
            <Paper  className={classes.ConnectionTable}>
            <Box position="relative" >
                <Typography  variant="h6">
                Pairwise Connections
                </Typography>
            </Box>
            {props.this.state.pairwiseConnections}
            </Paper>
        </Grid>
        </div>
    );
}
        

//var apiBaseUrl = ""REPLACE"";
//var apiBaseUrl = ""REPLACE"";

class ConnectionScreen extends Component {

    constructor(props){
        super(props);
        Utils.checkLogin(this)
        this.state={
          selectedRecipientDid: "",
          pairwiseConnections: [],
          selected: ""
        }
      }

    /*
{
        "my_did": "SRo7SD6Xr9WxL7pw82tByD",
        "their_did": "JrzrHXfRd56n4uNXMh7myT",
        "metadata": {
            "theirEndpointDid": "N9gtWsma4FW3o2yHSrL2xW",
            "theirEndpointVk": "CXb21LEVwq5Z1LABZUfnv6ESXyirmEWJV8MZvw3CmNgW",
            "theirEndpoint": "http://172.16.0.100:8000/indy",
            "acknowledged": true
        }
    }
*/

    handleGoToIssuingClick(){
        this.props.history.push({pathname: "/credential",state: {recipientDid: this.state.fconole.their_did}});
    }


    componentDidMount(){
        document.title = "issuer app"
        this.listPairwiseConnections()
    }

    handleEdit(event, selected){ //Fuction 
      this.setState({ selected: selected}); 
   } 
   
    // GET wallet/default/connection
    async listPairwiseConnections(){
        var self = this;
        var headers = {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem("token")
        }
        /* not used??

        var payload = {
            'credentialRequestId': this.state.credentialRequestId,
            'values': this.state.credentialValues
        }

        */
       
        await axios.get(apiBaseUrl + "wallet/default/connection", {headers: headers}).then(function(response){
            if (response.status === 200) {

            let data= []
                let selected;
              let pairwiseConnections = <CUSTOMPAGINATIONACTIONSTABLE onEdit={(event, selected) => self.handleEdit(event, selected)} data={data} showAttr={["theirUsername","their_did", "theirEndpointDid"]}/>
              response.data.map((conn) => {
                  data.push(
                    {
                        "my_did": conn.my_did, 
                        "their_did": conn.their_did, 
                        "theirEndpointDid": conn.metadata.theirEndpointDid,
                        "theirEndpointVk": conn.metadata.theirEndpointVk,
                        "theirEndpoint": conn.theirEndpoint,
                        "theirUsername": conn.metadata.username
                    }
                  )
              })
              self.setState({
                  pairwiseConnections: pairwiseConnections
              })
            }
          }).catch(function (error) {
          alert(error);
          console.log(error);
          });
    }
    
    render(){
      return(
        <div className="App">
        <MuiThemeProvider>
        <IssuerBar />
            <div>
                Selected recipient: {this.state.selected.their_did}
                <RaisedButton label="Issue credential" 
                primary={true} style={style} 
                onClick={() => this.handleGoToIssuingClick()} 
                />
            </div>
        <div>
        <SchemaTable this={this}/>




        </div>
        </MuiThemeProvider>
      </div>
      )   
    }

}

const style = {
    margin: 15,
};
  
  export default withRouter(ConnectionScreen);