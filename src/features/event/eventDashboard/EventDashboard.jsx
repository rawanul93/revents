import React, { Component } from "react";
import { Grid, Button } from "semantic-ui-react";
import EventList from "../eventList/EventList";
import EventForm from "../eventForm/EventForm";
import cuid from "cuid"; //collision resistant ids. Its included in the package.json

const eventsFromDashboard = [
  {
    id: "1",
    title: "Trip to Tower of London",
    date: "2018-03-27",
    category: "culture",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sollicitudin ligula eu leo tincidunt, quis scelerisque magna dapibus. Sed eget ipsum vel arcu vehicula ullamcorper.",
    city: "London, UK",
    venue: "Tower of London, St Katharine's & Wapping, London",
    hostedBy: "Bob",
    hostPhotoURL: "https://randomuser.me/api/portraits/men/20.jpg",
    attendees: [
      {
        id: "a",
        name: "Bob",
        photoURL: "https://randomuser.me/api/portraits/men/20.jpg"
      },
      {
        id: "b",
        name: "Tom",
        photoURL: "https://randomuser.me/api/portraits/men/22.jpg"
      }
    ]
  },
  {
    id: "2",
    title: "Trip to Punch and Judy Pub",
    date: "2018-03-28",
    category: "drinks",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sollicitudin ligula eu leo tincidunt, quis scelerisque magna dapibus. Sed eget ipsum vel arcu vehicula ullamcorper.",
    city: "London, UK",
    venue: "Punch & Judy, Henrietta Street, London, UK",
    hostedBy: "Tom",
    hostPhotoURL: "https://randomuser.me/api/portraits/men/22.jpg",
    attendees: [
      {
        id: "b",
        name: "Tom",
        photoURL: "https://randomuser.me/api/portraits/men/22.jpg"
      },
      {
        id: "a",
        name: "Bob",
        photoURL: "https://randomuser.me/api/portraits/men/20.jpg"
      }
    ]
  }
];

class EventDashboard extends Component {
  state = {
    events: eventsFromDashboard,
    isOpen: false,
    selectedEvent: null
  };

  //   handleIsOpenToggle = () => {
  //     //setState lets you access what the prev state was
  //     //this allows us to use have toggle like features
  //     //below isOpen is always set to the opposite of what the prevState was
  //     this.setState((prevState) => ({
  //       isOpen: !prevState.isOpen
  //     }));
  //   };

  handleCreateFormOpen = () => {
    this.setState({
      isOpen: true,
      selectedEvent: null
    });
  };

  handleFormCancel = () => {
    this.setState({
      isOpen: false
    });
  };

  handleCreateEvent = (newEvent) => {
    newEvent.id = cuid();
    newEvent.hostPhotoURL = "/assets/user.png";
    this.setState(({ events }) => ({
      events: [...events, newEvent],
      isOpen: false
    }));
    //events is destructured from prevState.events
    //we want to use the previous state to get the
    //events that were there in previously so that we can
    //add the new event properly
    // ... is a spread operator. This abpve line is
    //creating a new array where the this.state.events
    //is spread out i.e. in this case spread into its 2 events
    //and a third event, newEvent is added as well with a total of 3 events in the new array
  };

  handleSelectEvents = (event) => {
    this.setState({
      selectedEvent: event,
      isOpen: true
    });
  }; //this method is declared here but
  //we need to pass it to each evenListItem.
  //so we first send it to EventList which then sends it to
  //its child eventListItem where on clicking the button
  //this will be executed.

  handleUpdateEvent = (updatedEvent) => {
    this.setState(({ events }) => ({ //destructuring to get prevState events list
      events: events.map((event) => { //remember that .map returns something. In this case we're returning events list including the updated one
        if (event.id === updatedEvent.id) {
          return { ...updatedEvent }; //this will spread the updated event properties and return that as a new event in our events array instead of the existing event
        } else {
          return event;
        }
      }),
      isOpen: false,
      selectedEvent: null
    }));
  };

  handleDeleteEvent = id => {
      this.setState(({ events }) => ({
          events: events.filter(event => event.id !==  id) //filter through and give us events not equal to the id. So we're basically getting a new events array not including one with the id of selected event to delete.
          //filter allows us to specify a callback function inside here that  Returns the elements of an array that meet the condition specified in a callback function.
        //this creates a new array that we are gonna assign to our events in state
        }))
  }

  render() {
    const { events, isOpen, selectedEvent } = this.state;
    return (
      <Grid>
        <Grid.Column width={10}>
          <EventList events={events} selectEvent={this.handleSelectEvents} deleteEvent={this.handleDeleteEvent}/>
        </Grid.Column>
        <Grid.Column width={6}>
          <Button
            positive
            content="Create Event"
            onClick={this.handleCreateFormOpen}
          />
          {/*If isOpen true, then whatever is to the right of && will be executed */
          /*For our EventForm component, the key is used in order 
            to determine how react should re-render the EventForm component.
            If we did not pass a key, even if we receive an update in the props,
            the component does not re-render since the state does not change in EventForm.
            Using key, react creates a new component instance rather than updating the current one
             */}
          {isOpen && (
            <EventForm
              key={selectedEvent ? selectedEvent.id : 0}
              //we need this key in order
              selectedEvent={selectedEvent}
              createEvent={this.handleCreateEvent}
              cancelFormOpen={this.handleFormCancel}
              updateEvent={this.handleUpdateEvent}
            />
          )}
        </Grid.Column>
      </Grid>
    );
  }
}

export default EventDashboard;
