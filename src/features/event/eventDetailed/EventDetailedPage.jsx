import React, { Fragment, Component } from "react";
import { connect } from "react-redux";
import { withFirestore, firebaseConnect, isEmpty } from 'react-redux-firebase'; //this is just a different method to get data from firestore. This doesnt really give us the live data. Rather it gives us an instant of the data.
//firebaseConnect is just like firestoreConnect except this lets us listen to the data from firebase instead.
import { compose } from 'redux'; //to have cleaner code for exporting this component that has so many higher order components i.e. tidy up the code in the bottom
import { Grid, GridColumn } from "semantic-ui-react";
import EventDetailedHeader from "./EventDetailedHeader";
import EventDetailedInfo from "./EventDetailedInfo";
import EventDetailedChat from "./EventDetailedChat";
import EventDetailedSidebar from "./EventDetailedSidebar";
import { objectToArray, createDataTree } from "../../../app/common/util/helpers";
import { goingToEvent, cancelGoingToEvent } from "../../user/userActions";
import { addEventComment } from "../eventActions";


const action = {
  goingToEvent,
  cancelGoingToEvent,
  addEventComment
}


const mapState = (state, ownProps) => {
  //state is something we're getting from the store
  //we have to use ownProps here to access the props this component comes with which in this case is the router properties which are attached on its own and NOT from store
  const eventId = ownProps.match.params.id; //we get this from router property called match, because we're getting the id through the url itself.
  let event = {}; //so that it doesnt throw an error when an event cant be found

  if (state.firestore.ordered.events && state.firestore.ordered.events.length > 0) {
    event = state.firestore.ordered.events.find(event => eventId === event.id);
  } //if eventId and events exist, we're getting the event by filtering
  //through the list and matching the eventId. Even though we're getting only 1 event in return
  //we're still getting it as an array. So we need to specify by [0]
  return {
    event, //when we're doing mapState, we're mapping this into the props
    auth: state.firebase.auth,
    eventChat: !isEmpty(state.firebase.data.event_chat) && objectToArray(state.firebase.data.event_chat[eventId]) //using object bracket notation since the eventId will vary. We are getting the event chat info from firebase reducer where its found in data.
  };
};

class EventDetailedPage extends Component  {

  async componentDidMount() {
    const { firestore, match } = this.props;
    await firestore.setListener(`events/${match.params.id}`);
      
    
    // let event = await firestore.get(`events/${match.params.id}`); //this event above will give us a DocumentSnapshot of the event doc. Also since we're using withFirestore in here, this particular event will automatically be stored in the firestore reducer under the ordered data.
    //since its all wrapped by the router, we stll have access to the match props
    // if(!event.exists) { //exists is a property that is true if such a document exists in firestore and false otherwise. So even if users typein random things in the browser and we try to get a document from the firestore based on an id that doesnt exist, we would still get a snapshot doc but of a doc that doesnt exist. W
    //   history.push('/events'); //so  if the doc doesnt exist we'll send users back to the list
    //   toastr.error('Sorry', 'Event not found')
  }

  async componentWillUnmount(){
    const { firestore, match } = this.props;
    await firestore.unsetListener(`events/${match.params.id}`);
  }
  

  render() {
    const { event, auth, goingToEvent, cancelGoingToEvent, addEventComment, eventChat } = this.props;
    const attendees =  event && event.attendees && objectToArray(event.attendees); //objectToArray is found on helpers.js
    const isHost = event.hostUid === auth.uid; //if hostUid = auth.uid then true o/w false
    const isGoing = attendees && attendees.some(a => a.id === auth.uid) //.some returns a true as soon as the condition is met and false otherwise. We could've used .includes but that is only suitable for matching primitive data.
    const chatTree = !isEmpty(eventChat) && createDataTree(eventChat); //getting the replies as children to their respective parent comments.
    
    return (
      <Fragment>
        <Grid>
          <GridColumn width={10}>
            <EventDetailedHeader event={event} isGoing={isGoing} isHost={isHost} goingToEvent={goingToEvent} cancelGoingToEvent={cancelGoingToEvent}/>
            <EventDetailedInfo event={event} />
            <EventDetailedChat addEventComment={addEventComment} eventId={event.id} eventChat={chatTree}/>
          </GridColumn>
          <GridColumn width={6}>
           <EventDetailedSidebar attendees={attendees} /> 
           
            
          </GridColumn>
        </Grid>
      </Fragment>
    );
  }
  
};

export default compose(
  withFirestore,
  connect(mapState, action),
  firebaseConnect((props) => ([`event_chat/${props.match.params.id}`]))
)(EventDetailedPage);
