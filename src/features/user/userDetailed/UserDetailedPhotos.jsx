import React from 'react'
import { Grid, Segment, Header, Image } from 'semantic-ui-react';
import LazyLoad from 'react-lazyload';
import { Link } from 'react-router-dom';

const UserDetailedPhotos = ({photos}) => {
    return (
        <Grid.Column width={12}>
          <Segment attached>
            <Header as={Link} to={'/settings/photos'} content='Photos' icon='image' />
            <br/>
            <Image.Group size="small">
                {photos && photos.map(photo => ( //we add the key in lazyload because thats what we are primarily looping
                  <LazyLoad key={photo.id} height={150} placeholder={ <Image src={"/assets/user/png"}/>}> 
                     <Image src={photo.url}/>
                  </LazyLoad>
                   
                ))}
             
            </Image.Group>
          </Segment>
        </Grid.Column>
    )
} 

export default UserDetailedPhotos
