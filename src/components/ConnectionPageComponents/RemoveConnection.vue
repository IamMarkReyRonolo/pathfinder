<template>
	<v-dialog v-model="showRemoveConnection" persistent>
		<v-card color="#25124b">
			<div class="con">
				<div class="headerTitle" id="modalTitle">
					<div>Remove Connection</div>
				</div>
				<p>Are you sure you want to remove this connection?</p>

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
						@click="cancelConnection"
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

	export default {
		props: { showRemoveConnection: Boolean, removeConnectionId: String },
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
			async cancelConnection() {
				try {
					this.loading = true;
					this.error = false;
					this.success = false;
					await this.userStore.removeConnection(this.removeConnectionId);
					this.loading = false;
					this.error = false;
					this.success = true;
					this.$emit("closePopUp", "success");
				} catch (error) {
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
