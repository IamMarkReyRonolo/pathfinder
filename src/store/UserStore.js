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
		notifications: [],
		specificConnection: {},
		findMeRoomData: {},
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

		async getAllUserNotifications() {
			const result = await UserAPI.prototype.getAllUserNotifications();
			this.notifications = result.notifications;
		},

		async activateFindMe(friend_ids) {
			const code = this.generateId(7);
			// const notification = {
			// 	notification_title: "Find Me",
			// 	notification_message: `${this.user.full_name} activated Find Me. Respond Now.`,
			// 	friend_ids: friend_ids,
			// 	code: code,
			// };
			const data = {
				room_code: code,
				users_responded: [],
				users_requested: friend_ids,
			};
			const result = await UserAPI.prototype.activateFindMe(data);
			console.log(result);
			return result;
		},

		async respondeToFindMe(code) {
			const result = await UserAPI.prototype.respondeToFindMe(code);
			return result;
		},

		async terminateFindMe(code) {
			const result = await UserAPI.prototype.terminateFindMe(code);
			return result;
		},

		async findSpecificConnection(username) {
			const result = await UserAPI.prototype.findSpecificConnection(username);
			this.specificConnection = result;
		},

		async checkForActiveFindMe() {
			const result = await UserAPI.prototype.checkForActiveFindMe();
			return result;
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

		generateId(len) {
			var arr = new Uint8Array((len || 40) / 2);
			window.crypto.getRandomValues(arr);
			return Array.from(arr, this.dec2hex).join("");
		},

		dec2hex(dec) {
			return dec.toString(16).padStart(2, "0");
		},
	},
});
