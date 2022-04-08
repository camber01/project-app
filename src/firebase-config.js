import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC1YOzjqgNoP9qDxNlcmxSR9jG09k_zMVQ",
  authDomain: "project-app-e2ee4.firebaseapp.com",
  projectId: "project-app-e2ee4",
  storageBucket: "project-app-e2ee4.appspot.com",
  messagingSenderId: "115314654289",
  appId: "1:115314654289:web:ec6aea020edf5d7025cc70"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export default auth;
