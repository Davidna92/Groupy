import React from "react";
import {
  Grid,
  Header,
  Icon,
  Dropdown,
  Image,
  Modal,
  Input,
  Button,
} from "semantic-ui-react";
import AvatarEditor from "react-avatar-editor";
import firebase from "../../firebase";

class UserPanel extends React.Component {
  state = {
    user: this.props.currentUser,
    modal: false,
    previewImage: "",
    croppedImage: "",
    blob: "",
    storageRef: firebase.storage().ref(),
    userRef: firebase.auth().currentUser,
    usersRef: firebase.database().ref("users"),
    metadata: {
      contentType: "image/jpeg",
    },
    uploadedCroppedImage: "",
  };

  openModal = () => this.setState({ modal: true });

  closeModal = () => this.setState({ modal: false });

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ user: nextProps.currentUser });
  }

  dropDownOptions = () => [
    {
      key: "user",
      text: (
        <span>
          logged in as <strong>{this.state.user.displayName}</strong>
        </span>
      ),
      disabled: true,
    },
    {
      key: "avatar",
      text: <span onClick={this.openModal}>Change Avatar</span>,
    },
    {
      key: "logout",
      text: <span onClick={this.handleLogOut}>Log Out</span>,
    },
  ];

  handleChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.addEventListener("load", () => {
        this.setState({ previewImage: reader.result });
      });
    }
  };

  handleLogOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("sign out!");
      });
  };

  handleCrop = () => {
    if (this.avatarEditor) {
      this.avatarEditor.getImageScaledToCanvas().toBlob((blob) => {
        let imgUrl = URL.createObjectURL(blob);
        this.setState({
          croppedImage: imgUrl,
          blob,
        });
      });
    }
  };

  uploadCroppedImage = () => {
    const { storageRef, userRef, blob, metadata } = this.state;

    storageRef
      .child(`avatar/user-${userRef.uid}`)
      .put(blob, metadata)
      .then((snap) => {
        snap.ref.getDownloadURL().then((downloadURL) => {
          this.setState({ uploadedCroppedImage: downloadURL }, () => {
            this.changeAvatar();
          });
        });
      });
  };

  changeAvatar = () => {
    this.state.userRef
      .updateProfile({
        photoURL: this.state.uploadedCroppedImage,
      })
      .then(() => {
        console.log("photo updated");
        this.closeModal();
      })
      .catch((err) => {
        console.error(err);
      });
    this.state.usersRef
      .child(this.state.user.uid)
      .update({ avatar: this.state.uploadedCroppedImage })
      .then(() => {
        console.log("user avatar updated");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  render() {
    const { user, modal, previewImage, croppedImage } = this.state;

    return (
      <Grid style={{ background: "#013d87" }}>
        <Grid.Column>
          <Grid.Row style={{ padding: "0.7em", margin: 0 }}>
            <Header inverted floated="left" as="h2">
              <Icon name="handshake outline" style={{ color: "orange" }} />
              <Header.Content
                className="text-center"
                style={{ color: "orange" }}
              >
                Groupy
              </Header.Content>
            </Header>
            <Header style={{ padding: "0.25em" }} as="h4" inverted>
              <Dropdown
                trigger={
                  <span>
                    <Image src={user.photoURL} spaced="right" avatar />
                    {user.displayName}
                  </span>
                }
                options={this.dropDownOptions()}
              />
            </Header>
          </Grid.Row>
          {/* change user avatar */}
          <Modal basic open={modal} onClose={this.closeModal}>
            <Modal.Header>Change avatar</Modal.Header>
            <Modal.Content>
              <Input
                onChange={this.handleChange}
                fluid
                type="file"
                label="previewImage"
              />
              <Grid centered stackable columns={2}>
                <Grid.Row centered>
                  <Grid.Column className="ui center aligned grid">
                    {previewImage && (
                      <AvatarEditor
                        ref={(node) => (this.avatarEditor = node)}
                        image={previewImage}
                        width={120}
                        height={120}
                        border={50}
                        scale={1.2}
                      />
                    )}
                  </Grid.Column>
                  <Grid.Column>
                    {croppedImage && (
                      <Image
                        style={{ margin: "3.5em auto" }}
                        width={100}
                        height={100}
                        src={croppedImage}
                      />
                    )}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Modal.Content>
            <Modal.Actions>
              {croppedImage && (
                <Button color="blue" inverted onClick={this.uploadCroppedImage}>
                  <Icon name="save" /> Change Image
                </Button>
              )}
              <Button color="orange" inverted onClick={this.handleCrop}>
                <Icon name="image" /> Preview
              </Button>
              <Button color="red" inverted onClick={this.closeModal}>
                <Icon name="remove" /> Cancle
              </Button>
            </Modal.Actions>
          </Modal>
        </Grid.Column>
      </Grid>
    );
  }
}

// const mapStateToProps = (state) => ({
//   currentUser: state.user.currentUser,
// });

export default UserPanel;
