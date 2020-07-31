import React, { Component, Fragment } from "react";
import { Grid, Loader, Header, Segment } from "semantic-ui-react";
import EventList from "../eventList/EventList";
import { connect } from "react-redux";
import { getEventsForDashboard } from "../eventActions";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import EventActivity from "../eventActivity/EventActivity";
import { firestoreConnect } from "react-redux-firebase"; // isLoaded can be imported here and we use this to load our events from the firestore into our firestore reducer. From which we extract the events as props.

const mapState = (state) => ({
  //events: state.firestore.ordered.events //this is how we would get events if we were listening to the firestore via firestoreConnect
  events: state.events, //from our event reducer. This is the number of events currently loaded from firebase via the getEventsForDashboard method.
  loading: state.async.loading
  // events: state.firestore.ordered.events, //getting the initial state from the store. We get to do this because we're using firestoreConnect for this component.
  //its state.firestore because we called that reducer events in the rootReducer.
  //this is passed on from the store as props
});

const actions = {
  getEventsForDashboard
};

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
    moreEvents: false,
    loadingInitial: true, //loading indicator for when we initially open up this page
    loadedEvents: [], //this is where we actually store all our events. We get 2 events from our events state each time user scrolls down, and each time we add them to this in componentDidUpdate 
    noEventsExist: false
  };
  async componentDidMount() {    //when we load the page and this component is mounted, getEventsForDashboard doesnt get a lastEvent passed in and only 2 events will be loaded since thats the limit we set. Already the moreEvents local state var is set to false by default and we check here whether there are more events in the database than the 2 events we limit it to loading when we mount this. If there are more than we set that to true and hence provide users with a button to load more events and scroll futther down
    let next = await this.props.getEventsForDashboard(); //since we're returning the query snapshot from this action, it will be stored in this next variable.
    console.log(this.props.events)
    if (next.docs.length === 0) {
      this.setState({
        loadingInitial: false,
        noEventsExist: true
      })
    }
    if (next && next.docs && next.docs.length > 1) { //so this querySnapshot we and store as next will have a length of either 0, 1 or 2. Since we're only limiting loading to 2 we'll make sure that there are at least 2 events waiting to be loaded in the snapShot. 
      this.setState({
        moreEvents: true, //this is true when there are indeed more events to come if user decides to scroll down.
        loadingInitial: false, //set it to false once initial mounting is finished
      });
    }
    if (this.state.loadedEvents.length > 0) {
        this.setState({
          loadingInitial: false,
        })
    }
  }

  componentDidUpdate = (prevProps) => { //this happens when we receive new props. It runs quite a few times so we only load events into our loadEvents state ONLY if we get new events in our events state i.e. prev state of events !== current state.
    console.log('componentDidUpdate just ran')
    if(this.props.events !== prevProps.events) { //if there are new events loaded from firebase, it wont equal the events that were previously loaded which we access through prevProps.events which is the state before the update occurs when a user clicks on the more button.
      this.setState({
        loadedEvents: [...this.state.loadedEvents, ...this.props.events] //first it will be empty, but then when component updates we fill it with the first 2 events that are in the events state. Then as user scrolls down, we refresh our events state with 2 new events and so we add that in along with what was there previously which are the first 2 events. And this keeps on going until all the events are loaded.
      })
    }
    
  }

  getNextEvents = async () => {
    const { events } = this.props; //events will always only have 2 in it. We fill up our loadedEvents local state with 2 events each.
    let lastEvent = events && events[events.length - 1]; //its length - 1 because for example when the component first mounts the events has 2 events in it and so length would be 2 with events[event1, event2]. To get event2 which is the last event we need to do event[1] which is event[length-1]
    let next = await this.props.getEventsForDashboard(lastEvent);
    if (next && next.docs && next.docs.length <= 1) {
      this.setState({
        moreEvents: false //this is false when there arent any more events left. But it stays true if there are more than 2 events in the beginning when we load this component
      });
    }
  };

  render() {
    const { loading } = this.props; 
    const { moreEvents, loadedEvents, loadingInitial, noEventsExist } =  this.state;

    if (loadingInitial) {//only show this loading component when we initially load up this page.
      return <LoadingComponent />;
    }
    return (
      <Grid>
        <Grid.Column width={10}>
        {noEventsExist ? 
          <Fragment>
            <Header>No Events Exist!</Header>
            <Segment>Click on 'Create Event' to add events!</Segment>
          </Fragment>
          : <EventList events={loadedEvents} getNextEvents={this.getNextEvents} loading={loading} moreEvents={moreEvents}/>
        }
        </Grid.Column>
        <Grid.Column width={6}>
          <EventActivity />
        </Grid.Column>
        <Grid.Column width={10}>
            <Loader active={loading}/> {/*loading indicator for when scrolling down */}
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
