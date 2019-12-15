import React from 'react'
import { Segment, Container, Header, Image, Button, Icon } from 'semantic-ui-react';

const HomePage = ({ history }) => { //destructuring the history object from the props we get from react router
    return (
           <Segment inverted textAlign='center' vertical className='masthead'>
           <Container text>
             <Header as='h1' inverted>
               <Image
                 size='massive'
                 src='/assets/logo.png'
                 alt='logo'
                 style={{ marginBottom: 12 }}
               />
               Re-vents
             </Header> 
             <Button onClick={() => history.push('/events')} size='huge' inverted>
               Get started
               <Icon name='right arrow' inverted />
             </Button>
           </Container>
         </Segment>
    )
}

export default HomePage
