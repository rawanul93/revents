import React from "react";
import { differenceInYears } from "date-fns/esm";
import { Grid, Segment, Item, Header, Rail, Container } from "semantic-ui-react";
import LazyLoad from "react-lazyload";

const UserDetailedHeader = ({ profile, followerCount, followingCount }) => {
  let age;
  if (profile.dateOfBirth) {
    age = differenceInYears(Date.now(), profile.dateOfBirth.toDate());
  } else {
    age = "unknown age";
  }

  return (
    <Grid.Column width={16}>
      <Segment >
        <Container>
        <Item.Group>
          <Item>
            <LazyLoad  height={150} placeholder={ <Item.Image avatar size='small' src={"/assets/user/png"}/>}>
              <Item.Image
                avatar
                size="small"
                src={profile.photoURL || "/assets/user.png"}
              />
            </LazyLoad>

            <Item.Content verticalAlign="bottom">
              <Header size='huge' style={{fontSize:'40px'}}>{profile.displayName}</Header>
              <div style={{height: '20px'}}></div>
              {profile.occupation && (
                <Header as="h3">{profile.occupation}</Header>
              )}
              <br />
              <Header as="h4">
                {age}, Lives in {profile.city || "unknown city"}
              </Header>
            </Item.Content>
            
          </Item>

          <Rail attached internal position='right' >
              <Segment floated='right' style={{background: '#1cb5ad', border:'none', color:'white'}} textAlign='center'>
                <span style={{fontSize: '18px'}}>
                  Followers
                </span>
                <div style={{fontSize: '18px'}}>{followerCount}</div>
                <div style={{height: '20px'}}></div>
                <span style={{fontSize: '18px'}}>
                  Following
                </span>
                <div style={{fontSize: '18px'}}>{followingCount}</div>
              </Segment>
              
             
         
        </Rail>
          
        </Item.Group>
        

        </Container>
        
        
        
       
      </Segment>
   
    </Grid.Column>
    
  );
};

export default UserDetailedHeader;
