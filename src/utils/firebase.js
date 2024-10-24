import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB_FVP-SAReOnKCnSfs_omnI44QhF2juYw",
  authDomain: "proyecto-grado-f27a3.firebaseapp.com",
  projectId: "proyecto-grado-f27a3",
  storageBucket: "proyecto-grado-f27a3.appspot.com",
  messagingSenderId: "376960520588",
  appId: "1:376960520588:web:3df942d2a8d9664f0a86a9",
  measurementId: "G-0218DLWSRN",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
