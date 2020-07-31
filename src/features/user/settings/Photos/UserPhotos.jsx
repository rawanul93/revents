import React, { Fragment } from "react";
import { Header, Card, Image, Button } from "semantic-ui-react";

const UserPhotos = ({ photos, profile, deletePhoto, setMainPhoto }) => {
    let filteredPhotos;
    if (photos) { //if there are any photos already in the user's collection photos.
       filteredPhotos = photos.filter(photo => {
           return photo.url !== profile.photoURL //filter out all the photos that are NOT the main photo. We use the profile because we always keep it updated.
       }) 
    }
  return (
    <Fragment>
      <Header sub color="teal" content="All Photos" />
      <Card.Group itemsPerRow={5}>
        <Card>
          <Image src={profile.photoURL || '/assets/user.png'} />
          <Button positive>Main Photo</Button>
        </Card>

        {photos && //we displayed the main photo with the above code. Now we're gonna display all the other photos.
          filteredPhotos.map((photo) => (
            <Card key={photo.id}>
              <Image src={photo.url} />
              <div className='ui two buttons'>
                  <Button onClick={() => setMainPhoto(photo)} positive>Main Photo</Button>
                  <Button onClick={() => deletePhoto(photo)} basic icon='trash' color='red'/>
              </div>
            </Card>
          ))}
      </Card.Group>
    </Fragment>
  );
};

export default UserPhotos;
