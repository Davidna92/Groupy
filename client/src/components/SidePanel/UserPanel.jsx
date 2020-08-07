import React from "react";
import { Grid, Header, Icon, Dropdown, Image } from "semantic-ui-react";
import firebase from "../../firebase";

class UserPanel extends React.Component {
  state = {
    user: this.props.currentUser,
  };

  
UNSAFE_componentWillReceiveProps(nextProps) {
  this.setState({user: nextProps.currentUser});
}


  dropDownOptions = () => [
    {
      key: "user",
      text: (
        <span>
          logged in as{" "}
          <strong>{this.state.user.displayName}</strong>
        </span>
      ),
      disabled: true,
    },
    {
      key: "avatar",
      text: <span>Change Avatar</span>,
    },
    {
      key: "logout",
      text: <span onClick={this.handleLogOut}>Log Out</span>,
    },
  ];

  handleLogOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("sign out!");
      });
  };

  render() {
const { user } = this.state;



    return (
      <Grid style={{ background: "#013d87" }}>
        <Grid.Column>
          <Grid.Row style={{ padding: "0.7em", margin: 0}}>
            <Header inverted floated="left" as="h2">
              <Icon name="handshake outline" style={{color: "orange"}} />
              <Header.Content className="text-center" style={{ color: 'orange'}}>Groupy</Header.Content>
            </Header>
          <Header style={{ padding: "0.25em" }} as="h4" inverted>
            <Dropdown
              trigger={<span>
                <Image src={user.photoURL} spaced="right" avatar />
                {user.displayName}</span>}
              options={this.dropDownOptions()}
            />
          </Header>
          </Grid.Row>
        </Grid.Column>
      </Grid>
    );
  }
}

// const mapStateToProps = (state) => ({
//   currentUser: state.user.currentUser,
// });

export default UserPanel;
