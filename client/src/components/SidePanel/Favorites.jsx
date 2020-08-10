import React, { Component } from "react";
import { connect } from "react-redux";
import firebase from "../../firebase";
import { setCurrentChannel, setPrivateChannel } from "../../actions/index";
import { Menu, Icon } from "semantic-ui-react";

class Favorites extends Component {
  state = {
    user: this.props.currentUser,
    usersRef: firebase.database().ref("users"),
    activeChannel: "",
    favoriteChannels: [],
  };

  componentDidMount() {
    if (this.state.user) {
      this.addListeners(this.state.user.uid);
    }
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  removeListeners = () => {
    this.state.usersRef.child(`${this.state.user.uid}/favorites`).off();
  };

  addListeners = (userId) => {
    this.state.usersRef
      .child(userId)
      .child("favorites")
      .on("child_added", (snap) => {
        const favoriteChannel = { id: snap.key, ...snap.val() };
        this.setState({
          favoriteChannels: [...this.state.favoriteChannels, favoriteChannel],
        });
      });
    this.state.usersRef
      .child(userId)
      .child("favorites")
      .on("child_removed", (snap) => {
        const channelIdRemove = { id: snap.key, ...snap.val() };
        const filteredChannels = this.state.favoriteChannels.filter(
          (channel) => {
            return channel.id !== channelIdRemove.id;
          }
        );
        this.setState({ favoriteChannels: filteredChannels });
      });
  };

  setActiveChannel = (channel) => {
    this.setState({ activeChannel: channel.id });
  };

  changeChannel = (channel) => {
    this.setActiveChannel(channel);
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(false);
    this.setState({ channel });
  };

  displayChannels = (starredChannels) =>
    starredChannels.length > 0 &&
    starredChannels.map((channel) => (
      <Menu.Item
        key={channel.id}
        onClick={() => this.changeChannel(channel)}
        name={channel.name}
        style={{ opacity: 0.7 }}
        active={channel.id === this.state.activeChannel}
      >
        # {channel.name}
      </Menu.Item>
    ));

  render() {
    const { favoriteChannels } = this.state;

    return (
      <Menu.Menu style={{ paddingBottom: "2em", marginTop: "2rem" }}>
        <Menu.Item>
          <span>
            <Icon name="star" /> Favorites
          </span>{" "}
          ({favoriteChannels.length}){" "}
          <Icon
            name="add"
            onClick={this.openModal}
            style={{ cursor: "pointer" }}
          />
        </Menu.Item>
        {this.displayChannels(favoriteChannels)}
      </Menu.Menu>
    );
  }
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(
  Favorites
);
