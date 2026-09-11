import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyA6RWwEAexr3leYrQ6UL4dqftL0vU980ms",
	authDomain: "career-ignite-e8fa7.firebaseapp.com",
	projectId: "career-ignite-e8fa7",
	storageBucket: "career-ignite-e8fa7.firebasestorage.app",
	messagingSenderId: "856742924493",
	appId: "1:856742924493:web:726dfc62b58ddc726d5984",
};

const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp);
