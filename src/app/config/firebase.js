import firebase from 'firebase/app';
import 'firebase/firestore'; //getting firestore
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyBKchHmytuZUI6hbTZ0dGgy0Ttu4S8HWOg",
    authDomain: "revents-264421.firebaseapp.com",
    databaseURL: "https://revents-264421.firebaseio.com",
    projectId: "revents-264421",
    storageBucket: "revents-264421.appspot.com",
    messagingSenderId: "880470576941",
    appId: "1:880470576941:web:27031582e1cac783a18da4",
    measurementId: "G-XYQ6K9ZL8W"
  };

  firebase.initializeApp(firebaseConfig); //initialize the app with our config
  firebase.firestore();  //initialize firestore.

  export default firebase; //configured and ready to get exported to where we need to use firebase.