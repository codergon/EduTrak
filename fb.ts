import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth, setPersistence } from "firebase/auth";
import { initializeApp, getApps, getApp } from "firebase/app";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  GoogleAuthProvider,
  getReactNativePersistence,
} from "firebase/auth/react-native";

import {
  FIREBASE_APP_ID,
  FIREBASE_API_KEY,
  FIREBASE_PROJECT_ID,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MEASUREMENT_ID,
  FIREBASE_MESSAGING_SENDER_ID,
} from "@env";

const firebaseConfig = {
  appId: FIREBASE_APP_ID,
  apiKey: FIREBASE_API_KEY,
  projectId: FIREBASE_PROJECT_ID,
  authDomain: FIREBASE_AUTH_DOMAIN,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  ...(FIREBASE_MEASUREMENT_ID && { measurementId: FIREBASE_MEASUREMENT_ID }),
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

(async () => {
  await setPersistence(auth, getReactNativePersistence(AsyncStorage));
})();

const db = getFirestore();
const storage = getStorage(app);
var provider = new GoogleAuthProvider();

export { db, auth, provider, storage };
