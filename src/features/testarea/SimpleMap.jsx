import React, { Component } from "react";
import GoogleMapReact from "google-map-react";
import { Icon } from "semantic-ui-react";

const AnyReactComponent = () => <Icon name="marker" size="big" color="red" />;

class SimpleMap extends Component  {  
  static defaultProps = {
    zoom: 15
  };

// constructor(props) {
//     super(props);
//     this.state = { 
//       center: {
//         lat: props.lat,
//         lng: props.lng
//       }
     
//      };
//   }

  render() {
      const { latlng } = this.props;
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: "300px", width: "100%" }}>
        <GoogleMapReact
          bootstrapURLKeys={{
            key: "AIzaSyBKchHmytuZUI6hbTZ0dGgy0Ttu4S8HWOg" /* YOUR KEY HERE */
          }}
          defaultCenter={latlng}
          defaultZoom={this.props.zoom}
        >
            {console.log(this.state)}
          <AnyReactComponent lat={latlng.lat} lng={latlng.lng} />
        </GoogleMapReact>
      </div>
    );
  }
}

export default SimpleMap;
