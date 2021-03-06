import React, { Component } from "react";
import { Header, Segment, Input, Icon } from "semantic-ui-react";

class MessagesHeader extends Component {
  render() {
    const { channelName, numUniques, handleSearch, searchLoading, isPrivateChannel, handleFav, isChannelFavorite } = this.props;
    return (
      <Segment clearing>
        <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }}>
          <span>
            {channelName}
            {!isPrivateChannel && 
            <Icon 
            onClick={handleFav} 
            name={isChannelFavorite ? 'star' : 'star outline'} 
            color={isChannelFavorite ? 'yellow' : 'black'} 
            />
            }
          </span>
          <Header.Subheader>{numUniques} online</Header.Subheader>
        </Header>
        <Header floated="right">
          <Input
            size="mini"
            icon="search"
            name="searchItem"
            placeholder="Search Messages"
            onChange={handleSearch}
            loading={searchLoading}
          />
        </Header>
      </Segment>
    );
  }
}

export default MessagesHeader;
