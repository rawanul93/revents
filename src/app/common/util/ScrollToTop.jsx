import { Component } from "react";
import { withRouter } from "react-router";

class ScrollToTop extends Component {
  componentDidUpdate(prevProps) {
      //componentDidUpdate is called not for the initial render, but when there is an update or if we change our location data
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }
  render() {
    return this.props.children;
    //all react components automatically has a prop called children
    //check index.js to see how we use it.
    //since we  wrap the app component with our ScrollToTop component
    //Its children is the app component itself and the children of app will automatically fall under this.
  }
}

export default withRouter(ScrollToTop);
