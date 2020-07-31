import React, { useState, useEffect, Fragment } from "react"; //useEffect will run after the render is commited to the screen.
import { connect } from "react-redux";
import { compose } from "redux"; //lets us write higher order components in a downwards fashion so that it look neater.
import { firestoreConnect } from "react-redux-firebase"; //so we need this to load data from our firestore into our firestore reducer. We use this to access the data from firestore in here withhout wanting to actually manipulate that data in any way.
import { Segment, Header, Divider, Grid, Button } from "semantic-ui-react";
import DropzoneInput from "./DropzoneInput";
import CropperInput from "./CropperInput";
import {
  uploadProfileImage,
  deletePhoto,
  setMainPhoto
} from "../../userActions";
import { toastr } from "react-redux-toastr";
import UserPhotos from "./UserPhotos";

const query = ({ auth }) => { //need to get the auth to know which user is currently using this.
  return [
    //thats just how its done using a an array with an object in it. Check EventDashboard component where the path is simple enough that we dont need an extra function to simplify the code.
    {
      collection: "users",
      doc: auth.uid,
      subcollections: [{ collection: "photos" }],
      storeAs: "photos" //thats how we're gonna store it in our reducer.
    }
  ];
};

const actions = {
  uploadProfileImage,
  deletePhoto,
  setMainPhoto
};

const mapState = (state) => ({
  auth: state.firebase.auth,
  profile: state.firebase.profile, //we need to get the user's photoURL that is in his main photo.
  photos: state.firestore.ordered.photos, //this photos is what we'er getting from firestoreConnect.
  loading: state.async.loading
});

const PhotosPage = ({
  uploadProfileImage,
  deletePhoto,
  setMainPhoto,
  photos,
  profile,
  loading
}) => {
  const [files, setFiles] = useState([]); //state is files and setFiles sets that state to whatever we want. Initial state we assign it is an empty array. Even though we limit users to drop multiple files, we'll still receive single files as an array.
  const [image, setImage] = useState(null); //store cropped image as a blob.

  useEffect(() => { //this will run after the render is completed to the screen.
    return () => {   
      
      files.forEach((file) => {
        URL.revokeObjectURL(file.preview)}); //clean up the preview object that was created.
    };
  }); //to avoid the dependancy warning.

  const handleUploadImage = async () => {
    //async method because it may take some time to execute this.
    try {
      console.log(files);
      await uploadProfileImage(image, files[0].name); //the name is the actual name of the file that we have uploaded.
      handleCancelCrop(); //clear the images from the user's screen.
      toastr.success("Success!", "Photo has been uploaded");
    } catch (error) {
      console.log(error);
      toastr.error("Oops!", "Something went wrong");
    }
  };

  const handleCancelCrop = () => { //need to reset the state once the upload is done.
    setFiles([]);
    setImage(null);
  };

  const handleDeletePhoto = async (photo) => {
    try {
      await deletePhoto(photo);
      toastr.success("Success!", "Photo has been deleted");
    } catch (error) {
      console.log(error);
      toastr.error("Oops!", error.message);
    }
  };

  const handleSetMainPhoto = async (photo) => {
    try {
      await setMainPhoto(photo);
    } catch (error) {
      console.log(error);
      toastr.error("Oops!", error.message);
    }
  };
  
  return (
    
    <Segment>
      <Header dividing size="large" content="Your Photos" />
      <Grid>
        <Grid.Row />
        <Grid.Column width={4}>
          <Header color="teal" sub content="Step 1 - Add Photo" />
          <DropzoneInput setFiles={setFiles} />
        </Grid.Column>
        <Grid.Column width={1} />
        <Grid.Column width={4}>
          <Header sub color="teal" content="Step 2 - Resize image" />
          {files.length > 0 && ( //if the files state is empty then cropper input will not even render.
            <CropperInput imagePreview={files[0].preview} setImage={setImage} />
          ) // sending the image preview from dropzone to our Cropper component which is what it uses to crop the file and set it as the image. Also sending the setImage method to set the state for the cropped image */}
          }
        </Grid.Column>
        <Grid.Column width={1} />
        <Grid.Column width={4}>
          <Header sub color="teal" content="Step 3 - Preview & Upload" />
          {files.length > 0 && ( //if there is a dropped image, display the preview with min hight and width.
            <Fragment>
              {/*bringing in fragments because we're not allowed to have siblings when we're wrapping an expression. */}
              <div
                className="img-preview" //this will display the image preview. Its getting the image from our preview property we set in our CropperInput component where we set the preview option to a class called .img-preview. This lets us display the cropped image preview.
                style={{
                  minHeight: "200px",
                  minWidth: "200px",
                  overflow: "hidden"
                }} //overflow:hidden makes sure that our image remains inside the box and does not move about all over the place.
              />
              <Button.Group>
                <Button
                  loading={loading}
                  onClick={handleUploadImage}
                  style={{ width: "100px" }}
                  positive
                  icon="check"
                />
                <Button
                  disabled={loading}
                  onClick={handleCancelCrop}
                  style={{ width: "100px" }}
                  icon="close"
                />
              </Button.Group>
            </Fragment>
          )}
        </Grid.Column>
      </Grid>

      <Divider />

      <UserPhotos
        photos={photos}
        profile={profile}
        deletePhoto={handleDeletePhoto}
        setMainPhoto={handleSetMainPhoto}
      />
    </Segment>
  );
};

export default compose(
  //just allows us to line up our higher order components downwards to make it look neater.
  connect(mapState, actions),
  firestoreConnect((auth) => query(auth)) //we have the auth available because we got that from the mapState. We call query and pass that in to get to the users collection and then further into the photos subcollection. We couldve done that directly here, but we'll do it as a function we call query, so that it looks less messy.
  // we are using auth here to pass in to our query function. We need auth to get the uid
)(PhotosPage);
