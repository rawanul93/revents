import React from "react";
import { Grid, GridColumn } from "semantic-ui-react";
import SettingsNav from "./SettingsNav";
import { connect } from 'react-redux';
import { Route, Redirect, Switch } from "react-router-dom";
import BasicPage from "./BasicPage";
import AboutPage from "./AboutPage";
import PhotosPage from "./Photos/PhotosPage";
import AccountPage from "./AccountPage";
import { updatePassword } from "../../auth/authActions";
import { updateProfile } from "../userActions";

const actions = {
  updatePassword,
  updateProfile
}

const mapState = (state) => ({
  providerId: state.firebase.auth.providerData[0].providerId,
  user: state.firebase.profile //this is where all the user information is gonna be stored, which is the user Firestore document.
})


const SettingsDashboard = ({updatePassword, providerId, user, updateProfile}) => {
  return (
    <Grid>
      <GridColumn width={12}>
        <Switch> {/* this switch renders a route exclusively, i.e. we end up not renderig too many routes*/}
          <Redirect exact from="/settings" to="settings/basic" />{/*by default if route is settings, it goes to settings/basic */}
          <Route 
            path="/settings/basic" 
            render={() => <BasicPage initialValues={user} updateProfile={updateProfile}/>} //initialValues sets the initial value for the appropriate form fields accordingly. 
          /> 
          <Route 
            path="/settings/about"  
            render={() => <AboutPage initialValues={user} updateProfile={updateProfile} />}
          />
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
