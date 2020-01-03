import React, { Component } from "react";
import { Segment, Form, Button } from "semantic-ui-react";
import { connect } from "react-redux";
import { updateEvent, createEvent } from "../eventActions";
import cuid from "cuid"; //collision resistant ids. Its included in the package.json

//this is a controlled form where every input field
//has a local state and is monitored by react.
//the onChange is used to detect changes in the input field
//and to call the handleInputChange function to set the state accordingly.

const actions = {
  updateEvent,
  createEvent
};

const mapState = (state, ownProps) => {
  const eventId = ownProps.match.params.id;

  let event = {
    title: "",
    date: "",
    city: "",
    venue: "",
    hostedBy: ""
  };

  if (state.events.length > 0 && eventId) {
    event = state.events.find((event) => event.id === eventId);
  }
  return {
    event
  };
};

class EventForm extends Component {
  state = { ...this.props.event }; //getting event as props now because we're getting using mapState

  componentDidMount() {
    if (this.props.event !== null) {
      //state is set here ONLY if there is a selected event.
      this.setState({
        ...this.props.event
        //the spread operator here takes each element
        //in this.props.selectedEvent and spreads it
        //into the matching elemets in our state
        //i.e. title gets assigned title from selectedEvent now.
      });
    }
  }

  handleInputChange = ({ target: { name, value } }) => {
    //destructuring event.target to get event.target.name and value
    this.setState({
      [name]: value
      //the square brackets above allow us to access
      //whichever name we want inside the state object
      //the name we grap from the name of the input tags
    });
  };

  handleFormSubmit = (evt) => {
    evt.preventDefault();
    const { createEvent, updateEvent } = this.props;
    if (this.state.id) {
      updateEvent(this.state);
      this.props.history.push(`/events/${this.state.id}`);
    } else {
      const newEvent = {
        ...this.state, //copy our state
        id: cuid(),
        hostPhotoURL: "/assets/user.png"
      };
      createEvent(newEvent);
      this.props.history.push(`/events`);
    }

    //using this.state to update because this.state carries the updated info and not selectedEvent
  };

  render() {
    const { title, date, city, venue, hostedBy } = this.state;
    return (
      <Segment>
        <Form onSubmit={this.handleFormSubmit} autoComplete="off">
          <Form.Field>
            <label>Event Title</label>
            <input
              name="title"
              onChange={this.handleInputChange}
              value={title}
              placeholder="Event Title"
            />
          </Form.Field>
          <Form.Field>
            <label>Event Date</label>
            <input
              name="date"
              onChange={this.handleInputChange}
              value={date}
              type="date"
              placeholder="Event Date"
            />
          </Form.Field>
          <Form.Field>
            <label>City</label>
            <input
              name="city"
              onChange={this.handleInputChange}
              value={city}
              placeholder="City event is taking place"
            />
          </Form.Field>
          <Form.Field>
            <label>Venue</label>
            <input
              name="venue"
              onChange={this.handleInputChange}
              value={venue}
              placeholder="Enter the Venue of the event"
            />
          </Form.Field>
          <Form.Field>
            <label>Hosted By</label>
            <input
              name="hostedBy"
              onChange={this.handleInputChange}
              value={hostedBy}
              placeholder="Enter the name of person hosting"
            />
          </Form.Field>
          <Button positive type="submit">
            Submit
          </Button>

          <Button type="button" onClick={this.props.history.goBack}>
            {/*the history.goBack sends user back to where they came, either from eventDetailed page or from EventDashboard */}
            Cancel
          </Button>
        </Form>
      </Segment>
    );
  }
}

export default connect(mapState, actions)(EventForm);
