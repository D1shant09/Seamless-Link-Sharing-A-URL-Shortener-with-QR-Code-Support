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

// Initialize Firebase with error handling
function initializeFirebase() {
  try {
    // Check if Firebase is already initialized
    if (!firebase.apps.length) {
      const app = firebase.initializeApp(firebaseConfig);
      console.log('Firebase initialized successfully');
      return app;
    } else {
      console.log('Firebase already initialized');
      return firebase.app();
    }
  } catch (error) {
    console.error('Firebase initialization error:', error);
    // Handle initialization error gracefully
    return null;
  }
}

// Initialize Firebase and get database reference
const app = initializeFirebase();
let database = null;

if (app) {
  try {
    database = firebase.database();
    // Set database rules
    database.ref('.info/connected').on('value', (snapshot) => {
      if (snapshot.val() === false) {
        console.warn('Firebase connection lost');
      }
    });
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// Export Firebase instances with error handling
window.firebase = {
  app: app,
  database: database,
  // Helper function to safely write to database
  writeData: async function(path, data) {
    if (!database) {
      console.error('Database not initialized');
      return false;
    }
    try {
      await database.ref(path).set(data);
      return true;
    } catch (error) {
      console.error('Database write error:', error);
      return false;
    }
  },
  // Helper function to safely read from database
  readData: async function(path) {
    if (!database) {
      console.error('Database not initialized');
      return null;
    }
    try {
      const snapshot = await database.ref(path).once('value');
      return snapshot.val();
    } catch (error) {
      console.error('Database read error:', error);
      return null;
    }
  }
};
