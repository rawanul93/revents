import React, { Fragment, Component } from "react";
import { Grid, GridColumn } from "semantic-ui-react";

//redux and firebase
import { connect } from "react-redux";
import { withFirestore, firebaseConnect, isEmpty } from 'react-redux-firebase'; //this is just a different method to get data from firestore. This doesnt really give us the live data. Rather it gives us an instant of the data.
//firebaseConnect is just like firestoreConnect except this lets us listen to the data from firebase instead.
import { compose } from 'redux'; //to have cleaner code for exporting this component that has so many higher order components i.e. tidy up the code in the bottom
import { goingToEvent, cancelGoingToEvent } from "../../user/userActions";
import { addEventComment } from "../eventActions";
import { openModal } from "../../modals/modalActions";

//components
import EventDetailedHeader from "./EventDetailedHeader";
import EventDetailedInfo from "./EventDetailedInfo";
import EventDetailedChat from "./EventDetailedChat";
import EventDetailedSidebar from "./EventDetailedSidebar";

//others
import { objectToArray, createDataTree } from "../../../app/common/util/helpers";


const action = {
  goingToEvent,
  cancelGoingToEvent,
  addEventComment,
  openModal
}


const mapState = (state, ownProps) => {
  const eventId = ownProps.match.params.id; //we get this from router property called match, because we're getting the id through the url itself.
  let event = {}; //so that it doesnt throw an error when an event cant be found

  if (state.firestore.ordered.events && state.firestore.ordered.events.length > 0) {
    event = state.firestore.ordered.events.find(event => (eventId === event.id ));
  } //if eventId and events exist, we're getting the event by filtering through the list and matching the eventId. Even though we're getting only 1 event in return

  return {
    event, //when we're doing mapState, we're mapping this into the props
    auth: state.firebase.auth,
    eventChat: !isEmpty(state.firebase.data.event_chat) && objectToArray(state.firebase.data.event_chat[eventId]), //using object bracket notation since the eventId will vary. We are getting the event chat info from firebase reducer where its found in data.
    loading: state.async.loading
  };
};


class EventDetailedPage extends Component  {

  async componentDidMount() {
    const { firestore, match } = this.props;
   
    await firestore.setListener(`events/${match.params.id}`);
  }

  async componentWillUnmount(){
    const { firestore, match } = this.props;
    await firestore.unsetListener(`events/${match.params.id}`);
  }
  
  render() {
    const { event, auth, goingToEvent, cancelGoingToEvent, addEventComment, eventChat, loading, openModal } = this.props;
    const attendees =  event && event.attendees && objectToArray(event.attendees); //objectToArray is found on helpers.js
    
    //Need these props to render which buttons we want to show the user when he/she goes to an event page.
    const isHost = event && event.hostUid === auth.uid; //if hostUid = auth.uid then true o/w false
    const isGoing = attendees && attendees.some(a => a.id === auth.uid) //.some returns a true as soon as the condition is met and false otherwise. We could've used .includes but that is only suitable for matching primitive data.
    const chatTree = !isEmpty(eventChat) && createDataTree(eventChat); //getting the replies as children to their respective parent comments.
    const authenticated = auth.isLoaded && !auth.isEmpty;
    return (
      <div> 
         {event && (
            <Fragment>
              <Grid>
              <GridColumn width={10}>
                <EventDetailedHeader event={event} isGoing={isGoing} isHost={isHost} goingToEvent={goingToEvent} cancelGoingToEvent={cancelGoingToEvent} loading={loading} authenticated={authenticated} openModal={openModal} />
                <EventDetailedInfo event={event} />
                {authenticated && 
                  <EventDetailedChat addEventComment={addEventComment} eventId={event.id} eventChat={chatTree}/>
                }
              </GridColumn>
              <GridColumn width={6}>
              <EventDetailedSidebar attendees={attendees} eventId={event.id}/> 
              </GridColumn>
            </Grid>
      </Fragment>
      )
    
    }
      </div>
       
      
    );
  }
  
};

export default compose(
  withFirestore,
  connect(mapState, action),
  firebaseConnect((props) => ([`event_chat/${props.match.params.id}`])) //so we pass in our props here so that we can pull in the chat data based on which event has been clicked.
)(EventDetailedPage);
