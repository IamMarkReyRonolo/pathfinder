<template>
	<v-dialog v-model="showTerminateRoom" persistent>
		<v-card color="#25124b">
			<div class="con">
				<div class="headerTitle" id="modalTitle">
					<div>Terminate Find Me</div>
				</div>
				<p>Are you sure you want to end this Find Me event?</p>

				<div class="btnsCon">
					<v-btn
						text
						color="#c51ad5"
						@click="$emit('closePopUp', 'close')"
						id="cancelBtn"
						fab
						small
					>
						Close</v-btn
					>

					<v-btn
						small
						color="#c51ad5"
						@click="terminateRoom"
						id="cancelBtn"
						dark
						:loading="loading"
					>
						Delete</v-btn
					>
				</div>
			</div>
		</v-card>
	</v-dialog>
</template>

<script>
	import { useUserStore } from "../../store/UserStore";
	import db from "../../db";
	export default {
		props: { showTerminateRoom: Boolean, roomCode: String },
		data() {
			return {
				assignee: "",
				userStore: useUserStore(),
				loading: false,
				success: false,
				error: false,
			};
		},
		methods: {
			async terminateRoom() {
				try {
					this.loading = true;
					this.error = false;
					this.success = false;
					const result = await this.userStore.terminateFindMe(this.roomCode);
					console.log(result);
					const dbRef = db.database().ref("groupChat/" + this.roomCode);
					await dbRef.remove();
					console.log("Remove succeeded.");
					this.loading = false;
					this.error = false;
					this.success = true;
					this.$emit("closePopUp", "success");
				} catch (error) {
					console.log(error);
					this.loading = false;
					this.error = true;
					this.success = false;
					this.$emit("closePopUp", "error");
				}
			},
		},
	};
</script>

<style scoped>
	.con {
		padding: 20px;
	}
	.headerTitle {
		padding: 10px 0px;
		font-size: 20px;
		color: white;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid grey;
	}

	p {
		padding: 20px 0px;
		margin: 0px;
		color: white;
	}

	.btnsCon {
		text-align: right;
	}

	.v-btn {
		margin: 0px 10px;
	}
</style>
