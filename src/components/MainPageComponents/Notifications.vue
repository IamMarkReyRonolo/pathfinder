<template>
	<v-dialog v-model="showNotifications" persistent width="360">
		<v-card color="#25124b">
			<div class="con">
				<div class="headerTitle" id="modalTitle">
					<div>
						<v-icon size="30" color="#c51ad5">mdi-bell-outline</v-icon>
						Notifications
					</div>

					<div class="btnsCon">
						<v-btn
							text
							color="#4b5a76"
							@click="$emit('closeNotifications')"
							id="cancelBtn"
							fab
						>
							<v-icon color="white">mdi-close</v-icon></v-btn
						>
					</div>
				</div>
			</div>
		</v-card>
	</v-dialog>
</template>

<script>
	export default {
		props: { showNotifications: Boolean },
		data() {
			return {
				assignee: "",
			};
		},
	};
</script>

<style scoped>
	.con {
		height: 500px;
	}
	.headerTitle {
		padding: 10px 20px;
		font-size: 20px;
		color: white;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid grey;
	}

	.btnsCon {
		margin-right: -10px;
	}
</style>
