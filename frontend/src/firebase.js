// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAPvDLZ2tEpvaqDS0_rBruYhat1CUakiOQ",
  authDomain: "english-exam-app.firebaseapp.com",
  projectId: "english-exam-app",
  storageBucket: "english-exam-app.firebasestorage.app",
  messagingSenderId: "33860608077",
  appId: "1:33860608077:web:e2738fa9161bc8bf5e3c04"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app); // Export auth để sử dụng trong các component

export { auth }; // Xuất auth để có thể import và sử dụng ở các nơi khác