import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBylD8jxbon1BcfU_UnMp6NGo4zDwxKU0s",
  authDomain: "dr-college.firebaseapp.com",
  databaseURL: "https://dr-college-default-rtdb.firebaseio.com/",
  projectId: "dr-college",
  storageBucket: "dr-college.firebasestorage.app",
  messagingSenderId: "301396940180",
  appId: "1:301396940180:web:25197242113a0e61e7eb81",
};

const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);
export const auth = getAuth(app);

export default app;