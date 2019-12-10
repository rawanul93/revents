import React, { Component } from "react";
import { Segment, Form, Button } from "semantic-ui-react";

//this is a controlled form where every input field
//has a local state and is monitored by react.
//the onChange is used to detect changes in the input field
//and to call the handleInputChange function to set the state accordingly.
class EventForm extends Component {
  state = {
    title: "",
    date: "",
    city: "",
    venue: "",
    hostedBy: ""
  };


  handleInputChange = ({ target: { name, value } }) => {
    //destructuring event.target to get event.target.name and value
    this.setState({
      [name]: value
      //the square brackets above allow us to access
      //whichever name we want inside the state object
      //the name we grap from the name of the input tags
    });
  };

  handleFormSubmit = evt => {
    const { createEvent } = this.props;
    createEvent(this.state);
  };

  render() {
    const { cancelFormOpen } = this.props;
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
          <Button type="button" onClick={cancelFormOpen}>
            Cancel
          </Button>
        </Form>
      </Segment>
    );
  }
}

export default EventForm;
