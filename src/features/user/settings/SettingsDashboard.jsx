import React from "react";
import { Grid, GridColumn } from "semantic-ui-react";
import SettingsNav from "./SettingsNav";
import { connect } from 'react-redux';
import { Route, Redirect, Switch } from "react-router-dom";
import BasicPage from "./BasicPage";
import AboutPage from "./AboutPage";
import PhotosPage from "./PhotosPage";
import AccountPage from "./AccountPage";
import { updatePassword } from "../../auth/authActions";

const actions = {
  updatePassword
}

const mapState = (state) => ({
  providerId: state.firebase.auth.providerData[0].providerId
})


const SettingsDashboard = ({updatePassword, providerId}) => {
  return (
    <Grid>
      <GridColumn width={12}>
        <Switch> {/* this switch renders a route exclusively, i.e. we end up not renderig too many routes*/}
          <Redirect exact from="/settings" to="settings/basic" />{/*by default if route is settings, it goes to settings/basic */}
          <Route path="/settings/basic" component={BasicPage} />
          <Route path="/settings/about" component={AboutPage} />
          <Route path="/settings/photos" component={PhotosPage} />
          <Route 
            path="/settings/account" 
            render={() => <AccountPage updatePassword={updatePassword} providerId={providerId}/>} //since we're passing in props to AccountPage which is inside a Route. We need to do it through a render method with an arrow function like this.
          />
        </Switch>
      </GridColumn>
      <GridColumn width={4}>
        <SettingsNav />
      </GridColumn>
    </Grid>
  );
};

export default connect(mapState, actions)(SettingsDashboard);
