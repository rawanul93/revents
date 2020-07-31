import React, { Component, Fragment } from "react";
import EventListItem from "./EventListItem";
import InfiniteScroll from "react-infinite-scroller";

class EventList extends Component {
  render() {
    const { events, getNextEvents, loading, moreEvents} = this.props;
    return (
      <Fragment>
        {events && events.length !== 0 && (
          <InfiniteScroll pageStart={0} loadMore={getNextEvents} hasMore={!loading && moreEvents} initialLoad={false}> {/*loadMore is a callback for when more items are requested by the user i.e. theyre scrolling down.*/}
            {events &&
              events.map((event) => (
                <EventListItem key={event.id} event={event} />
              ))}
          </InfiniteScroll>
        )}
      </Fragment>
    );
  }
}

export default EventList;
