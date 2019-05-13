import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';

import { Link, withRouter, Redirect} from "react-router-dom";

import Login from './Login';
import Register from './Register';

const style = {
  margin: 15,
};

class Loginscreen extends Component {
  constructor(props){
    super(props);
    this.handler = this.authHandler.bind(this)
    var loginButtons=[];
    loginButtons.push(
      <div>
       <MuiThemeProvider>
       <div>
          <RaisedButton label={"Register as Issuer"} primary={true} style={style} onClick={(event) => this.handleClick(event,'issuer')}/>
      </div>
      </MuiThemeProvider>
      </div>
    )
    this.state={
      username:'',
      password:'',
      loginscreen:[],
      loginmessage:'',
      loginButtons:loginButtons,
      issuerbuttonLabel:'Register as an Issuer',
      isLogin:true
    }
  }

  authHandler() {
    this.setState({
      loginPage:[],
      loginscreen:[],
      isLogin: false,
      loginButtons: [],
      loginmessage:''
    })
  }

  componentWillMount(){
    var loginscreen=[];
    loginscreen.push(<Login parentContext={this} appContext={this.props.appContext } handler={this.handler}/>);
    var loginmessage = "Not registered yet? Register Now!";
    this.setState({
                  loginscreen:loginscreen,
                  loginmessage:loginmessage
                    })
  }
  handleClick(event,userRole){
    console.log("event",userRole);
    var loginmessage;
    if(this.state.isLogin){
      let loginscreen=[];
      loginscreen.push(<Register parentContext={this} appContext={this.props.appContext} />);
      loginmessage = "Already registered? Go to Login:";
      let loginButtons=[];
      loginButtons.push(
        <div key="login-button">
        <MuiThemeProvider>
          <div>
             <RaisedButton label={"Login"} primary={true} style={style} onClick={(event) => this.handleClick(event,userRole)}/>
         </div>
         </MuiThemeProvider>
        </div>
      )
      this.setState({
                     loginscreen:loginscreen,
                     loginmessage:loginmessage,
                     loginButtons:loginButtons,
                     isLogin:false
                   })
    }
    else{
      let loginscreen=[],loginButtons=[];
      loginButtons.push(
        <div>
         <MuiThemeProvider>
         <div>
            <RaisedButton label={"Register as an Issuer"} primary={true} style={style} onClick={(event) => this.handleClick(event,'issuer')}/>
        </div>
        </MuiThemeProvider>
        </div>
      )
      loginscreen.push(<Login parentContext={this} appContext={this.props.appContext} />);
      loginmessage = "Not Registered yet? Go to registration!";
      this.setState({
                     loginscreen:loginscreen,
                     loginmessage:loginmessage,
                     loginButtons:loginButtons,
                     isLogin:true
                   })
    }
  }
  render() {
    return (
      <div className="loginscreen" key="loginscreen">
        {this.state.loginscreen}
        <div>
          {this.state.loginmessage}
          {this.state.loginButtons}
        </div>
      </div>
    );
  }
}


export default withRouter(Loginscreen);