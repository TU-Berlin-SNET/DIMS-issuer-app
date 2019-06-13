import React, { Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Loginscreen from './Loginscreen'
import { Link, withRouter } from "react-router-dom";
import './App.css';


class App extends Component {
  constructor(props){
    super(props);
    this.state={
      loginPage:[]
    }
  }
  componentWillMount(){
    var loginPage =[];
    loginPage.push(<Loginscreen parentContext={this}/>);
    this.setState({
                  loginPage:loginPage
                    })
  }
  render() {
    return (
      <div className="App">
        {this.state.loginPage}
      </div>
    );
  }
}
const style = {
  margin: 15,
};
export default withRouter(App);
