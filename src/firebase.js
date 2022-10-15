// Import the functions you need from the SDKs you need
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyBOiqTQ1lH6LZDPpe3WbFzzJ0cmTp9pXuM",
  authDomain: "placement-app-862af.firebaseapp.com",
  databaseURL: "https://placement-app-862af.firebaseio.com",
  projectId: "placement-app-862af",
  storageBucket: "placement-app-862af.appspot.com",
  messagingSenderId: "946893995059",
  appId: "1:946893995059:web:204e2a211f421ee44d7746",
  measurementId: "G-9ZHGLTTSBZ",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
//const analytics = getAnalytics(app);
