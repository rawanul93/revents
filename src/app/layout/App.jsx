import React, { Component, Fragment } from "react";
import EventDashboard from "../../features/event/eventDashboard/EventDashboard";
import NavBar from "../../features/nav/navBar/NavBar";
import { Container } from "semantic-ui-react";
import { Route } from "react-router-dom";
import HomePage from "../../features/home/HomePage";
import EventDetailedPage from "../../features/event/eventDetailed/EventDetailedPage";
import PeopleDashboard from "../../features/user/peopleDashboard/PeopleDashboard";
import UserDetailedPage from "../../features/user/userDetailed/UserDetailedPage";
import SettingsDashboard from "../../features/user/settings/SettingsDashboard";
import EventForm from "../../features/event/eventForm/EventForm";

//Fragment doesnt show up in our retunred HTML

class App extends Component {
  render() {
    return (
      // So we have 2 main routes, the first route is looking for an exact path such as the '/'
      // The second route looks for a '/' plus anything,
      <Fragment>
        <Route exact path='/' component={HomePage}></Route>
        <Route
          path='/(.+)'
          render={() => (
            <Fragment>
              <NavBar />
              <Container className="main">
                <Route path="/events" component={EventDashboard}></Route>
                <Route path="/events/:id" component={EventDetailedPage}></Route>
                <Route path="/people" component={PeopleDashboard}></Route>
                <Route path="/profile/:id" component={UserDetailedPage}></Route>
                <Route path="/settings" component={SettingsDashboard}></Route>
                <Route path="/createEvent" component={EventForm}></Route>
              </Container>
            </Fragment>
          )}
        ></Route>
      </Fragment>
    );
  }
}

export default App;
