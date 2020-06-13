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

class Signup extends React.Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

handleSubmit = event => {
event.preventDefault();
firebase
.auth()
.createUserWithEmailAndPassword(this.state.email, this.state.password)
.then(createdUser => {
  console.log(createdUser);
})
.catch(err => {
  console.error(err);
})
}



  render() {
    const { username, email, password, confirmPassword } = this.state;

    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" icon color="orange" textAlign="center">
            <Icon name="handshake outline" color="red" />
            Signup for Groupy
          </Header>
          <Form size="small" onSubmit={this.handleSubmit}>
            <Segment stacked>
              <Form.Input
                fluid
                name="username"
                icon="user"
                iconPosition="left"
                placeholder="Username"
                onChange={this.handleChange}
                type="text"
                value={username}
              />
              <Form.Input
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email Address"
                onChange={this.handleChange}
                type="email"
                value={email}
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
              />
              <Form.Input
                fluid
                name="passwordConfirm"
                icon="repeat"
                iconPosition="left"
                placeholder="Password Confirmation"
                onChange={this.handleChange}
                type="password"
                value={confirmPassword}
              />
              <Button color="orange" fluid size="medium">
                Submit
              </Button>
            </Segment>
          </Form>
          <Message>
            Are you already a groupy?<Link to="/login"> Login here</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Signup;
