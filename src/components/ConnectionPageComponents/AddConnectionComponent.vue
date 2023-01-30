<template>
	<div class="addConnectionPage" v-if="showAddConnection">
		<div class="pageHeader">
			<v-btn fab small dark color="#c51ad5" @click="back">
				<v-icon>mdi-arrow-left</v-icon></v-btn
			>
			<h2>Add Connection</h2>
		</div>

		<v-text-field
			label="Username"
			outlined
			dark
			color="#c51ad5"
			prepend-inner-icon="@"
			v-model="username"
		>
		</v-text-field>
		<div class="findBtn">
			<v-btn
				rounded
				:dark="username.length != 0"
				:disabled="username.length == 0"
				color="#c51ad5"
				@click="findUser"
				:loading="loading"
				>Find Connection</v-btn
			>
		</div>

		<div class="resultsCon">
			<div class="componentTitle" v-if="fetched">Results</div>
			<div class="resultList">
				<div class="connectionPeople" v-if="fetched">
					<div class="left">
						<v-avatar size="40" color="white"
							><img src="../../assets/dp.png" alt=""
						/></v-avatar>
						<div class="name">{{ userStore.specificConnection.full_name }}</div>
					</div>

					<div class="right">
						<v-btn
							small
							rounded
							color="#c51ad5"
							dark
							@click="addConnection"
							:loading="addingConnection"
							v-if="!added && !inConnection && !userOwn"
							>Add</v-btn
						>
						<v-btn
							small
							rounded
							color="#c51ad5"
							dark
							@click="cancelConnection"
							:loading="addingConnection"
							v-if="added && !inConnection && !userOwn"
							>Cancel</v-btn
						>

						<v-btn x-small text color="#c51ad5" dark v-if="inConnection"
							>In Connection</v-btn
						>

						<v-btn x-small text color="#c51ad5" dark v-if="userOwn">You</v-btn>
					</div>
				</div>

				<div class="empty" v-if="error">
					<div class="emptyMessaage">No Match Found.</div>
				</div>
			</div>
		</div>

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
	import { useUserStore } from "../../store/UserStore";
	import Snackbar from "../GeneralModals/Snackbar";
	export default {
		components: { Snackbar },
		props: {
			showAddConnection: Boolean,
		},
		data: () => ({
			userStore: useUserStore(),
			loading: false,
			error: false,
			fetched: false,
			username: "",
			addingConnection: false,
			added: false,
			errorAdd: false,
			snackbar: false,
			status: null,
			message: "",
		}),
		methods: {
			back() {
				this.$emit("backToConnections");
			},

			async findUser() {
				try {
					this.loading = true;
					this.fetched = false;
					this.error = false;
					this.addingConnection = false;
					this.added = false;
					this.errorAdd = false;
					await this.userStore.findSpecificConnection(this.username);
					this.loading = false;
					this.fetched = true;
				} catch (error) {
					this.loading = false;
					this.fetched = false;
					this.error = true;
				}
			},

			async addConnection() {
				try {
					this.addingConnection = true;
					await this.userStore.requestConnection(
						this.userStore.specificConnection.uuid
					);
					this.addingConnection = false;
					this.added = true;

					this.snackbar = true;
					this.status = "Success";
					this.message = "Sent Connection Request";
				} catch (error) {
					this.addingConnection = false;
					this.added = true;
					this.errorAdd = true;
					this.snackbar = true;
					this.status = "Error";
					this.message = "Request Failed. Try Again.";
				}
			},

			async cancelConnection() {
				try {
					this.addingConnection = true;
					await this.userStore.removeConnection(
						this.userStore.specificConnection.uuid
					);

					this.addingConnection = false;
					this.added = false;

					this.snackbar = true;
					this.status = "Success";
					this.message = "Cancel Connection Request";
				} catch (error) {
					this.addingConnection = false;
					this.added = false;
					this.errorAdd = true;
					this.snackbar = true;
					this.status = "Error";
					this.message = "Failed to cancel. Try Again.";
				}
			},
		},
		computed: {
			inConnection: function () {
				let flag = false;
				this.userStore.connections.forEach((connect) => {
					if (connect.friend_id == this.userStore.specificConnection.uuid) {
						flag = true;
						this.added = true;
					}
				});

				return flag;
			},

			userOwn: function () {
				return (
					this.userStore.user.uuid == this.userStore.specificConnection.uuid
				);
			},
		},
	};
</script>

<style scoped>
	.pageHeader {
		display: flex;
		align-items: center;
		padding: 10px 0px;
	}
	h2 {
		padding: 20px 10px;
		font-size: 24px;

		text-align: center;
	}

	.findBtn {
		text-align: center;
	}

	.resultsCon {
		padding: 20px 0px;
	}

	.connectionPeople {
		padding: 20px 0px;
	}

	.name {
		padding-left: 10px;
		font-size: 14px;
	}

	.connectionPeople,
	.left {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.emptyMessaage {
		text-align: center;
		font-size: 14px;
		padding: 20px 10px;
	}
</style>
