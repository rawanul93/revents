import React from "react";
import { Form, Label } from "semantic-ui-react";


const TextInput = ({
  input, //this is a prop we get from redux forms which have props like onBlur on focus etc. We'll use the spred operator to pass on these props
  width,
  type,
  placeholder,
  meta: { touched, error } //we get this prop from redux forms
}) => {
  return (
      <Form.Field error={touched && !!error}>
        {/* display the error only if the Field is 'touched' 
        and the field is in an error state. The error props comes in as an object, so we need !! to turn it into a boolean.
        Also ...input is done because input itself has a lot of other props with it, which we're now passing on using ...input*/}
        <input {...input} placeholder={placeholder} type={type}/> {/* we're spreading the input properties we get from redux into the input properties of our semantic ui field form of */}
       
       {/*if the field is touched and there is an error, it will show the Label */}
        {touched && error && <Label basic color='red'>{error}</Label>}
      </Form.Field>
  );
};

export default TextInput;
