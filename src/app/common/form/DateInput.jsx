import React from "react";
import { Form, Label } from "semantic-ui-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css" //Getting the styling for the datepicker directly and having it in the component itself.


const DateInput = ({
  input: {value, onChange, onBlur}, //The only properties from the input we're passing onto DatePicker is the input.value, onChange and onBlur. If we wanted to pass everything, we'd just use the spread ooperator.
  width,
  placeholder,
  meta: { error, touched },
  ...rest //we dont have to manually type in the names of all the properties we pass onto here.
  //So if we want to add additional properties to this, we're using a spread operator and just call them rest and this will contain the rest of the properties that we pass to our data input component.
}) => {
  return (
    <Form.Field error={touched && !!error}>
      <DatePicker 
      {...rest} //assigning every other property except the ones we exclusively destructured. Has props we're passing in like dateFormat, timeFormat and showTimeSelect.
      placeholderText={placeholder}
      //selected={input.value ? new Date(input.value) : null} //This is for when we select a date.  If we dont then the value is null. We also need to turn the date we get from the input.value into Javascript Date first for DatePicker to work with. 
     
      selected={ 
          value //first we see if we have a value, if we do, then we execute the next line.
          ? (Object.prototype.toString.call(value) !== '[object Date]')  //we check if value of the input date is a javascript date object or not. If not, then we convert it to a js date by executing the next line. 
            ? value.toDate() //this is executed if the above is true i.e. the date value is NOT a js date, so we convert it to one.
            : value //if it IS a js date, then we just pass in the actual value
            : null  //if there isnt any value at all, we pass in null.
      }
      onChange={onChange}//onChange we get from redux form is being set to the onChange we gotta set for reactDatePicker
      onBlur={(e, value) => onBlur(value)} //onBlur lets you know if the user has clicked in or out of the field. But there is a bug with onBlur where choosing a date and then clicking out of the field doesnt register the date as a js date and converts to a string. So we'll pass it the reduxForms input.onBlur which handles this properly.
      onChangeRaw={(e) => e.preventDefault()} //its executed when a user types into the field. This makes sure you cant type into the field which we dont want since its a datepicker.
      />
    {touched && error && <Label basic color='red'>{error}</Label>}
    </Form.Field>
  );
};

export default DateInput;
