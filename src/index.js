import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import OnboardingScreen from './Screens/OnboardingScreen';
import SchemasScreen from './Screens/SchemasScreen';
import addASchemaScreen from './Screens/addASchemaScreen';
import CredentialDefScreen from './Screens/CredentialDefScreen';
import LandingScreen from './Screens/LandingScreen';
import CredentialScreen from './Screens/CredentialScreen';
import ConnectionsScreen from './Screens/ConnectionsScreen';
import ProofScreen from './Screens/ProofScreen'
import { Route,  BrowserRouter as Router } from 'react-router-dom';

const routing = (
    <Router>
      <div>
        <Route exact path="/" component={App} />
        <Route path="/home" component={LandingScreen} />
        <Route path="/onboarding" component={OnboardingScreen} />
        <Route path="/connections" component={ConnectionsScreen} />
        <Route path="/credentialdef" component={CredentialDefScreen} />
        <Route path="/schemas" component={SchemasScreen} />
        <Route path="/addASchema" component={addASchemaScreen} />
        <Route path="/credential" component={CredentialScreen} />
        <Route path="/proofs" component={ProofScreen} />
      </div>
    </Router>
  )
ReactDOM.render(routing, document.getElementById('root'))

//ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
