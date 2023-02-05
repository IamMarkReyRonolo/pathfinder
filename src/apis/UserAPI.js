import axios from "axios";
const url = "https://pathfinder-server.onrender.com/users";
// const url = "http://localhost:8000/users";
axios.defaults.headers.common["Authorization"] =
	"Bearer " + JSON.parse(localStorage.getItem("token"));

export default class API {
	async login(credentials) {
		const user = await axios.post(url + "/login", credentials);
		console.log(user);
		return user;
	}
	async register(newUser) {
		const user = await axios.post(url + "/register", newUser);
		return user;
	}
	async getUserData() {
		axios.defaults.headers.common["Authorization"] =
			"Bearer " + JSON.parse(localStorage.getItem("token"));
		const user = await axios.get(url + "/user_data");
		return user;
	}

	async getAllConnections() {
		const user = await axios.get(url + "/connections");
		return user.data;
	}
	async getAllUserNotifications() {
		const user = await axios.get(url + "/notifications");
		return user.data;
	}

	async checkForActiveFindMe() {
		axios.defaults.headers.common["Authorization"] =
			"Bearer " + JSON.parse(localStorage.getItem("token"));
		const user = await axios.get(url + "/check_for_active_find_me");
		return user.data;
	}

	async activateFindMe(data) {
		const user = await axios.post(url + "/activate_find_me", data);
		return user.data;
	}

	async respondeToFindMe(code) {
		const user = await axios.patch(url + "/respond_to_findme/" + code);
		return user.data;
	}

	async terminateFindMe(code) {
		const user = await axios.delete(url + "/terminate_find_me/" + code);
		return user.data;
	}

	async findSpecificConnection(username) {
		const user = await axios.get(url + "/find/" + username);
		return user.data;
	}

	async requestConnection(uuid) {
		const user = await axios.patch(url + `/connection_request/${uuid}`);
		return user;
	}

	async acceptConnection(uuid) {
		const user = await axios.patch(url + `/accept_connection/${uuid}`);
		return user;
	}

	async removeConnection(uuid) {
		const user = await axios.patch(url + `/remove_connection/${uuid}`);
		return user;
	}
}
