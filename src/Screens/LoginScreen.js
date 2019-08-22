import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Button from '@material-ui/core/Button';
import {withRouter} from "react-router-dom";
import Login from './../Login';
import Register from './../Register';
import Box from '@material-ui/core/Box'

const style = {
  margin: 15,
};

class Loginscreen extends Component {
  constructor(props){
    super(props);
    this.handler = this.authHandler.bind(this)
    var loginButtons=[];
    loginButtons.push(
      <MuiThemeProvider>
      <Box position='absolute' left='0' right='0' top='50%' >
          <Button  variant = 'contained' color='primary'  onClick={(event) => this.handleClick(event,'issuer')}>Register as Issuer</Button>
    </Box>
    </MuiThemeProvider>
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
          <div>
             <Button label={"Login"} color='primary'  onClick={(event) => this.handleClick(event,userRole)}/>
         </div>
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
            <Button label={"Register as an Issuer"}  onClick={(event) => this.handleClick(event,'issuer')}/>
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
      <Box  position='relative' height='100vh' className="loginscreen" key="loginscreen">
          {this.state.loginscreen}
          <Box position='absolute' left= '0' right= '0' top='50%' >
          <Box mb='5vh'>{this.state.loginmessage}</Box>
          <Box>{this.state.loginButtons}</Box>
          </Box>
      </Box>
    );
  }
}


export default withRouter(Loginscreen);