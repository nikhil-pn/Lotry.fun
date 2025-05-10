// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCAxBdxE0yD44rdN9lD1ihpiWWMe40Ldhg",
  authDomain: "lotry-fun.firebaseapp.com",
  projectId: "lotry-fun",
  storageBucket: "lotry-fun.firebasestorage.app",
  messagingSenderId: "783619300143",
  appId: "1:783619300143:web:87a6cf8112b0a4f7365fda",
  measurementId: "G-V9NP04QBJL",
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Conditionally initialize Analytics if running in a browser environment
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, analytics };
