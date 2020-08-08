export const userDetailedQuery = ({ auth, userUid }) => {
  if (userUid !== null) {
    return [
      {
        collection: "users",
        doc: userUid,
        storeAs: "profile"
      },
      {
        collection: "users",
        doc: userUid,
        subcollections: [{ collection: "photos" }],
        storeAs: "photos"
      },
      {
        collection: 'users',
        doc: auth.uid,
        subcollections: [{collection: 'following'}],
        storeAs: 'following'
      },
      {
        collection: 'users',
        doc: auth.uid,
        subcollections: [{collection: 'followers'}],
        storeAs: 'followers'
      }
    ];
  } else {
    return [ //if it is the current user logged in, we dont need to get the profile seperately because thats already stored in state.firebase.profile
      {
        collection: "users",
        doc: auth.uid,
        subcollections: [{ collection: "photos" }],
        storeAs: "photos"
      }
    ];
  }
};
