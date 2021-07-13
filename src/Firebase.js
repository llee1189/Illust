import firebase from "firebase";
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCwQ7JoajWIs1mKlu2GWezLd1IN41i_qL0",
    authDomain: "illust-ee4c4.firebaseapp.com",
    databaseURL: "https://illust-ee4c4-default-rtdb.firebaseio.com",
    projectId: "illust-ee4c4",
    storageBucket: "illust-ee4c4.appspot.com",
    messagingSenderId: "566212894776",
    appId: "1:566212894776:web:d3dc76eb9f3ca4da1446cd",
    measurementId: "G-VJ78GCFV80"
  });

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();
  


  export {db, auth, storage};