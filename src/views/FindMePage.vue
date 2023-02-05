<template>
	<div class="findMePageCon">
		<h2>Find Me</h2>
		<div class="pageDetails">
			<p>
				If you enable this, you are revealing your location to your connections
				and you are requesting them to find you.
			</p>
		</div>
		<div class="findMeBtn">
			<v-btn
				large
				color="#c51ad5"
				block
				rounded
				:dark="selected.length != 0"
				:disabled="selected.length == 0"
				@click="activateFindMe"
				:loading="findMeLoading"
				>Proceed</v-btn
			>
		</div>
		<div class="fetched" v-if="fetched">
			{{ listenForSelection }}
			<div
				class="componentHeader"
				v-if="userStore.getActiveConnections.length != 0"
			>
				<div>Select Connections</div>
				<v-checkbox
					v-model="allSelected"
					color="white"
					dark
					label="Select All"
				></v-checkbox>
			</div>

			<div class="connectionsLists">
				<div class="notEmpty" v-if="userStore.getActiveConnections.length != 0">
					<div
						class="connectionPeople"
						v-for="(value, index) in userStore.getActiveConnections"
						:key="index"
					>
						<div class="left">
							<v-checkbox
								v-model="selected"
								:value="value.friend_id"
								color="white"
								dark
							></v-checkbox>
							<v-avatar size="40" color="white"
								><img src="../assets/dp.png" alt=""
							/></v-avatar>
							<div class="name">{{ value.full_name }}</div>
						</div>
					</div>
				</div>

				<div class="empty" v-if="userStore.getActiveConnections.length == 0">
					<div class="emptyMessaage">
						You have no active connections yet. Add connections now.
					</div>
				</div>
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
</template>

<script>
	import AddConnectionComponents from "../components/ConnectionPageComponents/AddConnectionComponent.vue";
	import { useUserStore } from "../store/UserStore";
	import db from "../db";
	export default {
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
		components: { AddConnectionComponents },
		data: () => ({
			userStore: useUserStore(),
			showAddConnection: false,
			loading: false,
			fetched: false,
			error: false,
			selected: [],
			allSelected: false,
			findMeLoading: false,
			findMeError: false,
		}),
		methods: {
			async activateFindMe() {
				try {
					this.findMeLoading = true;
					this.findMeError = false;
					const result = await this.userStore.activateFindMe(this.selected);
					this.findMeLoading = false;
					this.findMeError = false;
					console.log(result);
					this.userStore.findMeRoomData.room_code = result.notification.code;
					this.userStore.findMeRoomData.user_id = "host";
					const database = db.database();
					db.database()
						.ref("Users/" + this.userStore.user.uuid + "/username")
						.set(this.userStore.user.full_name);
					const fieldRef = database.ref(
						"Users/" +
							this.userStore.user.uuid +
							"/numberOfTimesActivatedFindEvent"
					);

					fieldRef.transaction(function (currentValue) {
						return (currentValue || 0) + 1;
					});
					this.$router.push("/room");
				} catch (error) {
					console.log(error);
					this.findMeLoading = false;
					this.findMeError = true;
				}
			},
		},
		watch: {
			allSelected() {
				if (this.allSelected) {
					this.selected = [];
					this.userStore.getActiveConnections.forEach((connection) => {
						this.selected.push(connection.friend_id);
					});
				} else {
					if (
						this.selected.length == this.userStore.getActiveConnections.length
					) {
						this.selected = [];
					}
				}
			},
		},
		computed: {
			listenForSelection: function () {
				if (
					this.userStore.getActiveConnections.length != this.selected.length
				) {
					this.allSelected = false;
				} else {
					this.allSelected = true;
				}
			},
		},
	};
</script>

<style scoped>
	h2 {
		padding: 10px 0px;
		font-size: 30px;
	}

	.findMePageCon {
		width: 350px;
		margin: auto;
		padding: 0px 10px;
	}
	.pageDetails {
		font-size: 16px;
	}

	.findMeBtn {
		padding: 20px;
		text-align: center;
		/* position: fixed;
		bottom: 70px;
		right: 0px; */
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

	.loading,
	.errorCon {
		position: absolute;
		top: 40%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.fetched {
		padding: 10px 0px;
	}

	.componentHeader {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.connectionsLists {
		margin-top: -15px;
	}
</style>
