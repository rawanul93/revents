import React, { Component, Fragment } from "react";
import { Segment, Header, Comment } from "semantic-ui-react";
import EventDetailedChatForm from "./EventDetailedChatForm";
import { Link } from "react-router-dom";
import { formatDistance } from "date-fns"; //gives us how long ago a comment was made.

class EventDetailedChat extends Component {
  state = {
    showReplyForm: false,
    selectedCommentId: null //initially no comment is selected and only the main form remains open for making new comments
  };

  handleOpenReplyForm = (id) => () => {
    //giving our handleOpenReplyForm an id
    this.setState({
      showReplyForm: true,
      selectedCommentId: id //once the reply button is clicked, show the reply form and also set selectedComment id to the id of the comment to which the user wants to reply to.
    });
  };

  handleCloseReplyForm = () => {
    //we're gonna send this method down to our comment form for replies. Where once the reply is submitted this is executed and the form will then close
    this.setState({
      selectedCommentId: null,
      showReplyForm: false //
    });
  };

  render() {
    const { addEventComment, eventId, eventChat } = this.props;
    const { showReplyForm, selectedCommentId } = this.state;

    return (
      <Fragment>
        <Segment
          textAlign="center"
          attached="top"
          inverted
          color="teal"
          style={{ border: "none" }}
        >
          <Header>Chat about this event</Header>
        </Segment>
        <Segment attached>
          <Comment.Group>
            {eventChat &&
              eventChat.map((comment) => (
                <Comment key={comment.id}>
                  <Comment.Avatar
                    src={comment.photoURL || "/assets/user.png"}
                  />
                  <Comment.Content>
                    <Comment.Author as={Link} to={`/profile/${comment.uid}`}>
                      {comment.displayName}
                    </Comment.Author>
                    <Comment.Metadata>
                      <div>{formatDistance(comment.date, Date.now())}</div> {/*formatDistance is from date-fns. It gives us how long ago the comment was made */}
                    </Comment.Metadata>
                    <Comment.Text>{comment.text}</Comment.Text>
                    <Comment.Actions>
                      <Comment.Action
                        onClick={this.handleOpenReplyForm(comment.id)}
                      >
                        Reply
                      </Comment.Action>
                      {showReplyForm &&
                      selectedCommentId === comment.id && ( //only open the reply form for the comment with this comment id.
                          //the form component we render here is only for replies
                          <EventDetailedChatForm
                            addEventComment={addEventComment}
                            eventId={eventId}
                            form={`reply_${comment.id}`} //We want each reply to be identifyable uniquely so that when we click on the reply button, the reply form is open for that specific comment only and not all of them. It was all of them before because every comment/reply was creating a form component with one static name. So when we clicked on the reply button, couldnt distinguish for which comment we should open this form for. So now we'll name it dynamically.
                            closeForm={this.handleCloseReplyForm}
                            parentId={comment.id} //when we're replying to the original comment, the parentId will be that of the actual comment.
                          />
                        )}
                    </Comment.Actions>
                  </Comment.Content>
                  {comment.childNodes &&
                    comment.childNodes.map((child) => (
                      <Comment.Group key={child.id}>
                        <Comment>
                          <Comment.Avatar
                            src={child.photoURL || "/assets/user.png"}
                          />
                          <Comment.Content>
                            <Comment.Author
                              as={Link}
                              to={`/profile/${child.uid}`}
                            >
                              {child.displayName}
                            </Comment.Author>
                            <Comment.Metadata>
                              <div>
                                {formatDistance(child.date, Date.now())}
                              </div>
                            </Comment.Metadata>
                            <Comment.Text>{child.text}</Comment.Text>
                            <Comment.Actions>
                              <Comment.Action
                                onClick={this.handleOpenReplyForm(child.id)}
                              >
                                Reply
                              </Comment.Action>
                              {showReplyForm &&
                              selectedCommentId === child.id && ( //only open the reply form for the reply with this child id.
                                  //the form component we render here is only for replies
                                  <EventDetailedChatForm
                                    addEventComment={addEventComment}
                                    eventId={eventId}
                                    form={`reply_${child.id}`} //We want each reply to be identifyable uniquely so that when we click on the reply button, the reply form is open for that specific comment only and not all of them. It was all of them before because every comment/reply was creating a form component with one static name. So when we clicked on the reply button, couldnt distinguish for which comment we should open this form for. So now we'll name it dynamically.
                                    closeForm={this.handleCloseReplyForm}
                                    parentId={child.parentId} //when we are replying to another reply, the parentId for that will be the id of the reply we are relying to, which is the of the child's parent (the original comment)
                                  />
                                )}
                            </Comment.Actions>
                          </Comment.Content>
                        </Comment>
                      </Comment.Group>
                    ))}
                </Comment>
              ))
            }
          </Comment.Group>
          {/* the form component we render here is for the original comments and not the replies. So we give it a parent id of 0 which means its the parent itself  */}
          <EventDetailedChatForm
            addEventComment={addEventComment}
            eventId={eventId}
            form={"newComment"} //the form will be called newComment and thats is how we'll identify it for when a new comment is made versus when a reply is made.
            parentId={0} //for new comments there is no parent. So its 0.
          />
        </Segment>
      </Fragment>
    );
  }
}
export default EventDetailedChat;
