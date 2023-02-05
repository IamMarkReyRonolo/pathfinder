<template>
	<div class="homePageCon">
		<div class="pageHeader">
			<h2>Home</h2>
			<v-btn
				dark
				color="#c51ad5"
				to="/findMe"
				rounded
				large
				v-if="!hasActiveEvent"
			>
				<v-icon size="30">mdi-map-marker-account</v-icon>
				<span>Find Me</span></v-btn
			>
		</div>

		<div class="fetched" v-if="fetched">
			<div class="isNotEmpty" v-if="userStore.notifications.length != 0">
				<div class="activeIndicator" v-if="hasActiveEvent">
					<v-btn class="success" small rounded>active</v-btn>
				</div>
				<div class="findMeEventCon" v-if="hasActiveEvent">
					<div class="imgCon">
						<img src="../assets/earthimage.png" alt="" />
					</div>
					<div class="eventContent">
						<div class="eventTitle">Find Me Event</div>
						<div class="eventDetails">
							{{ this.room.users_responded.length }} people responded.
						</div>
						<div class="btnCon">
							<v-btn rounded dark color="#28066f" @click="clickCheck"
								>Check</v-btn
							>
						</div>
					</div>

					<!-- {{ this.room }} -->
				</div>

				<div
					class="lists"
					v-for="(notification, index) in userStore.notifications"
					:key="index"
				>
					<div class="list" @click="openNotification(notification)">
						<v-avatar size="50" color="white"
							><img src="../assets/dp.png" alt=""
						/></v-avatar>
						<div class="content">
							<div class="details">
								{{ notification.notification_message }}
							</div>
							<div class="date">
								{{ getLocalDate(notification.created_at) }}
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="isEmpty" v-if="userStore.notifications.length == 0">
				No activities yet. Add connections and participate on activities.
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
	import { useUserStore } from "../store/UserStore";
	import Snackbar from "../components/GeneralModals/Snackbar.vue";
	import db from "../db";
	export default {
		components: {
			Snackbar,
		},
		async created() {
			try {
				this.loading = true;
				this.fetched = false;
				await this.userStore.getAllUserNotifications();
				this.loading = false;
				this.fetched = true;
			} catch (error) {
				console.log(error);
				this.error = true;
				this.loading = false;
				this.fetched = false;
			}

			this.checkForActiveFindMe();
		},
		data: () => ({
			userStore: useUserStore(),
			loading: false,
			error: false,
			fetched: true,
			hasActiveEvent: false,
			room: {},
			snackbar: false,
			status: null,
			message: "",
		}),
		methods: {
			async openNotification(notification) {
				console.log(notification);
				if (notification.notification_title == "Accept Connection") {
					this.$router.push("/connections");
				} else if (notification.notification_title == "Find Me") {
					try {
						const result = await this.userStore.respondeToFindMe(
							notification.code
						);
						console.log(result.room);
						this.userStore.findMeRoomData = result.room;
						const database = db.database();
						db.database()
							.ref("Users/" + this.userStore.user.uuid + "/username")
							.set(this.userStore.user.full_name);
						const fieldRef = database.ref(
							"Users/" +
								this.userStore.user.uuid +
								"/numberOfTimesRespondedToFindEvents"
						);

						fieldRef.transaction(function (currentValue) {
							return (currentValue || 0) + 1;
						});

						this.$router.push("/room");
					} catch (error) {
						console.log(error);
						this.snackbar = true;
						this.message = "Room not found. Event possibly terminated.";
						this.status = "Error";
					}
				}
			},

			clickCheck() {
				try {
					this.userStore.findMeRoomData = this.room;
					console.log(this.userStore.findMeRoomData);
					this.$router.push("/room");
				} catch (error) {
					console.log(error);
				}
			},
			getLocalDate(d) {
				let utc_date = d + "Z";
				let date = new Date(utc_date);
				var hours = date.getHours();
				var minutes = date.getMinutes();
				var ampm = hours >= 12 ? "pm" : "am";
				hours = hours % 12;
				hours = hours ? hours : 12; // the hour '0' should be '12'
				minutes = minutes < 10 ? "0" + minutes : minutes;
				var strTime = hours + ":" + minutes + " " + ampm;
				return date.toDateString() + " " + strTime;
			},

			async checkForActiveFindMe() {
				try {
					const result = await this.userStore.checkForActiveFindMe();
					this.room = result.room;
					this.hasActiveEvent = true;
				} catch (error) {
					this.hasActiveEvent = false;
				}
			},
		},
	};
</script>

<style scoped>
	.homePageCon {
		width: 350px;
		margin: auto;
		padding: 0px 10px;
	}
	h2 {
		padding: 10px 0px;
		/* font-size: 20px;
		font-weight: lighter; */
		font-size: 30px;
	}

	.findMeEventCon {
		padding: 20px;
		background-color: #c51ad5;
		border-radius: 10px;
		margin-bottom: 40px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.eventContent {
		padding: 10px 10px;
	}

	.eventTitle {
		font-weight: 500;
		font-size: 22px;
	}

	.btnCon {
		padding-top: 15px;
		display: flex;
		justify-content: flex-end;
	}

	.eventDetails {
		font-size: 14px;
	}

	.imgCon img {
		width: 100px;
	}

	.activeIndicator {
		margin-bottom: -30px;
		margin-left: -20px;
	}

	.pageHeader {
		padding: 10px 0px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.loading,
	.errorCon {
		position: absolute;
		top: 40%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.list {
		display: flex;
		align-items: center;
		border: 1px solid #c51ad5;
		border-radius: 10px;
		padding: 15px 10px;
		cursor: pointer;
		margin: 10px 0px;
	}

	.list:active {
		background-color: #c51ad5;
	}

	.content {
		padding: 0px 20px;
	}

	.details {
		font-size: 14px;
		padding-bottom: 5px;
	}

	.date {
		font-size: 10px;
	}

	.isEmpty {
		text-align: center;
		padding: 10px;
	}

	/* .v-btn {
		margin: 30px 0px;
		display: flex;
		justify-content: space-evenly;
	} */
</style>
