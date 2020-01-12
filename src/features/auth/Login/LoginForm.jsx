import React from "react";
import { Form, Segment, Button } from "semantic-ui-react";
import { Field, reduxForm } from "redux-form";
import TextInput from "../../../app/common/form/TextInput";
import { login } from "../authActions";
import { connect } from "react-redux";

const actions = {
  login
};

const LoginForm = ({ login, handleSubmit }) => {
  //we have handleSubmit as a part of the redux props
  //we'll do handleSubmit(login) i.e. were passing in what we add in the login form to the action login.
  //login action therefore is receiving what we're adding in the form and thats what we defined as 'creds' in our authReducer
  return (
    <Form error size="large" onSubmit={handleSubmit(login)} autoComplete="off">
      <Segment>
        <Field
          name="email"
          component={TextInput}
          type="text"
          placeholder="Email Address"
        />
        <Field
          name="password"
          component={TextInput}
          type="password"
          placeholder="password"
        />
        <Button fluid size="large" color="teal">
          Login
        </Button>
      </Segment>
    </Form>
  );
};

export default connect(
  null,
  actions
)(reduxForm({ form: "loginForm" })(LoginForm));
