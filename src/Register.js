import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import axios from 'axios';
import Login from './Login';
import IssuerBar from "./components/IssuerBar";
import * as Constants from "./Constants"
import * as Utils from "./Utils"

const apiBaseUrl = Constants.apiBaseUrl;

//var apiBaseUrl = ""REPLACE"";
//var apiBaseUrl = ""REPLACE"";

class Register extends Component {
  
  //Filled with test data
  constructor(props){
    super(props);
    this.state={
      username:'government1',
      password:'test123test',
      wallet_name: 'govt-wallet1',
      seed: Utils.generateSeed('0000000000000000000001Government'.length)
    }
  }
  componentWillReceiveProps(nextProps){
    console.log("nextProps",nextProps);
  }
  handleClick(event,role){
    
    // console.log("values in register handler",role);
    var self = this;
    //To be done:check for empty values before hitting submit
    if(this.state.username.length>0 && this.state.password.length>0 && this.state.wallet_name.length>0 && this.state.seed.length>0){
      var credentials= { "key" : "testkey" }
      var wallet = { 
        "name": this.state.wallet_name,
        "credentials": credentials,
        "seed": this.state.seed
      }
      var payload={
      "username": this.state.username,
      "password":this.state.password,
      "wallet": wallet
      }
      axios.post(apiBaseUrl+'/user', payload)
     .then(function (response) {
       console.log(response);
       if(response.status === 201){
        //  console.log("registration successfull");
         var loginscreen=[];
         loginscreen.push(<Login parentContext={this} appContext={self.props.appContext} />);
         var loginmessage = "Not Registered yet.Go to registration";
         self.props.parentContext.setState({loginscreen:loginscreen,
         loginmessage:loginmessage,
         buttonLabel:"Register",
         isLogin:true
          });
          self.props.history.push("/");
       }
       else{
         console.log("some error ocurred",response.data.code);
       }
     })
     .catch(function (error) {
       console.log(error);
     });
    }
    else{
      alert("Input field value is missing");
    }

  }
  render() {
    // console.log("props",this.props);
    return (
      <div>
        <MuiThemeProvider>
          <div>
           <TextField
             hintText="Enter your username"
             floatingLabelText="username"
             value={this.state.username}
             onChange = {(event,newValue) => this.setState({username:newValue})}
             />
           <br/>
           <TextField
             type = "password"
             hintText="Enter your Password"
             floatingLabelText="Password"
             value={this.state.password}
             onChange = {(event,newValue) => this.setState({password:newValue})}
             />
           <br/>
           <TextField
             hintText={"Wallet name"}
             floatingLabelText={"wallet name"}
             value={this.state.wallet_name}
             onChange = {(event,newValue) => this.setState({wallet_name:newValue})}
             />
           <br/>
           <TextField
             hintText="Seed"
             floatingLabelText="Seed"
             value={this.state.seed}
             onChange = {(event,newValue) => this.setState({seed:newValue})}
             />
           <br/>
           <RaisedButton label="Submit" primary={true} style={style} onClick={(event) => this.handleClick(event,this.props.role)}/>
          </div>
         </MuiThemeProvider>
      </div>
    );
  }
}

const style = {
  margin: 15,
};

export default Register;