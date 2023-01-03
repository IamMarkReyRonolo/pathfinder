import { defineStore } from "pinia";
import UserAPI from "../apis/UserAPI";
export const useUserStore = defineStore("userStore", {
	state: () => ({
		fetched: true,
		loading: false,
		error: null,
		accessdenied: false,
		user: null,
		success: false,
		newUser: null,
		connections: [],
		specificConnection: {},
	}),
	getters: {
		getActiveConnections() {
			let active = [];
			active = this.connections.filter((connection) => {
				if (connection.status == "Accepted") {
					return connection;
				}
			});

			return active;
		},

		getPendingConnections() {
			let pending = [];
			pending = this.connections.filter((connection) => {
				if (connection.status == "Pending") {
					return connection;
				}
			});

			return pending;
		},
		getConnectionRequest() {
			let request = [];
			request = this.connections.filter((connection) => {
				if (connection.status == "Request") {
					return connection;
				}
			});

			return request;
		},
	},
	actions: {
		async logIn(user) {
			try {
				this.loading = true;
				const result = await UserAPI.prototype.login(user);
				localStorage.setItem("token", JSON.stringify(result.data.access_token));
				this.loading = false;
				this.error = null;
				return true;
			} catch (error) {
				this.error = error;
				this.loading = false;
			}
		},

		async getUserData() {
			try {
				this.loading = true;
				this.fetched = false;
				const result = await UserAPI.prototype.getUserData();
				this.user = result.data.user;
				this.fetched = true;
				this.loading = false;
				this.error = null;
			} catch (error) {
				this.error = error;
				this.loading = false;
				this.fetched = false;
			}
		},

		async registerUser() {
			try {
				this.loading = true;
				this.succes = false;
				const result = await UserAPI.prototype.register(this.newUser);
				this.success = true;
				this.loading = false;
				this.error = null;
			} catch (error) {
				this.error = error;
				this.loading = false;
				this.success = false;
			}
		},

		async getAllUserConnections() {
			const result = await UserAPI.prototype.getAllConnections();
			this.connections = result.connections;
		},

		async findSpecificConnection(username) {
			const result = await UserAPI.prototype.findSpecificConnection(username);
			this.specificConnection = result;
		},

		async requestConnection(id) {
			const result = await UserAPI.prototype.requestConnection(id);
		},

		async removeConnection(id) {
			const result = await UserAPI.prototype.removeConnection(id);
		},

		async acceptConnection(id) {
			const result = await UserAPI.prototype.acceptConnection(id);
		},
	},
});
