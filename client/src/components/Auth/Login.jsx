import React from "react";
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import firebase from "../../firebase";

class Login extends React.Component {
  state = {
    email: "",
    password: "",
    errors: [],
    loading: false,
  };

  
  showErrors = (errors) =>
    errors.map((error, i) => <p key={i}>{error.message}</p>);

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      this.setState({ errors: [], loading: true });
      firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(signedInUser => {
          console.log(signedInUser);
      })
      .catch(err => {
          console.error(err);
          this.setState({ 
              errors: this.state.errors.concat(err),
              loading: false
          })
      })
    }
  };

  isFormValid = ({email, password}) => email && password;

  

  handleInputError = (errors, inputName) => {
    return errors.some((error) =>
      error.message.toLowerCase().includes(inputName)
    )
      ? "error"
      : "";
  };

  render() {
    const {
      email,
      password,
      errors,
      loading,
    } = this.state;

    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h1" icon color="blue" textAlign="center">
            <Icon name="handshake outline" color="blue" />
            Login to Groupy
          </Header>
          <Form size="small" onSubmit={this.handleSubmit}>
            <Segment stacked>
              
              <Form.Input
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email Address"
                onChange={this.handleChange}
                type="email"
                value={email}
                className={this.handleInputError(errors, "email")}
              />

              <Form.Input
                fluid
                name="password"
                icon="user secret"
                iconPosition="left"
                placeholder="Password"
                onChange={this.handleChange}
                type="password"
                value={password}
                className={this.handleInputError(errors, "password")}
              />
              <Button
                disabled={loading}
                className={loading ? "loading" : ""}
                color="blue"
                fluid
                size="medium"
              >
                Submit
              </Button>
            </Segment>
          </Form>
          {errors.length > 0 && (
            <Message color="red">
              <h3>Ops..</h3>
              {this.showErrors(errors)}
            </Message>
          )}
          <Message>
            New to groupy?<Link to="/signup"> Signup here</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}



export default Login;

