import React from "react";
import { Grid, Header, Icon, Dropdown } from "semantic-ui-react";

class UserPanel extends React.Component {

dropDownOptions = () => [
    {
        key: 'user',
        text: <span>Log in as <strong>User</strong></span>,
        disabled: true
    },
    {
        key: 'avatar',
        text: <span>Change Avatar</span>
    },
    {
        key: 'logout',
        text: <span>Log Out</span>
    }
]


  render() {
    return (
      <Grid style={{ background: "#FF8F35" }}>
        <Grid.Column>
          <Grid.Row style={{ padding: "1.2em", margin: 0 }}>
            {/*main app header*/}
            <Header inverted floated="left" as="h2">
              <Icon name="handshake outline" />
              <Header.Content>Groupy</Header.Content>
            </Header>
          </Grid.Row>
          {/*dropdown*/}
          <Header style={{ padding: '0.25em'}} as="h4" inverted>
              <Dropdown 
              trigger={<span>User</span>} 
              options={this.dropDownOptions()}/>
          </Header>
        </Grid.Column>
      </Grid>
    );
  }
}

export default UserPanel;
