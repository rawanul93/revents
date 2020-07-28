import React, { Component } from "react";
import { Grid, Button, Loader } from "semantic-ui-react";
import EventList from "../eventList/EventList";
import { connect } from "react-redux";
import { getEventsForDashboard } from "../eventActions";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import EventActivity from "../eventActivity/EventActivity";
import { firestoreConnect, isLoaded } from "react-redux-firebase"; //we use this to load our events from the firestore into our firestore reducer. From which we extract the events as props.

const mapState = (state) => ({
  events: state.events, //from our event reducer. This is the number of events currently loaded from firebase via the getEventsForDashboard method.
  loading: state.async.loading
  // events: state.firestore.ordered.events, //getting the initial state from the store. We get to do this because we're using firestoreConnect for this component.
  //its state.firestore because we called that reducer events in the rootReducer.
  //this is passed on from the store as props
});

const actions = {
  getEventsForDashboard
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
  state = {
    //local state
    moreEvents: false,
    loadingInitial: true, //loading indicator for when we initially open up this page
    loadedEvents: []
  };
  async componentDidMount() {
    //when we load the page and this component is mounted, getEventsForDashboard doesnt get a lastEvent passed in and only 2 events will be loaded since thats the limit we set. Already the moreEvents local state var is set to false by default and we check here whether there are more events in the database than the 2 events we limit it to loading when we mount this. If there are more than we set that to true and hence provide users with a button to load more events and scroll futther down
    let next = await this.props.getEventsForDashboard(); //since we're returning the query snapshot from this action, it will be stored in this next variable.
    if (next && next.docs && next.docs.length > 1) {
      //if there is a querySnapshot, if it has docs in it and if so then making sure that there are more than 2 docs (since we limited it to 2 being loaded and displayed and since next.docs is an array if there are more docs it will have length > 1), which would mean that if user scrolls, we gotta load the rest.
      this.setState({
        moreEvents: true, //this is true when there are indeed more events to come if user decides to scroll down.
        loadingInitial: false, //set it to false once mounting is finished
      });
    }
  }

  componentDidUpdate = (prevProps) => { //this only runs when there is some kind of update and not during the initial render . We want to use this in order to keep all the loaded events in memory so that we can display them properly. As more events are loaded when user clicks on the More button, the local state loadedEvents will be updated with the new events. and that will be sent to EventList component.
    if(this.props.events !== prevProps.events) { //if there are new events loaded from firebase, it wont equal the events that were previously loaded which we access through prevProps.events which is the state before the update occurs when a user clicks on the more button.
      this.setState({
        loadedEvents: [...this.state.loadedEvents, ...this.props.events] //the loadedEvents have the prev events and the this.props.events are the new events that have been loaded. Initially the loadedEvents is empty but the this.props.events isnt, so thats what we load.
      })
    }
  }

  getNextEvents = async () => {
    const { events } = this.props;
    let lastEvent = events && events[events.length - 1]; //its length - 1 because we're trying to get the last event that has been loaded due to the user scrolling
    let next = await this.props.getEventsForDashboard(lastEvent);
    if (next && next.docs && next.docs.length <= 1) {
      this.setState({
        moreEvents: false //this is false when there arent any more events left. But it stays true if there are more than 2 events in the beginning when we load this component
      });
    }
  };

  render() {
    const { loading } = this.props; //now we're getting events as component props from the store.
    const { moreEvents, loadedEvents } =  this.state;

    if (this.state.loadingInitial) {//only show this loading component when we initially load up this page.
      return <LoadingComponent />;
    }
    return (
      <Grid>
        <Grid.Column width={10}>
          <EventList events={loadedEvents} getNextEvents={this.getNextEvents} loading={loading} moreEvents={moreEvents}/>
        </Grid.Column>
        <Grid.Column width={6}>
          <EventActivity />
        </Grid.Column>
        <Grid.Column width={10}>
            <Loader active={loading}/>
        </Grid.Column>
      </Grid>
    );
  }
}

export default connect(
  mapState,
  actions
)(firestoreConnect([{ collection: "events" }])(EventDashboard));
//firestoreConnect allows us to listen into the events which we get from firestore.
//but this will not work for our paging because we're gonna display events on our page based on the current time and since firestoreConnect is a listener, it will constantly update which we dont neccessarily want. So we'll use firebase api directly and use our own reducer instead of react-redux-firebase.

//So we're passing in firestoreConnect to our higher order component connect.
//firestoreConnect takes in arrays of queries in the form of objects.
//then we're passing in EventDashboard to our firestoreConnect

/*For our EventForm component, the key is used in order 
    to determine how react should re-render the EventForm component.
    If we did not pass a key, even if we receive an update in the props,
    the component does not re-render since the state does not change in EventForm.
    Using key, react creates a new component instance rather than updating the current one
     */
