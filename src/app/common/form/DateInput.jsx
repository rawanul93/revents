import React from "react";
import { Form, Label } from "semantic-ui-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css" //Getting the styling for the datepicker directly and having it in the component itself.

const DateInput = ({
  input, //The only properties from the input we're passing onto DatePicker is the input.value and the onChange. If we wanted to pass everything, we'd just use the spread ooperator.
  width,
  placeholder,
  meta: { error, touched },
  ...rest //we dont have to manually type in the names of all the properties we pass onto here.
  //So if we want to add additional properties to this, we're using a spread operator and just call them rest and this will contain the rest of the properties that we pass to our data input component.
}) => {
  return (
    <Form.Field error={touched && !!error}>
      <DatePicker 
      {...rest} //assigning every other property except the ones we exclusively destructured.
      placeholderText={placeholder}
      selected={input.value ? new Date(input.value) : null} //This is for when we select a date.  If we dont then the value is null. We also need to turn the date we get from the input.value into Javascript Date first for DatePicker to work with. 
      onChange={input.onChange}
      onBlur={input.onBlur} //lets you know if the user has clicked in or out of the field.
      onChangeRaw={(e) => e.preventDefault()} //its executed when a user types into the field. This makes sure you cant type into the field which we dont want since its a datepicker.
      />
    {touched && error && <Label basic color='red'>{error}</Label>}
    </Form.Field>
  );
};

export default DateInput;
