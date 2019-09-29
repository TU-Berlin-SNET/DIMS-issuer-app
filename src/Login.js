import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import axios from 'axios';
import {withRouter} from "react-router-dom";
import * as Constants from "./Constants"
import RadioButtons from './components/radioButtons'

import Box from '@material-ui/core/Box'



const apiBaseUrl = Constants.apiBaseUrl;


//var apiBaseUrl = ""REPLACE"";
//var apiBaseUrl = ""REPLACE"";

function LoginForm(props) {

    return(
        <Box position='absolute'  left='0' right='0' bottom='50%'>           
        <Box>
     <TextField
         hintText="Enter your Username"
         floatingLabelText="Username"
         onChange={(event, newValue) => props.this.setState({ username: newValue })}
     />
     </Box>
     <Box>
     <TextField
         type="password"
         hintText="Enter your Password"
         floatingLabelText="Password"
         onChange={(event, newValue) => props.this.setState({ password: newValue })}
     />
     </Box>
     <RadioButtons roleChanged={(role) => {props.this.setRole(role)}} />
     <RaisedButton label="Submit"  onClick={(event) => props.this.handleLoginClick(event)} />
     </Box>
    );
  }
  


class Login extends Component {
    constructor(props) {
        super(props);
        
        var localloginComponent=[];
        this.state = {
            username: '',
            password: '',
            loginComponent:localloginComponent,
            draweropen: false
        }
}
handleDrawerOpen = () => {
        this.setState({ draweropen: true });
};
    
handleDrawerClose = () => {
        this.setState({ draweropen: false });
};

componentDidMount(){
    document.title = "issuer app"
            localStorage.setItem('model', 'citizens')
  }

setRole(role){
    localStorage.setItem('role', role)

    switch(role){
     case 'government' :
         localStorage.setItem('model', 'citizens')
         break;
    case 'bank' :
        localStorage.setItem('model', 'bankCustomers')
        break;
    default:
         case 'government' :
         localStorage.setItem('model', 'citizens')
         break;


}
console.log(localStorage.getItem('model'))
}
    handleLoginClick(event) {
        var self = this;
        var payload = {
            "username": this.state.username,
            "password": this.state.password
        }
        axios.post(apiBaseUrl + 'login', payload)
            .then(function (response) {
                console.log(response);
                console.log(response.status);
                if (response.status === 200) {
                    console.log("Login successfull");
                    console.log(response.data.token);
                    //var issuerScreen = [];
                    //issuerScreen.push(<IssuerScreen appContext={self.props.appContext} />)
                    //self.props.appContext.setState({ loginPage: [], issuerScreen: issuerScreen })
                    localStorage.setItem('token', response.data.token)
                    self.props.history.push("/db");


                }
                else if (response.status === 204) {
                    console.log("Username password do not match");
                    alert("username password do not match")
                }
                else {
                    console.log("Username does not exists");
                    alert("Username does not exist");
                }
            })
            .catch(function (error) {
                alert(error);
                console.log(error);
            });
    }
    render() {
        return (
            <MuiThemeProvider >       
                <LoginForm this={this}/>
            </MuiThemeProvider> 

    
        );
    }
}
const style = {
    margin: 15,
};
export default withRouter(Login);