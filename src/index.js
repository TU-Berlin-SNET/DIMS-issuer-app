import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import OnboardingScreen from './OnboardingScreen';
import SchemaScreen from './SchemaScreen';
import CredentialDefScreen from './CredentialDefScreen';
import LandingScreen from './LandingScreen';
import CredentialScreen from './CredentialScreen';
import ConnectionsScreen from './ConnectionsScreen';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';

const routing = (
    <Router>
      <div>
        <Route exact path="/" component={App} />
        <Route path="/home" component={LandingScreen} />
        <Route path="/onboarding" component={OnboardingScreen} />
        <Route path="/connections" component={ConnectionsScreen} />
        <Route path="/credentialdef" component={CredentialDefScreen} />
        <Route path="/schema" component={SchemaScreen} />
        <Route path="/credential" component={CredentialScreen} />
      </div>
    </Router>
  )
ReactDOM.render(routing, document.getElementById('root'))

//ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
