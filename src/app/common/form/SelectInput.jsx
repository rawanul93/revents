import React from "react";
import { Form, Label, Select } from "semantic-ui-react";

const SelectInput = ({
  input,
  type,
  placeholder,
  multiple,
  options,
  meta: { touched, error }
}) => {
  return (
      <Form.Field error={touched && !!error}>
         <Select
            value={input.value || null /*overwriting the value. Will either be input value or null */}
            onChange={(e, data) => input.onChange(data.value)/* e represents the event and the data represents the selected item from the dropdown list */}
            placeholder={placeholder}
            options={options}
            multiple={multiple}
         />
        {touched && error && <Label basic color='red'>{error}</Label>}
 
      </Form.Field>
  );
};

export default SelectInput;
