import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/database";
import "firebase/storage";


var firebaseConfig = {
    apiKey: "AIzaSyBO7buOsY9eL4-nu1PunBq5GjC7giwKfHc",
    authDomain: "groupy-519a9.firebaseapp.com",
    databaseURL: "https://groupy-519a9.firebaseio.com",
    projectId: "groupy-519a9",
    storageBucket: "groupy-519a9.appspot.com",
    messagingSenderId: "15048817964",
    appId: "1:15048817964:web:33fa511e0d4d980bcd0089",
    measurementId: "G-Q9SQPNSCFX"
  };

  firebase.initializeApp(firebaseConfig);

  export default firebase;
