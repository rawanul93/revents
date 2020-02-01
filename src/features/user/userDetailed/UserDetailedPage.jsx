import React, { Component } from "react";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Grid } from "semantic-ui-react";
import UserDetailedHeader from "./UserDetailedHeader";
import UserDetailedDescription from "./UserDetailedDescription";
import UserDetailedPhotos from "./UserDetailedPhotos";
import UserDetailedEvents from "./UserDetailedEvents";
import UserDetailedSidebar from "./UserDetailedSidebar";

const query = ({ auth }) => {
  return [
    {
      collection: "users",
      doc: auth.uid,
      subcollections: [{ collection: "photos" }],
      storeAs: 'photos'
    }
  ];
};

const mapState = (state) => ({
    auth: state.firebase.auth,
    profile: state.firebase.profile,
    photos: state.firestore.ordered.photos
});

class UserDetailedPage extends Component {
  render() {
    const { profile, photos } = this.props;

    return (
      <Grid>
        <UserDetailedHeader profile={profile}/>
        <UserDetailedDescription profile={profile} />
        <UserDetailedSidebar />
        {photos && photos.length > 0 && 
        <UserDetailedPhotos photos={photos} />}
        <UserDetailedEvents />
        

       
      </Grid>
    );
  }
}

export default compose(
  connect(mapState, null),
  firestoreConnect((auth) => query(auth))
)(UserDetailedPage);
