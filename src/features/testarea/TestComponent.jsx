import React, { Component } from "react";
import { connect } from 'react-redux';
import { incrementCounter, decrementCounter } from './testActions'
import { Button } from "semantic-ui-react";

const mapState = (state) => ({//or mapStateToProps to get data from the state and into the component
    data: state.test.data //because we called that reducer test
}) 

const actions = { //or mapDispatchToProps to dispatch actions to the reducer and this affect the store
    //we'll pass these actions to the connect
    incrementCounter,
    decrementCounter
}

class TestComponent extends Component {
  render() {
    const {data, incrementCounter, decrementCounter } = this.props;
    return(
        <div>
            <h1>Test Component</h1>
            <h3>The answer is {data}</h3>
            <Button onClick={incrementCounter} positive content='Increment'/>
            <Button onClick={decrementCounter} negative content='Decrement'/>
        </div>   
    ) 
  }
}

export default connect(mapState, actions)(TestComponent);
//so when we connect, the mapState function is gonna be called which will get our state from the store.
