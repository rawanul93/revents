import React, { Component } from "react";
import { Segment, Item, Icon, List, Button } from "semantic-ui-react";
import EventListAttendee from "./EventListAttendee";
import { Link } from "react-router-dom";
import { format, parseISO } from 'date-fns';

class EventListItem extends Component {
  render() {
    const { event, deleteEvent } = this.props;
    return (
      <Segment.Group>
        <Segment>
          <Item.Group>
            <Item>
              <Item.Image size="tiny" circular src={event.hostPhotoURL} />
              <Item.Content>
                <Item.Header>{event.title}</Item.Header>
                <Item.Description>Hosted by {event.hostedBy}</Item.Description>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
        <Segment>
          <span>
            <Icon name='clock' /> {format(event.date.toDate(), 'EEEE do LLL')} at
            {format(event.date.toDate(), 'h:mm a')}| {/* toDate() is a function provided by firebase and it converts timestamps to javascript dates*/}
            <Icon name="marker" /> {event.venue}
          </span>
        </Segment>
        <Segment secondary>
          {/*colours it different */}
          <List horizontal>
            {/*check of event has attenddes or not. Otherwise the code wont run */}
            {event.attendees && //making sure if we have attendees or not
              Object.values(event.attendees).map((attendee) => ( //object.values to conver an object to its subsequent array.
                <EventListAttendee key={attendee.id} attendee={attendee} />
              ))}
          </List>
        </Segment>
        <Segment clearing>
          <span>{event.description}</span>
          <Button
            onClick={() => deleteEvent(event.id)}/* doing it this way allows us to call the function ONLY if button is clicked*/
            color="red"
            floated="right"
            content="Delete"
          />
          <Button
            // onClick={() => selectEvent(event)}/* doing it this way allows us to call the function ONLY if button is clicked*/
            as={Link}
            to={`/events/${event.id}`}
            color="teal"
            floated="right"
            content="View"
          />
        </Segment>
      </Segment.Group>
    );
  }
}

export default EventListItem;
