import React from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';

class TestPlaceInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      address: '',
      latLng:{}
     };
  }

  handleChange = address => {
    this.setState({ address });
  };

  render() {
    const { selectAddress } = this.props;
    return (
      <div>
      <PlacesAutocomplete
        value={this.state.address}
        onChange={this.handleChange}
        onSelect={selectAddress}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input
              {...getInputProps({
                placeholder: 'Search Places ...',
                className: 'location-search-input',
              })}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? 'suggestion-item--active'
                  : 'suggestion-item';
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                  : { backgroundColor: '#ffffff', cursor: 'pointer' };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
      </div>
    );
  }

}

export default TestPlaceInput;