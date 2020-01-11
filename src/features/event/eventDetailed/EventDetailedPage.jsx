import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Grid, GridColumn } from "semantic-ui-react";
import EventDetailedHeader from "./EventDetailedHeader";
import EventDetailedInfo from "./EventDetailedInfo";
import EventDetailedChat from "./EventDetailedChat";
import EventDetailedSidebar from "./EventDetailedSidebar";

const mapState = (state, ownProps) => {
  //state is something we're getting from the store
  //ownProps is the router properties which are attached to this component on its own and NOT from store
  const eventId = ownProps.match.params.id; //we get this from router property called match, because we're getting the id through the url itself.
  let event = {}; //so that it doesnt throw an error when an event cant be found

  if (eventId && state.events.length > 0) {
    event = state.events.find(event => eventId === event.id);
  } //if eventId and events exist, we're getting the event by filtering
  //through the list and matching the eventId. Even though we're getting only 1 event in return
  //we're still getting it as an array. So we need to specify by [0]
  return {
    event //when we're doing mapState, we're mapping this into the props
    //so we can use it in the component now
  };
};

const EventDetailedPage = ({ event }) => {
  return (
    <Fragment>
      <Grid>
        <GridColumn width={10}>
          <EventDetailedHeader event={event} />
          <EventDetailedInfo event={event} />
          <EventDetailedChat />
        </GridColumn>
        <GridColumn width={6}>
         <EventDetailedSidebar attendees={event.attendees} />
          
        </GridColumn>
      </Grid>
    </Fragment>
  );
};

export default connect(mapState)(EventDetailedPage);
