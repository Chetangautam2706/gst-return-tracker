import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBWX7QeQnGtA69JFYv9s4PWO83a_2tIO_Q",
  authDomain: "gst--dashboard.firebaseapp.com",
  projectId: "gst--dashboard",
  storageBucket: "gst--dashboard.firebasestorage.app",
  messagingSenderId: "573526035653",
  appId: "1:573526035653:web:1b5bbdb48f1acba08974ac",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;
