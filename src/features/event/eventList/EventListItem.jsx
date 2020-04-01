import React, { Component } from "react";
import { Segment, Item, Icon, List, Button, Label } from "semantic-ui-react";
import EventListAttendee from "./EventListAttendee";
import { Link } from "react-router-dom";
import { format } from 'date-fns';
import { objectToArray } from "../../../app/common/util/helpers";

class EventListItem extends Component {
  render() {
    const { event } = this.props;
    return (
      <Segment.Group>
        <Segment>
          <Item.Group>
            <Item>
              <Item.Image size="tiny" circular src={event.hostPhotoURL} />
              <Item.Content>
                <Item.Header as={Link} to={`/events/${event.id}`}>{event.title}</Item.Header>
                <Item.Description >Hosted by <Link to={`/profile/${event.hostUid}`}> {event.hostedBy}</Link> </Item.Description>
                {event.cancelled &&
                  <Label style={{top: '-40px'}} 
                  ribbon='right' 
                  color='red' 
                  content='This event has been cancelled' />
                }
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
              objectToArray(event.attendees).map((attendee) => ( //object.values to conver an object to its subsequent array.
                <EventListAttendee key={attendee.id} attendee={attendee} /> //we're passing in the index of the array to use as the key since our attendees dont have keys anymore
              ))}
          </List>
        </Segment>
        <Segment clearing>
          <span>{event.description}</span>
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
