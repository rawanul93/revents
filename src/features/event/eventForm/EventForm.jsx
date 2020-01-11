/*global google*/
import React, { Component } from "react";
import { Segment, Form, Button, Grid, Header } from "semantic-ui-react";
import { reduxForm, Field } from "redux-form";
import { connect } from "react-redux";
import { updateEvent, createEvent } from "../eventActions";
import { composeValidators, combineValidators, isRequired, hasLengthGreaterThan } from 'revalidate';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import cuid from "cuid"; //collision resistant ids. Its included in the package.json
import TextInput from "../../../app/common/form/TextInput";
import TextArea from "../../../app/common/form/TextArea";
import SelectInput from "../../../app/common/form/SelectInput";
import DateInput from "../../../app/common/form/DateInput";
import PlaceInput from "../../../app/common/form/PlaceInput";

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

  let event = {};

  if (state.events.length > 0 && eventId) {
    event = state.events.find((event) => event.id === eventId);
  }
  return {
    initialValues: event //will get as props
    //initialValues prop helps initialize the form data
  };
};

const validate = combineValidators({
  title: isRequired({message: 'The event title is required'}),
  category: isRequired({message: 'The category is required'}),
  description: composeValidators(
    isRequired({message:'Please enter a description'}),
    hasLengthGreaterThan(4)({message: 'Description needs to be at least 5 characters'})
  )(),
  city: isRequired('city'),
  venue: isRequired('venue'),
  date: isRequired('date')

})

const category = [
  { key: "drinks", text: "Drinks", value: "drinks" },
  { key: "culture", text: "Culture", value: "culture" },
  { key: "film", text: "Film", value: "film" },
  { key: "food", text: "Food", value: "food" },
  { key: "music", text: "Music", value: "music" },
  { key: "travel", text: "Travel", value: "travel" }
];



class EventForm extends Component {
  //state = { ...this.props.event }; //getting event as props now because we're getting using mapState
  // componentDidMount() {
  //   if (this.props.event !== null) {
  //     //state is set here ONLY if there is a selected event.
  //     this.setState({
  //       ...this.props.event
  //       //the spread operator here takes each element
  //       //in this.props.selectedEvent and spreads it
  //       //into the matching elemets in our state
  //       //i.e. title gets assigned title from selectedEvent now.
  //     });
  //   }
  // }

  // handleInputChange = ({ target: { name, value } }) => {
  //   //destructuring event.target to get event.target.name and value
  //   this.setState({
  //     [name]: value
  //     //the square brackets above allow us to access
  //     //whichever name we want inside the state object
  //     //the name we grap from the name of the input tags
  //   });
  // };

  state = { //Local state just to store the city and venue lat and long in order to narrow down search results.
    cityLatLng: {},
    venueLatLng: {}
  }

  handleCitySelect = selectedCity => {
    geocodeByAddress(selectedCity)
    .then(results => getLatLng(results[0])) //since results returns an array and we just wanna specify to get the first element and not in array form.
    .then(latlng => {
      this.setState({
        cityLatLng: latlng
      })
    })
    .then(() => { //arrow function, so that it only runs when something is selected and not when just rendering.
      this.props.change('city', selectedCity) //change is a redux method
    })
  }

  handleVenueSelect = selectedVenue => {
    geocodeByAddress(selectedVenue)
    .then(results => getLatLng(results[0])) //since results returns an array and we just wanna specify to get the first element and not in array form.
    .then(latlng => {
      this.setState({
        venueLatLng: latlng
      })
    })
    .then(() => { //arrow function, so that it only runs when something is selected and not when just rendering.
      this.props.change('venue', selectedVenue) //change is a redux method
    })
  }

  onFormSubmit = (values) => {
    // values.venueLatLng = this.state.venueLatLng;
    //values will have all the things we enter in our form.
    const { createEvent, updateEvent, initialValues } = this.props;
    if (initialValues.id) {
      if(initialValues.venueLatLng !== this.state.venueLatLng) {
        values.venueLatLng = this.state.venueLatLng;
      }
      updateEvent(values);
      this.props.history.push(`/events/${initialValues.id}`); //go to event detailed page
    } else {
      values.venueLatLng = this.state.venueLatLng; //copying the venueLatLng from state to the event itself.
      const newEvent = {
        ...values, //copy the data we got from the form
        id: cuid(),
        hostPhotoURL: "/assets/user.png",
        attendees:[]
      };
      createEvent(newEvent);
      this.props.history.push(`/events/${newEvent.id}`);
    }
    //using this.state to update because this.state carries the updated info and not selectedEvent
  };


  render() {
    const { history, initialValues, invalid, submitting, pristine } = this.props;
    return (
      <Grid>
        <Grid.Column width={10}>
          <Segment>
            <Header sub color="teal" content="Event Details" />
            <Form
              onSubmit={this.props.handleSubmit(this.onFormSubmit)}
              autoComplete="off"
            >
              <Field
                name="title"
                component={TextInput}
                placeholder="Give your event a name"
              />
              <Field
                name="category"
                component={SelectInput}
                placeholder="What is your event about?"
                options={category}
              />
              <Field
                name="description"
                component={TextArea}
                placeholder="Tell us about your event"
                rows={3}
              />

              <Header sub color="teal" content="Event location details" />
              <Field
                name="city"
                component={PlaceInput}
                options={{types:['(cities)']}}
                onSelect={this.handleCitySelect}
                placeholder="Event City"
              />
              <Field
                name="venue"
                component={PlaceInput}
                options={{
                  location: new google.maps.LatLng(this.state.cityLatLng), //normally google.maps shows an error of saying its undefined. So we used /*global google*/ at the very top of this file before the imports to get rid of that warning.

                  radius: 1000,
                  types: ['establishment']
                }}
                onSelect={this.handleVenueSelect}
                placeholder="Event Venue"
              />
              <Field
                name="date"
                component={DateInput}
                placeholder="Event Date"
                dateFormat='dd LLL yyyy h:mm a' //date, month in 3 letters, year 4 digit, hour:mins and am/pm. This is passed through to DatePicker with ...rest
                showTimeSelect //user can select time with timepicker
                timeFormat= 'HH:mm' //24hr timepicker
              />

              <Button disabled={invalid || submitting || pristine} positive type="submit">
                Submit
              </Button>

              <Button
                type="button"
                onClick={
                  initialValues.id
                    ? () => history.push(`/events/${initialValues.id}`) 
                    : () => history.push(`/events`)
                    //we're using arrow functions because we only want this to get executed only when the click occurs, not when loading the form
                    //if theres initialValues.id that means user accessed it from manage event and hence upon cancel will be routed back to the respective event page
                    //if not then go back to the events list page
                }
              >
                {/*the history.goBack sends user back to where they came, either from eventDetailed page or from EventDashboard */}
                Cancel
              </Button>
            </Form>
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}

export default connect(
  mapState,
  actions
)(reduxForm({ form: "eventForm", validate})(EventForm));
//The ordering has to be done like that because we’re now saying reduxForm takes 2 parameters;
//a config with validate and form  name eventForm and 2nd param the EventForm component itself. Then that whole thing is passed as a parameter to connect.
