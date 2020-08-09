import React from "react";
import { Segment, Comment } from "semantic-ui-react";
import Message from "./Message";
import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import firebase from "../../firebase";
import { connect } from "react-redux";
import { setUserPosts } from "../../actions";

class Messages extends React.Component {
  state = {
    messagesRef: firebase.database().ref("messages"),
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    usersRef: firebase.database().ref("users"),
    messages: [],
    messegesLoading: true,
    numUniques: "",
    searchTerm: "",
    searchLoading: false,
    searchResults: [],
    isChannelFavorite: false,
    privateChannel: this.props.isPrivateChannel,
    privateMessagesRef: firebase.database().ref("privateMessages"),
  };

  componentDidMount() {
    const { channel, user } = this.state;
    if (channel && user) {
      this.addListeners(channel.id);
      this.addUserFavListener(channel.id, user.uid);
    }
  }

  addListeners = (channelId) => {
    this.addMessageListener(channelId);
  };

  addUserFavListener = (channelId, userId) => {
    this.state.usersRef
      .child(userId)
      .child("favorites")
      .once("value")
      .then((data) => {
        if (data.val() !== null) {
          const channelIds = Object.keys(data.val());
          const prevFavorite = channelIds.includes(channelId);
          this.setState({ isChannelFavorite: prevFavorite });
        }
      });
  };

  addMessageListener = (channelId) => {
    let loadedMessages = [];
    const ref = this.getMessagesRef();

    ref.child(channelId).on("child_added", (snap) => {
      loadedMessages.push(snap.val());
      this.setState({
        messages: loadedMessages,
        messegesLoading: false,
      });
      this.countUniquUsers(loadedMessages);
      this.countUserPost(loadedMessages);
    });
  };

  handleSearch = (event) => {
    this.setState(
      {
        searchTerm: event.target.value,
        searchLoading: true,
      },
      () => this.handleSearchMessages()
    );
  };

  handleSearchMessages = () => {
    const channelsMessages = [...this.state.messages];
    const regex = new RegExp(this.state.searchTerm, "gi");
    const searchResults = channelsMessages.reduce((acc, message) => {
      if (
        (message.content && message.content.match(regex)) ||
        message.user.name.match(regex)
      ) {
        acc.push(message);
      }
      return acc;
    }, []);
    this.setState({ searchResults });
    setTimeout(() => this.setState({ searchLoading: false }), 1000);
  };

  countUniquUsers = (messages) => {
    const uniqueUsers = messages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name);
      }
      return acc;
    }, []);
    const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0;
    const numUniques = `${uniqueUsers.length} user${plural ? "s" : ""}`;
    this.setState({ numUniques });
  };

  getMessagesRef = () => {
    const { messagesRef, privateMessagesRef, privateChannel } = this.state;
    return privateChannel ? privateMessagesRef : messagesRef;
  };

  displayMessages = (messages) =>
    messages.length > 0 &&
    messages.map((message) => (
      <Message
        key={message.timestamp}
        message={message}
        user={this.state.user}
      />
    ));

  displayChannelName = (channel) => {
    return channel
      ? `${this.state.privateChannel ? "@" : "#"}${channel.name}`
      : "";
  };

  handleFav = () => {
    this.setState(
      (prevState) => ({
        isChannelFavorite: !prevState.isChannelFavorite,
      }),
      () => this.favChannel()
    );
  };

  favChannel = () => {
    if (this.state.isChannelFavorite) {
      this.state.usersRef.child(`${this.state.user.uid}/favorites`).update({
        [this.state.channel.id]: {
          name: this.state.channel.name,
          details: this.state.channel.details,
          createdBy: {
            name: this.state.channel.createdBy.name,
            avatar: this.state.channel.createdBy.avatar,
          },
        },
      });
    } else {
      this.state.usersRef
        .child(`${this.state.user.uid}/favorites`)
        .child(this.state.channel.id)
        .remove((err) => {
          if (err) {
            console.error(err);
          }
        });
    }
  };

  countUserPost = (messages) => {
    let userPosts = messages.reduce((acc, message) => {
      if (message.user.name in acc) {
        acc[message.user.name].count += 1;
      } else {
        acc[message.user.name] = {
          avatar: message.user.avatar,
          count: 1,
        };
      }
      return acc;
    }, {});
    this.props.setUserPosts(userPosts);
  };

  render() {
    const {
      messagesRef,
      channel,
      user,
      messages,
      numUniques,
      searchTerm,
      searchResults,
      searchLoading,
      privateChannel,
      isChannelFavorite,
    } = this.state;

    return (
      <React.Fragment>
        <MessagesHeader
          channelName={this.displayChannelName(channel)}
          numUniques={numUniques}
          handleSearch={this.handleSearch}
          searchLoading={searchLoading}
          isPrivateChannel={privateChannel}
          handleFav={this.handleFav}
          isChannelFavorite={isChannelFavorite}
        />
        <Segment>
          <Comment.Group className="messages">
            {searchTerm
              ? this.displayMessages(searchResults)
              : this.displayMessages(messages)}
          </Comment.Group>
        </Segment>
        <MessageForm
          messagesRef={messagesRef}
          currentChannel={channel}
          currentUser={user}
          isPrivateChannel={privateChannel}
          getMessagesRef={this.getMessagesRef}
        />
      </React.Fragment>
    );
  }
}

export default connect(null, { setUserPosts })(Messages);
