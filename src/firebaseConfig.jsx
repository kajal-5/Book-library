import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDv4-aofLFqOnDJI3aOJO57hkgtoMs1zvY",
  authDomain: "book-app-339c8.firebaseapp.com",
  projectId: "book-app-339c8",
  storageBucket: "book-app-339c8.appspot.com",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
