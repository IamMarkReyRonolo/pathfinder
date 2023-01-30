import firebase from "firebase/app";
import "firebase/database";

const config = {
	apiKey: "AIzaSyCjm1gSlnZCu_StSZbHQelivRMcn6Y05b0",

	authDomain: "pathfinder-chat.firebaseapp.com",

	databaseURL:
		"https://pathfinder-chat-default-rtdb.asia-southeast1.firebasedatabase.app",

	projectId: "pathfinder-chat",

	storageBucket: "pathfinder-chat.appspot.com",

	messagingSenderId: "758141289908",

	appId: "1:758141289908:web:bff6a02ba42f59fb965ee1",
};

const db = firebase.initializeApp(config);
export default db;
