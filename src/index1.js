import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './Screens/App';
import * as serviceWorker from './serviceWorker';
import OnboardingScreen from './Screens/OnboardingScreen';
import SchemasScreen from './Screens/SchemasScreen';
import NewSchemaScreen from './Screens/newSchema';
import NewCredDef from './Screens/newCredDef';
import SendCredentials from './Screens/sendCredentials'
import CredentialDefScreen from './Screens/CredentialDefScreen';
import DBScreen from './Screens/db';
import PersonScreen from './Screens/person';
import ProofScreen from './Screens/ProofScreen'
import User from './Screens/newCitizen'
import SendCredentialOffer from './Screens/sendCredentialOfferScreen'
import AccountScreen from './Screens/account'
import Information from './Screens/information'
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
            <Route exact path="/"  render={(props)=> <App {...props} onTabChange={(selected) => this.handleTabChange(selected)} tabNr={this.state.activeTab}  />}  />
            <Route exact path="/sendCredentials"  render={(props)=> <SendCredentials {...props} onTabChange={(selected) => this.handleTabChange(selected)} tabNr={this.state.activeTab}  />}  />
            <Route path="/account" render={(props)=> <AccountScreen {...props} onTabChange={(selected) => this.handleTabChange(selected)} tabNr={this.state.activeTab}   />} />
            <Route exact path="/newPerson" render={(props)=> <User {...props} onTabChange={(selected) => this.handleTabChange(selected)} tabNr={this.state.activeTab}   />} />
            <Route path="/db" render={(props)=> <DBScreen {...props} onTabChange={(selected) => this.handleTabChange(selected)} tabNr={this.state.activeTab}   />} />
            <Route path="/person" render={(props)=> <PersonScreen {...props} onTabChange={(selected) => this.handleTabChange(selected)} tabNr={this.state.activeTab}   />} />
            <Route path="/onboarding" render={(props)=> <OnboardingScreen {...props} onTabChange={(selected) => this.handleTabChange(selected)} tabNr={this.state.activeTab}   />} />
            <Route path="/credentialdef" render={(props)=> <CredentialDefScreen {...props} onTabChange={(selected) => this.handleTabChange(selected)} tabNr={this.state.activeTab}   />} />
            <Route path="/newCredDef" render={(props)=> <NewCredDef {...props} onTabChange={(selected) => this.handleTabChange(selected)} tabNr={this.state.activeTab}   />} />
            <Route path="/schemas" render={(props)=> <SchemasScreen {...props} onTabChange={(selected) => this.handleTabChange(selected)} tabNr={this.state.activeTab}   />} />
            <Route path="/newSchema"render={(props)=> <NewSchemaScreen {...props} onTabChange={(selected) => this.handleTabChange(selected)}  tabNr={this.state.activeTab}  />} />
            <Route exact path="/sendCredOffer"  render={(props)=> <SendCredentialOffer {...props} onTabChange={(selected) => this.handleTabChange(selected)} tabNr={this.state.activeTab}  />}  />
            <Route path="/proofs" render={(props)=> <ProofScreen {...props} onTabChange={(selected) => this.handleTabChange(selected)} tabNr={this.state.activeTab}   />} />
            <Route path="/information" render={(props)=> <Information {...props} onTabChange={(selected) => this.handleTabChange(selected)} tabNr={this.state.activeTab}   />} />
          </Router>
        )
    }  
}

  export default withRoot((Index));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
