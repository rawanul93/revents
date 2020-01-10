import React from "react";
import PlacesAutocomplete from 'react-places-autocomplete';
import { Form, Label, Segment, List, ListItem, ListHeader, ListDescription } from "semantic-ui-react";

const PlaceInput = ({
  input: { value, onChange, onBlur },
  width,
  options,
  placeholder,
  onSelect,
  meta: { touched, error }
}) => {
  return  (
     <PlacesAutocomplete
        value={value}
        onChange={onChange}
        searchOptions={options}
        onSelect={onSelect}
     >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        //destructuring to get the props we get passed from PlacesAutocomplete. 
        //this is what we want the PlacesAutocomplete to render i.e. this is the render function.     
            <Form.Field error={touched && !!error}>
                <input placeholder={placeholder} {...getInputProps({placeholder, onBlur})}/>
                {/* spreading getInputProps over our input element allows us to pass props into it. We can specify which input props we want to be shown on the input element.  */}
                {touched && error && <Label basic color='red'>{error}</Label>} {/*adding the error label here*/}
                {suggestions.length > 0 && ( //this is what will be rendered when we type something into the input box. We will basically render a box showing the suggestions from which we can select one that will autofill the input.
                    <Segment style={{marginTop:0, position:'absolute', zIndex:1000, width:'100%' }}>                {/*first we're checking if there are any suggestions which is an array of objects with data we get from the google aps api*/}
                        {loading && <div>Loading...</div>} {/*if its loading, then show loading */}
                        <List selection>
                            {suggestions.map(suggestion => ( //mapping over each suggestion. For each ListItem we're passing in the props using ...getSuggestionProps to use for each suggestion. Which actually contains a key as well which we need since we're actually loopoing over.
                                <ListItem {...getSuggestionItemProps(suggestion)}> 
                                    <ListHeader>
                                        {suggestion.formattedSuggestion.mainText}
                                    </ListHeader>
                                    <ListDescription>
                                        {suggestion.formattedSuggestion.secondaryText}
                                    </ListDescription>
                                </ListItem>
                            
                            ))}
                        </List>
                    </Segment>             

                )}
            </Form.Field>

        )} 
     </PlacesAutocomplete>
  );
};

export default PlaceInput;
