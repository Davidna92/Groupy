import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import  Login  from './components/Auth/Login';
import  Signup  from './components/Auth/Signup';
import 'semantic-ui-css/semantic.min.css';


const Root = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={App}/>
      <Route path="/login" component={Login}/>
      <Route path="/signup" component={Signup}/>
    </Switch>
  </Router>
);


ReactDOM.render(<Root/>, document.getElementById('root'));
serviceWorker.unregister();
