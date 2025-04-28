// firebase.js (browser compatible version without import/export)
const firebaseConfig = {
  apiKey: "AIzaSyAkvQKQeJ9quNaOCvn07FB6AXDnj9dn10g",
  authDomain: "url-shortener-538c7.firebaseapp.com",
  databaseURL: "https://url-shortener-538c7-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "url-shortener-538c7",
  storageBucket: "url-shortener-538c7.firebasestorage.app",
  messagingSenderId: "1060253781164",
  appId: "1:1060253781164:web:cfe9a0d4d241e860512309",
  measurementId: "G-GXGX13447Y"
};

// Initialize Firebase with the compat version for non-modules
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Now `firebase` and `database` are globally accessible
window.firebase = firebase;
window.database = database;
