import axios from "axios";
const url = "http://localhost:8000/users";

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
		const staff = await axios.get(url + "/connections");
		return staff.data;
	}

	async findSpecificConnection(username) {
		const staff = await axios.get(url + "/find/" + username);
		return staff.data;
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
