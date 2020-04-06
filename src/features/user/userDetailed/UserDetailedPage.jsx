import React, { Component } from "react";
import { connect } from "react-redux";
import { firestoreConnect, isEmpty } from "react-redux-firebase"; //isEmpty just checks if there is anything inside what we're looking for
import { compose } from "redux";
import { Grid } from "semantic-ui-react";
import UserDetailedHeader from "./UserDetailedHeader";
import UserDetailedDescription from "./UserDetailedDescription";
import UserDetailedPhotos from "./UserDetailedPhotos";
import UserDetailedEvents from "./UserDetailedEvents";
import UserDetailedSidebar from "./UserDetailedSidebar";
import { userDetailedQuery } from "../userQueries";
import LoadingComponent from "../../../app/layout/LoadingComponent";



const mapState = (state, ownProps) => { //ownprops to get the params we get in our url. Ownprops gets us access to the props this component gets and this case it gets the router props since the entire app is wrapped by withRouter
  let userUid = null;
  let profile = {};

  if (ownProps.match.params.id === state.auth.id) { // we set it up in a way that when we click a user's name, it is linked and the url includes that user's id. We access it using ownProps via router props. We check to see if the clicked user is the same as the current user logged in. If so, we just assign profile as the profile from firebase.
    profile = state.firebase.profile
    
  } else {
    profile = !isEmpty(state.firestore.ordered.profile) && state.firestore.ordered.profile[0]; //if the ordered profile is Not empty, then profile will equal the profile of whichever user we're clicking on.
    //because we're listening to another user's profile, it will be stored as an array and we need to get the first item in the array.
    userUid = ownProps.match.params.id;
  }

  return {
      profile,
      userUid,
      auth: state.firebase.auth,
      photos: state.firestore.ordered.photos,
      requesting: state.firestore.status.requesting //since we have a listener set up on this page, firestore.status has a prop called requesting which is set to true when its still fetching data from the firestore, which in this case is the photos and since that takes a little bit more time it gives us some weirdness when we switch from one user profile to another. So we'll hook into this prop to check if the images are fetched or if its still requested and then display a loading component accordingly
    }
    
};

class UserDetailedPage extends Component {
  render() {
    const { profile, photos, auth, match, requesting } = this.props;
    const isCurrentUser = auth.uid === match.params.id;

    const loading = Object.values(requesting).some(a => a === true); //Object.values converts an object into an array. We need this because requesting is an object with the user/Uid: true or false. So we convert it and use an array method some which is a method that checks if any of the elements in the array passes a test which is a function we provide. In this case checking if there is a true in there which indicates that the pictures are still being requested.
    if(loading) {
      return ( //if this condition is met, the loading component is returned and the rest of the code is not executed. Render() will execute only one return.
        <LoadingComponent />
      )
    }
    return (
      <Grid>
        <UserDetailedHeader profile={profile}/>
        <UserDetailedDescription profile={profile} />
        <UserDetailedSidebar isCurrentUser={isCurrentUser} />
        {photos && photos.length > 0 && 
        <UserDetailedPhotos photos={photos} />}
        <UserDetailedEvents />
      </Grid>
    );
  }
}

export default compose(
  connect(mapState, null),
  firestoreConnect((auth, userUid) => userDetailedQuery(auth, userUid))
)(UserDetailedPage);
