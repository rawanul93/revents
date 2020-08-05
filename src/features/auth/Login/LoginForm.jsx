import React from "react";
import { Form, Segment, Button, Label, Divider } from "semantic-ui-react";
import { Field, reduxForm } from "redux-form";
import TextInput from "../../../app/common/form/TextInput";
import { login, socialLogin } from "../authActions";
import { connect } from "react-redux";
import SocialLogin from "../SocialLogin/SocialLogin";



const actions = {
  login,
  socialLogin
};

const LoginForm = ({ login, handleSubmit, error, socialLogin, submitting }) => { //submitting is from redux forms
  //we have handleSubmit as a part of the redux props
  //we'll do handleSubmit(login) i.e. were passing in what we add in the login form to the action login.
  //login action therefore is receiving what we're adding in the form and thats what we defined as 'creds' in our authReducer.
  //we also get error as a prop from redux forms which contains the error we throw using SubmissionError() method in login action in authActions.
  return (
    <Form error size="large" onSubmit={handleSubmit(login)}>
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
        {error && <Label basic color='red'>{error}</Label>}
        <Button fluid size="large" color="teal" loading={submitting}>
          Login
        </Button>
        <Divider horizontal >Or</Divider>
        <SocialLogin socialLogin={socialLogin}/>
      </Segment>
    </Form>
  );
};

export default connect(
  null,
  actions
)(reduxForm({ form: "loginForm" })(LoginForm));
