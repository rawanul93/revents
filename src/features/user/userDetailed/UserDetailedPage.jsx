import React, { Component } from "react";
import { connect } from "react-redux";
import { firestoreConnect, isEmpty } from "react-redux-firebase"; //isEmpty just checks if there is anything inside what we're looking for
import { compose } from "redux";
import { Grid } from "semantic-ui-react";

//components
import UserDetailedHeader from "./UserDetailedHeader";
import UserDetailedDescription from "./UserDetailedDescription";
import UserDetailedPhotos from "./UserDetailedPhotos";
import UserDetailedEvents from "./UserDetailedEvents";
import UserDetailedSidebar from "./UserDetailedSidebar";
import LoadingComponent from "../../../app/layout/LoadingComponent";


//actions and others
import { getUserEvents, followUser, unfollowUser } from '../userActions';
import { userDetailedQuery } from '../userQueries'



const actions = {
  getUserEvents,
  followUser,
  unfollowUser
}

const mapState = (state, ownProps) => { //ownprops to get the params we get in our url. Ownprops gets us access to the props this component gets and this case it gets the router props since the entire app is wrapped by withRouter
  
  //we need to set these based on whether the user has clicked on their own profile or its the profile of another user. If its own profile, we assign it from firebase.profile
  let userUid = null;
  let profile = {};
  let isFollowing = false;


  const followersCount = state.firestore.ordered.followers && (state.firestore.ordered.followers.length || 0);
  const followingCount = state.firestore.ordered.following && (state.firestore.ordered.following.length || 0);


  if (ownProps.match.params.id === state.auth.id) { // we set it up in a way that when we click a user's name, it is linked and the url includes that user's id. We access it using ownProps via router props. We check to see if the clicked user is the same as the current user logged in. If so, we just assign profile as the profile from firebase.
    profile = state.firebase.profile //the profile in state.firebase is the profile of the user currently logged in. Although it IS stored in firestore, we access it via firebase.
    
  } else {//isEmpty is from react-redux-firebase.
    profile = !isEmpty(state.firestore.ordered.profile) && state.firestore.ordered.profile[0]; //if the ordered profile is Not empty, then profile will equal the profile of whichever user we're clicking on. This is in the form of an array cause we're listening to this data from firestore.  //because we're listening to another user's profile, it will be stored as an array and we need to get the first item in the array.
    userUid = ownProps.match.params.id;

    isFollowing = !isEmpty(state.firestore.ordered.following) && (state.firestore.ordered.following.some(following => userUid === following.id) || false);

  }

  return {
      profile,
      userUid,
      events: state.events.userEvents, //getting from our events reducer because we dispatch our FETCH_EVENTS action in the getUserEvents action.
      eventsLoading: state.async.loading,
      auth: state.firebase.auth,
      photos: state.firestore.ordered.photos,
      isFollowing,
      followersCount,
      followingCount,
      requesting: state.firestore.status.requesting //since we have a listener set up on this page, firestore.status has a prop called requesting which is set to true when its still fetching data from the firestore, which in this case is the photos and since that takes a little bit more time it gives us some weirdness when we switch from one user profile to another. So we'll hook into this prop to check if the images are fetched or if its still requested and then display a loading component accordingly
    }
    
};

class UserDetailedPage extends Component {

  async componentDidMount(){
    await this.props.getUserEvents(this.props.userUid);
  }

  changeTab = (e, data) => {
    this.props.getUserEvents(this.props.userUid, data.activeIndex) //this active index is something we get from semanticUI Tab to check which tab the user is on currently.
  }


  render() {
    const { profile, photos, auth, match, requesting, events, eventsLoading, followUser, unfollowUser, isFollowing, followersCount, followingCount } = this.props;
    const isCurrentUser = auth.uid === match.params.id;

    const loading = Object.values(requesting).some(a => a === true); //Object.values converts an object into an array. We need this because requesting is an object with the user/Uid: true or false. So we convert it and use an array method some which is a method that checks if any of the elements in the array passes a test which is a function we provide. In this case checking if there is a true in there which indicates that the pictures are still being requested.
    if(loading) {
      // console.log(loading);
      return ( //if this condition is met, the loading component is returned and the rest of the code is not executed. Render() will execute only one return.
        <LoadingComponent />
      )
    }
    return (
      <Grid>
        <UserDetailedHeader profile={profile} followerCount={followersCount} followingCount={followingCount}/>
        <UserDetailedDescription profile={profile} />
        <UserDetailedSidebar isCurrentUser={isCurrentUser} userProfile={profile} isFollowing={isFollowing} followUser={followUser} loading={loading} unfollowUser={unfollowUser}/>
        {photos && photos.length > 0 && 
          <UserDetailedPhotos photos={photos} />}
        <UserDetailedEvents events={events} eventsLoading={eventsLoading} changeTab={this.changeTab}/>
      </Grid>
    );
  }
}

export default compose(
  connect(mapState, actions),
  firestoreConnect((auth, userUid) => userDetailedQuery(auth, userUid)) //the userDetailedQuery returns array of objects that query our firestore to get the user's profile and the crresponding photos subcollection .
)(UserDetailedPage);
