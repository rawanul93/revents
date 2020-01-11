import React, { Component } from "react";
import { connect } from "react-redux";
import { incrementAsync, decrementAsync } from "./testActions";
import { Button } from "semantic-ui-react";
import TestPlaceInput from "./TestPlaceInput";
import SimpleMap from "./SimpleMap";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { openModal } from "../modals/modalActions";

const mapState = (state) => ({
  //or mapStateToProps to get data from the state and into the component
  data: state.test.data, //because we're getting from our testReducer
  loading: state.async.loading, //because we're getting it from our asyncReducer.
  buttonName: state.async.elementName
});

const actions = {
  //or mapDispatchToProps to dispatch actions to the reducer and this affect the store
  //we'll pass these actions to the connect
  incrementAsync,
  decrementAsync,
  openModal
};

class TestComponent extends Component {
  state = {
    latlng: {
      lat: 59.95,
      lng: 30.33
    }
  };

  handleSelect = (address) => {
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        this.setState({
          latlng: latLng
        });
      })
      .catch((error) => console.error("Error", error));
  };

  render() {
    const {
      data,
      incrementAsync,
      decrementAsync,
      openModal,
      loading,
      buttonName
    } = this.props;
    return (
      <div>
        <h1>Test Component</h1>
        <h3>The answer is {data}</h3>
        <Button
          name="increment"
          loading={buttonName === 'increment' && loading}
          onClick={(e) => incrementAsync(e.target.name) }//gives us the name of the button and we'll use it to isolate the loading feature for the specific button that was clicked.
          positive
          content="Increment"
        />
        <Button
          name="decrement"
          loading={buttonName === 'decrement' && loading}
          onClick={(e) => decrementAsync(e.target.name)}
          negative
          content="Decrement"
        />
        <Button
          onClick={() => openModal("TestModal", { data: 42 })}
          color="teal"
          content="Open Modal"
        />
        <br />
        <TestPlaceInput selectAddress={this.handleSelect} />
        <SimpleMap key={this.state.latlng.lng} latlng={this.state.latlng} />
      </div>
    );
  }
}

export default connect(mapState, actions)(TestComponent);
//so when we connect, the mapState function is gonna be called which will get our state from the store.
