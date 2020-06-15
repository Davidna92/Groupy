import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router, Route, Switch, withRouter } from "react-router-dom";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import "semantic-ui-css/semantic.min.css";
import firebase from "firebase/app";

class Root extends React.Component {
componentDidMount(){
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      // console.log(user);
      // setUser(user);
      this.props.history.push('/');
    }
  })
}



  render() {
    return (
        <Switch>
          <Route exact path="/" component={App} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
        </Switch>
    );
  }
}

const RootWithAuth = withRouter(Root);



ReactDOM.render(<Router><RootWithAuth /></Router>, document.getElementById("root"));
serviceWorker.unregister();
