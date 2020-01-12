import React, { Component } from "react";
import { Grid } from "semantic-ui-react";
import EventList from "../eventList/EventList";
import { connect } from "react-redux";
import { createEvent, updateEvent, deleteEvent } from "../eventActions";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import EventActivity from "../eventActivity/EventActivity";

const mapState = (state) => ({
  events: state.events, //getting the initial state from the store
  //its state.events because we called that reducer events in the rootReducer.
  //this is passed on from the store as props
  loading: state.async.loading
});

const actions = {
  createEvent,
  updateEvent,
  deleteEvent 
}; //these will be available through props in our component below

class EventDashboard extends Component {
  //   handleIsOpenToggle = () => {
  //     //setState lets you access what the prev state was
  //     //this allows us to use have toggle like features
  //     //below isOpen is always set to the opposite of what the prevState was
  //     this.setState((prevState) => ({
  //       isOpen: !prevState.isOpen
  //     }));
  //   };
  // handleCreateEvent = (newEvent) => {
  //   newEvent.id = cuid();
  //   newEvent.hostPhotoURL = "/assets/user.png";

  //   this.props.createEvent(newEvent);
    // this.setState(({ events }) => ({
    //   isOpen: false
    // }));
    //events is destructured from prevState.events
    //we want to use the previous state to get the
    //events that were there in previously so that we can
    //add the new event properly
    // ... is a spread operator. This abpve line is
    //creating a new array where the this.state.events
    //is spread out i.e. in this case spread into its 2 events
    //and a third event, newEvent is added as well with a total of 3 events in the new array
  


  // handleUpdateEvent = (updatedEvent) => {
  //   this.props.updateEvent(updatedEvent);

  //   // this.setState(({ events }) => ({ //destructuring to get prevState events list
  //   //   events: events.map((event) => { //remember that .map returns something. In this case we're returning events list including the updated one
  //   //     if (event.id === updatedEvent.id) {
  //   //       return { ...updatedEvent }; //this will spread the updated event properties and return that as a new event in our events array instead of the existing event
  //   //     } else {
  //   //       return event;
  //   //     }
  //   //   }),

  //   // }));
  // };

    // this.setState(({ events }) => ({
    //     events: events.filter(event => event.id !==  id) //filter through and give us events not equal to the id. So we're basically getting a new events array not including one with the id of selected event to delete.
    //     //filter allows us to specify a callback function inside here that  Returns the elements of an array that meet the condition specified in a callback function.
    //   //this creates a new array that we are gonna assign to our events in state
    //   }))

  handleDeleteEvent = (id) => {
    this.props.deleteEvent(id);
  };
  render() {
    const { events, loading } = this.props; //now we're getting events as component props from the store.
    if (loading) {
      return <LoadingComponent />
    } 
    return (
      <Grid>
        <Grid.Column width={10}>
          <EventList
            events={events}
            deleteEvent={this.handleDeleteEvent}
          />
        </Grid.Column>
        <Grid.Column width={6}>
          <EventActivity />
          {/*If isOpen true, then whatever is to the right of && will be executed */
          /*For our EventForm component, the key is used in order 
            to determine how react should re-render the EventForm component.
            If we did not pass a key, even if we receive an update in the props,
            the component does not re-render since the state does not change in EventForm.
            Using key, react creates a new component instance rather than updating the current one
             */}
        </Grid.Column>
      </Grid>
    );
  }
};

export default connect(mapState, actions)(EventDashboard);
