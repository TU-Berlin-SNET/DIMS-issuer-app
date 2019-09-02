import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './Screens/App';
import * as serviceWorker from './serviceWorker';
import OnboardingScreen from './Screens/OnboardingScreen';
import SchemasScreen from './Screens/SchemasScreen';
import AddASchemaScreen from './Screens/addASchemaScreen';
import CredentialDefScreen from './Screens/CredentialDefScreen';
import CitizenScreen from './Screens/CitizenScreen';
import CredentialScreen from './Screens/CredentialScreen';
import ConnectionsScreen from './Screens/ConnectionsScreen';
import ProofScreen from './Screens/ProofScreen'
import User from './Screens/newUser'
import SendCredentialOffer from './Screens/sendCredentialOfferScreen'
import IssuerDB from './Screens/IssuerDBScreen'

import { Route,  BrowserRouter as Router } from 'react-router-dom';



import withRoot from './withRoot';
import PropTypes from 'prop-types';


class Index extends React.Component{

  state = {
    loggedIn: false,
    activeTab: 0,
  };
  
  static childContextTypes = {
    muiTheme: PropTypes.object
}
getChildContext() {
    return {
        muiTheme: this.props.theme
    }
  }

handleTabChange(newTab){
  this.setState({activeTab: newTab})
}

    render(){
        console.log(this)
        return(
          <Router>
            <Route exact path="/"  render={(props)=> <App {...props} onTabChange={(selected) => this.handleTabChange(selected)} tabNr={this.state.activeTab} loggedIn = {this.state.loggedIn} />}  />
            <Route exact path="/newCitizen" render={(props)=> <User {...props} onTabChange={(selected) => this.handleTabChange(selected)} tabNr={this.state.activeTab}  loggedIn = {this.state.loggedIn} />} />
            <Route path="/citizen" render={(props)=> <CitizenScreen {...props} onTabChange={(selected) => this.handleTabChange(selected)} tabNr={this.state.activeTab}  loggedIn = {this.state.loggedIn} />} />
            <Route path="/onboarding" render={(props)=> <OnboardingScreen {...props} onTabChange={(selected) => this.handleTabChange(selected)} tabNr={this.state.activeTab}  loggedIn = {this.state.loggedIn} />} />
            <Route path="/connections" render={(props)=> <ConnectionsScreen {...props} onTabChange={(selected) => this.handleTabChange(selected)} tabNr={this.state.activeTab}  loggedIn = {this.state.loggedIn} />} />
            <Route path="/credentialdef" render={(props)=> <CredentialDefScreen {...props} onTabChange={(selected) => this.handleTabChange(selected)} tabNr={this.state.activeTab}  loggedIn = {this.state.loggedIn} />} />
            <Route path="/schemas" render={(props)=> <SchemasScreen {...props} onTabChange={(selected) => this.handleTabChange(selected)} tabNr={this.state.activeTab}  loggedIn = {this.state.loggedIn} />} />
            <Route path="/addASchema"render={(props)=> <AddASchemaScreen {...props} onTabChange={(selected) => this.handleTabChange(selected)}  tabNr={this.state.activeTab} loggedIn = {this.state.loggedIn} />} />
            <Route path="/credential" render={(props)=> <CredentialScreen {...props} onTabChange={(selected) => this.handleTabChange(selected)}  tabNr={this.state.activeTab} loggedIn = {this.state.loggedIn} />} />
            <Route exact path="/sendCredOffer"  render={(props)=> <SendCredentialOffer {...props} onTabChange={(selected) => this.handleTabChange(selected)} tabNr={this.state.activeTab} loggedIn = {this.state.loggedIn} />}  />
            <Route path="/proofs" render={(props)=> <ProofScreen {...props} onTabChange={(selected) => this.handleTabChange(selected)} tabNr={this.state.activeTab}  loggedIn = {this.state.loggedIn} />} />
            <Route path="/issuerDB" render={(props)=> <IssuerDB {...props} onTabChange={(selected) => this.handleTabChange(selected)} tabNr={this.state.activeTab}  loggedIn = {this.state.loggedIn} />} />

          </Router>
        )
    }  
}

  export default withRoot((Index));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
