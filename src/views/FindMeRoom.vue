<template>
	<div class="homePageCon">
		<div class="pageHeader">
			<h2>Find Me</h2>

			<div>
				<v-btn
					rounded
					dark
					color="#c51ad5"
					small
					@click="showTerminateRoom = true"
					v-if="
						this.userStore.user.uuid == this.roomData.user_id ||
						this.roomData.user_id == 'host'
					"
					>Cancel Sharing</v-btn
				>
				<v-btn
					dark
					color="#c51ad5"
					fab
					small
					@click="clickedChat"
					style="margin-left: 10px"
				>
					<v-icon size="20">mdi-message-badge-outline</v-icon>
				</v-btn>
			</div>
		</div>

		<div class="fetched" v-if="fetched">
			<Map :sessionCode="this.roomData.room_code" />
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
		<div class="contentCon">
			<div class="notEmpty"></div>
			<div class="empty"></div>
		</div>

		<GroupChat
			v-if="this.showChat == true"
			:sessionCode="this.roomData.room_code"
			@closeChat="closeChat"
		/>

		<TerminateRoomModal
			:showTerminateRoom="showTerminateRoom"
			v-if="showTerminateRoom"
			@closePopUp="closePopUp"
			:roomCode="this.roomData.room_code"
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
	import { useUserStore } from "../store/UserStore";
	import GroupChat from "./GroupChat";
	import TerminateRoomModal from "../components/FindMeRoomComponents/TerminateRoomModal";
	import Snackbar from "../components/GeneralModals/Snackbar.vue";
	import Map from "./Map.vue";
	export default {
		components: { GroupChat, TerminateRoomModal, Snackbar, Map },
		async created() {
			this.roomData = this.userStore.findMeRoomData;
			console.log(this.roomData);
		},
		data: () => ({
			userStore: useUserStore(),
			loading: false,
			error: false,
			fetched: true,
			showChat: false,
			roomData: {},
			snackbar: false,
			status: null,
			message: "",
			showTerminateRoom: false,
		}),
		methods: {
			clickedChat() {
				this.showChat = true;
			},
			closeChat() {
				this.showChat = false;
			},

			closePopUp(payload) {
				if (payload == "close") {
					this.showTerminateRoom = false;
				} else if (payload == "success") {
					this.snackbar = true;
					this.status = "Success";
					this.message = "Success";

					// this.$router.push("/home");
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
		/* font-size: 20px;
		font-weight: lighter; */
	}

	.pageHeader {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: auto;
		padding: 0px 25px;
	}

	.loading,
	.errorCon {
		position: absolute;
		top: 40%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.isEmpty {
		text-align: center;
		padding: 10px;
	}

	.chatSection {
		position: absolute;
		width: 100%;
	}

	/* .v-btn {
		margin: 30px 0px;
		display: flex;
		justify-content: space-evenly;
	} */
</style>
