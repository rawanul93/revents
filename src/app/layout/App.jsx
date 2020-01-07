import React, { Component, Fragment } from "react";
import EventDashboard from "../../features/event/eventDashboard/EventDashboard";
import NavBar from "../../features/nav/navBar/NavBar";
import { Container } from "semantic-ui-react";
import { Route, Switch, withRouter } from "react-router-dom";
import HomePage from "../../features/home/HomePage";
import EventDetailedPage from "../../features/event/eventDetailed/EventDetailedPage";
import PeopleDashboard from "../../features/user/peopleDashboard/PeopleDashboard";
import UserDetailedPage from "../../features/user/userDetailed/UserDetailedPage";
import SettingsDashboard from "../../features/user/settings/SettingsDashboard";
import EventForm from "../../features/event/eventForm/EventForm";
import TestComponent from "../../features/testarea/TestComponent";

//Fragment doesnt show up in our retunred HTML

class App extends Component {
  render() {
    return (
      // So we have 2 main routes, the first route is looking for an exact path such as the '/'
      // The second route looks for a '/' plus anything,
      <Fragment>
        <Route exact path='/' component={HomePage}></Route>
        {/*we use exact path because Router would route to Homepage even if we wanted to go
        to /events or  /anything because the top one holds most priority.
        Therefore we need to say 'exact' so that homepage is routed when the path is exactly '/' and not '/+anything else'*/}
        <Route
          path='/(.+)'
          render={() => (
            <Fragment>
              <NavBar />
              <Container className="main">
                <Switch key={this.props.location.key}> {/*each location has its own key
                and we need this we want the components to rerender properly through unique keys 
                because otherwise when we click createEvent while EventForm is open through manageEvent, it doesnt rerender the form.*/}
                  <Route exact path="/events" component={EventDashboard}></Route> 
                  <Route path="/events/:id" component={EventDetailedPage}></Route>
                  <Route path="/people" component={PeopleDashboard}></Route>
                  <Route path="/profile/:id" component={UserDetailedPage}></Route>
                  <Route path="/settings" component={SettingsDashboard}></Route>
                  <Route path={["/createEvent", "/manage/:id"]} component={EventForm}></Route>
                  {/*with react router 5, we can now pass in arrays as the path, so both the above code will open up EventForm. But since they both have different key, t will be rendered accordingly */}
                  <Route path="/test" component={TestComponent}></Route>
                </Switch>

              </Container>
            </Fragment>
          )}
        ></Route>
      </Fragment>
    );
  }
}

export default withRouter(App);//so that app has router properties we can use for getting key location for Switch
