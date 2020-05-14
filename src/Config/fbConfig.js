import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBSse5hIV3ZJjcDbGqDZGXTQfCIAhRkp2E",
    authDomain: "qolzhetimdi.firebaseapp.com",
    databaseURL: "https://qolzhetimdi.firebaseio.com",
    projectId: "qolzhetimdi",
    storageBucket: "qolzhetimdi.appspot.com",
    messagingSenderId: "577606965013",
    appId: "1:577606965013:web:40438e1b0517da0c0ebb1c",
    measurementId: "G-DJWE1QE1CG"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


export default firebase;
