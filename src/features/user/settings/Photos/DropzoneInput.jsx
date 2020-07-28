import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'//react hook
import { Icon, Header } from 'semantic-ui-react';

const DropzoneInput = ({setFiles}) => {
  const onDrop = useCallback(acceptedFiles => { //useCallback is a react hook
    setFiles(acceptedFiles.map(file => Object.assign(file, { //since acceptedFiles is an array, we'll use the map function. Then for each file, we'll have our file and also add a preview property for which we'll create an objectURL for the file and assign it to it. 
        preview: URL.createObjectURL(file) //createObjectURL will create an object in memory and remain there until we remove it manually. So we'll use the useEffect hook to get rid of it from memory once the user is finished.
    })));  //The URL.createObjectURL() static method creates a DOMString containing a URL representing the object given in the parameter. The URL lifetime is tied to the document in the window on which it was created. The new object URL represents the specified File object or Blob object.
  }, [setFiles]) //this array [setFiles] is to specify our dependancy when executing this. We're just saying dependancy is on our setFile method.
  const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        multiple: false, //so that we only allow one picture to get uploaded.
        accept: 'image/*' //only accept image file types.
    })
  //destructuring props we get from useDropzone.
  return (
    <div {...getRootProps()} className={'dropzone ' + (isDragActive && 'dropzone--isActive' )} >
        {/* adding className dropzone and dropzone--isActive so that the css stryling we have for these classes in index.css is applied */}
      <input {...getInputProps()} />
      <Icon name='upload' size='huge'/>
      <Header content='Drop image here' />
    </div>
  )
}
export default DropzoneInput;