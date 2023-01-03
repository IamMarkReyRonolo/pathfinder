<template>
	<div class="connectionPageCon">
		<div v-if="!showAddConnection">
			<div class="pageHeader">
				<h2>Connections</h2>
				<v-btn
					fab
					x-small
					dark
					color="#c51ad5"
					@click="showAddConnection = true"
				>
					<v-icon>mdi-plus</v-icon></v-btn
				>
			</div>

			<div class="connectionNav">
				<v-btn
					small
					color="#c51ad5"
					dark
					rounded
					:text="!showActive"
					@click="select('active')"
					>Active</v-btn
				>
				<v-btn
					small
					color="#c51ad5"
					dark
					rounded
					:text="!showPending"
					@click="select('pending')"
				>
					Pending</v-btn
				>
				<v-btn
					small
					color="#c51ad5"
					dark
					rounded
					:text="!showRequests"
					@click="select('requests')"
				>
					Requests</v-btn
				>
			</div>

			<div class="fetched" v-if="fetched">
				<div class="connectionsLists" v-if="showActive">
					<div
						class="notEmpty"
						v-if="userStore.getActiveConnections.length != 0"
					>
						<div
							class="connectionPeople"
							v-for="(value, index) in userStore.getActiveConnections"
							:key="index"
						>
							<div class="left">
								<v-avatar size="40" color="white"
									><img src="../assets/dp.png" alt=""
								/></v-avatar>
								<div class="name">{{ value.full_name }}</div>
							</div>
							<div class="right">
								<v-btn
									small
									color="#c51ad5"
									dark
									rounded
									@click="remove(value.friend_id)"
									>Remove</v-btn
								>
							</div>
						</div>
					</div>

					<div class="empty" v-if="userStore.getActiveConnections.length == 0">
						<div class="emptyMessaage">
							You have no active connections yet. Add connections now.
						</div>
					</div>
				</div>
				<div class="connectionsLists" v-if="showPending">
					<div
						class="notEmpty"
						v-if="userStore.getPendingConnections.length != 0"
					>
						<div
							class="connectionPeople"
							v-for="(value, index) in userStore.getPendingConnections"
							:key="index"
						>
							<div class="left">
								<v-avatar size="40" color="white"
									><img src="../assets/dp.png" alt=""
								/></v-avatar>
								<div class="name">{{ value.full_name }}</div>
							</div>
							<div class="right">
								<v-btn
									small
									color="#c51ad5"
									dark
									rounded
									@click="remove(value.friend_id)"
									>Cancel</v-btn
								>
							</div>
						</div>
					</div>

					<div class="empty" v-if="userStore.getPendingConnections.length == 0">
						<div class="emptyMessaage">
							No pending request as of now. Add connections now.
						</div>
					</div>
				</div>
				<div class="connectionsLists" v-if="showRequests">
					<div
						class="notEmpty"
						v-if="userStore.getConnectionRequest.length != 0"
					>
						<div
							class="connectionPeople"
							v-for="(value, index) in userStore.getConnectionRequest"
							:key="index"
						>
							<div class="left">
								<v-avatar size="40" color="white"
									><img src="../assets/dp.png" alt=""
								/></v-avatar>
								<div class="name">{{ value.full_name }}</div>
							</div>
							<div class="right">
								<v-btn
									fab
									x-small
									color="#c51ad5"
									dark
									@click="accept(value.friend_id)"
									><v-icon>mdi-check</v-icon></v-btn
								>
								<v-btn
									fab
									x-small
									class="error"
									@click="remove(value.friend_id)"
									><v-icon>mdi-delete</v-icon></v-btn
								>
							</div>
						</div>
					</div>

					<div class="empty" v-if="userStore.getConnectionRequest.length == 0">
						<div class="emptyMessaage">
							No connection request as of now. Add connections now.
						</div>
					</div>
				</div>

				<div class="addConnectionBtn">
					<v-btn
						x-large
						color="#c51ad5"
						dark
						rounded
						@click="showAddConnection = true"
					>
						Add More Connection</v-btn
					>
				</div>
			</div>
			<div class="loading" v-if="loading">
				<v-progress-circular
					:size="40"
					:width="5"
					color="purple"
					indeterminate
				></v-progress-circular>
			</div>
			<div class="errorCon" v-if="error">Error Refresh Page</div>
		</div>

		<AddConnectionComponents
			:showAddConnection="showAddConnection"
			v-if="showAddConnection"
			@backToConnections="refresh"
		/>

		<RemoveConnection
			:showRemoveConnection="showRemoveConnection"
			v-if="showRemoveConnection"
			@closePopUp="closePopUp"
			:removeConnectionId="removeConnectionId"
		/>

		<AcceptConnection
			:showAcceptRequest="showAcceptRequest"
			v-if="showAcceptRequest"
			@closePopUp="closePopUp"
			:user_id="user_id"
		/>

		<Snackbar
			:snackbar="snackbar"
			:message="message"
			:status="status"
			@closeSnackbar="snackbar = false"
			v-if="snackbar"
		/>
	</div>
</template>

<script>
	import AddConnectionComponents from "../components/ConnectionPageComponents/AddConnectionComponent.vue";
	import RemoveConnection from "../components/ConnectionPageComponents/RemoveConnection.vue";
	import AcceptConnection from "../components/ConnectionPageComponents/AcceptConnection.vue";
	import { useUserStore } from "../store/UserStore";
	import Snackbar from "../components/GeneralModals/Snackbar.vue";
	export default {
		components: {
			AddConnectionComponents,
			RemoveConnection,
			Snackbar,
			AcceptConnection,
		},
		created() {
			try {
				this.fetched = false;
				this.loading = true;
				this.userStore.getAllUserConnections();
				this.fetched = true;
				this.loading = false;
			} catch (error) {
				this.fetched = false;
				this.loading = false;
				this.error = error;
			}
		},
		data: () => ({
			userStore: useUserStore(),
			showAddConnection: false,
			showActive: true,
			showPending: false,
			showRequests: false,
			showRemoveConnection: false,
			showAcceptRequest: false,
			loading: false,
			fetched: true,
			error: false,
			snackbar: false,
			status: null,
			message: "",
			removeConnectionId: "",
			user_id: "",
		}),
		methods: {
			select(type) {
				this.showActive = false;
				this.showPending = false;
				this.showRequests = false;
				if (type == "active") {
					this.showActive = true;
				}
				if (type == "pending") {
					this.showPending = true;
				}
				if (type == "requests") {
					this.showRequests = true;
				}
			},

			async refresh() {
				this.showAddConnection = false;
				try {
					this.fetched = false;
					this.loading = true;
					await this.userStore.getAllUserConnections();
					this.fetched = true;
					this.loading = false;
				} catch (error) {
					this.fetched = false;
					this.loading = false;
					this.error = error;
				}
			},

			remove(id) {
				this.showRemoveConnection = true;
				this.removeConnectionId = id;
			},

			accept(id) {
				this.showAcceptRequest = true;
				this.user_id = id;
			},

			closePopUp(payload) {
				if (payload == "close") {
				} else if (payload == "success") {
					this.snackbar = true;
					this.status = "Success";
					this.message = "Success";

					this.refresh();
				} else if (payload == "error") {
					this.snackbar = true;
					this.status = "Error";
					this.message = "Failed. Try again.";
				}
				this.showRemoveConnection = false;
				this.showAcceptRequest = false;
			},
		},
	};
</script>

<style scoped>
	h2 {
		padding: 10px 0px;
		font-size: 20px;
		font-weight: lighter;
	}

	.connectionPageCon {
		padding: 10px 0px;
		width: 300px;
		margin: auto;
	}

	.pageHeader {
		padding: 10px 0px;
	}

	.connectionNav {
		padding-bottom: 20px;
	}

	.connectionPeople {
		padding: 10px 0px;
	}

	.name {
		padding-left: 10px;
		font-size: 14px;
	}

	.connectionPeople,
	.pageHeader,
	.left {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.right {
		display: flex;
		justify-content: space-between;
		width: 70px;
	}

	.emptyMessaage {
		text-align: center;
		font-size: 14px;
		padding: 10px;
	}

	.addConnectionBtn {
		padding: 40px 0px;
		text-align: center;
	}

	.loading,
	.errorCon {
		position: absolute;
		top: 40%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
