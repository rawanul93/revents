import React, { Component } from "react";
import { Grid, Button } from "semantic-ui-react";
import EventList from "../eventList/EventList";
import EventForm from "../eventForm/EventForm";
import cuid from "cuid"; //collision resistant ids. Its included in the package.json

const eventsFromDashboard = [
  {
    id: "1",
    title: "Trip to Tower of London",
    date: "2018-03-27T11:00:00+00:00",
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
    date: "2018-03-28T14:00:00+00:00",
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
    isOpen: false
  };

  handleIsOpenToggle = () => {
    //setState lets you access what the prev state was
    //this allows us to use have toggle like features
    //below isOpen is always set to the opposite of what the prevState was
    this.setState((prevState) => ({
      isOpen: !prevState.isOpen
    }));
  };

  handleCreateEvent = (newEvent) => {
    newEvent.id = cuid();
    newEvent.hostPhotoURL = "/assets/user.png";
    this.setState(({ events }) => ({
      //events is destructured from prevState.events
      //we want to use the previous state to get the
      //events that were there in previously so that we can
      //add the new event properly
      events: [...events, newEvent],
      isOpen:false
    }));
    // ... is a spread operator. This abpve line is
    //creating a new array where the this.state.events
    //is spread out i.e. in this case spread into its 2 events
    //and a third event, newEvent is added as well with a total of 3 events in the new array
  };

  render() {
    const { events, isOpen } = this.state;
    return (
      <Grid>
        <Grid.Column width={10}>
          <EventList events={events} />
        </Grid.Column>
        <Grid.Column width={6}>
          <Button
            positive
            content="Create Event"
            onClick={this.handleIsOpenToggle}
          />
          {isOpen && (
            <EventForm
              createEvent={this.handleCreateEvent}
              cancelFormOpen={this.handleIsOpenToggle}
            />
          ) /* if isOpen true, then whatever is to the right of && will be executed*/}
        </Grid.Column>
      </Grid>
    );
  }
}

export default EventDashboard;
