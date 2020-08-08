import React from "react";
import { Grid, Segment, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";

const UserDetailedSidebar = ({
  isCurrentUser,
  isFollowing,
  unfollowUser,
  followUser,
  loading,
  userProfile
}) => {
  return (
    <Grid.Column width={4}>
      <Segment>
        {isCurrentUser ? (
          <Button
            as={Link}
            to="/settings"
            color="teal"
            fluid
            colored="true"
            content="Edit Profile "
          />
        ) : isFollowing ? (
          <Button
            color="teal"
            fluid
            colored="true"
            content="Unfollow"
            onClick={() => unfollowUser(userProfile)}
          />
        ) : (
          <Button
            color="teal"
            fluid
            colored="true"
            content="Follow"
            onClick={() => followUser(userProfile)}
          />
        )}
      </Segment>
    </Grid.Column>
  );
};

export default UserDetailedSidebar;
