import React, {Component, createRef} from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

class CropperInput extends Component {
 
 cropper = createRef(); //class property
 //creating our own ref. We need ref because in this case we need access to the actual DOM where the user is resizing the image.

 cropImage = () =>  {
    const { setImage } = this.props;
    if (typeof this.cropper.current.getCroppedCanvas() === 'undefined') {
        return; //if nothing is selected for cropping then we get undefined and we get out of this method
    } //this.cropper.current will give us access to the ref when we use the CreateRef method to get the element from the DOM.
    
    this.cropper.current.getCroppedCanvas().toBlob(blob => { //if something is crpoped we convert it to blob (blobs represent data like a file like object. In this case its the cropped image data we get from the DOM)
        setImage(blob);
    }, 'image/jpeg') //give this a type. Storing these as img or jpeg.
}

  render() {
      const {imagePreview} = this.props;
    return (
      <Cropper
        ref={this.cropper}
        src={imagePreview} //the image preview we get from our DropzoneInput.
        style={{height: 200, width: '100%'}}
        // Cropper.js options
        preview='.img-preview' //provides the preview as a class style. Creates a div in the photos page and display the preview.
        aspectRatio={1} //enforce a square image
        viewMode={1} //stop user from trying to crop outside of the uploaded image.
        dragMode={'move'} //allow user to move the image around the cropbox
        guides={false}
        scalable={true}
        cropBoxMovable={true}
        cropBoxResizable={true}
        crop={this.cropImage} // create our own crop image method and pass it in. 
        />
    );
  }
}

export default CropperInput;