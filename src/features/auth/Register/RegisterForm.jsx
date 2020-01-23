import React from 'react';
import { connect } from 'react-redux';
import { Form, Segment, Button, Label, Divider } from 'semantic-ui-react';
import { Field, reduxForm } from 'redux-form';
import { combineValidators, isRequired } from 'revalidate';
import TextInput from '../../../app/common/form/TextInput';
import { registerUser, socialLogin } from '../authActions';
import SocialLogin from '../SocialLogin/SocialLogin';


const actions = {
  registerUser,
  socialLogin
}

const validate =  combineValidators ({
  displayName: isRequired('display name'),
  email: isRequired('email'),
  password: isRequired('password')
})


const RegisterForm = ({handleSubmit, registerUser, error, invalid, submitting}) => { //handleSubmit is a prop er get from redux forms 
  return (
    <div>
      <Form size="large" autoComplete='off' onSubmit={handleSubmit(registerUser)}> {/*handleSubmit helps us pass in what we enter into the form, to our registerUser action. Therefore our registerUser action is getting an object with all the info entered in this form. */}
        <Segment>
          <Field
            name="displayName"
            type="text"
            component={TextInput}
            placeholder="Known As"
          />
          <Field
            name="email"
            type="text"
            component={TextInput}
            placeholder="Email"
          />
          <Field
            name="password"
            type="password"
            component={TextInput}
            placeholder="Password"
          />
          {error && <Label basic color='red'>{error}</Label>}
          {/*we need to handle firebase related errors exclusively. The isRequired validation is covered by our TextInput components, but we need to handle the firebase errors separately*/}
          <Button disable={invalid || submitting} fluid size="large" color="teal">
            Register
          </Button>
          <Divider horizontal >Or</Divider>
        <SocialLogin socialLogin={socialLogin}/>
        </Segment>
      </Form>
    </div>
  );
};

export default connect(null, actions)(reduxForm({form:'registerForm', validate})(RegisterForm));