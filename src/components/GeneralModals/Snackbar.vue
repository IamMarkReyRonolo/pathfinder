<template>
	<v-snackbar
		v-model="activator"
		:color="status == 'Success' ? '#4b5a76' : 'error'"
		:dark="status == 'Success'"
		:outlined="status != 'Success'"
		:timeout="timeout"
		top
	>
		<div id="snackBar">
			{{ message }}
		</div>

		<template v-slot:action="{ attrs }">
			<v-btn
				:color="status == 'Success' ? 'grey' : 'red'"
				text
				v-bind="attrs"
				@click="closeSnackbar"
				id="closeSnackbar"
			>
				Close
			</v-btn>
		</template>
	</v-snackbar>
</template>

<script>
	export default {
		props: { snackbar: Boolean, message: String, status: String },
		created() {
			this.activator = this.snackbar;
		},
		data() {
			return {
				multiLine: true,
				timeout: 5000,
				activator: false,
			};
		},

		methods: {
			closeSnackbar() {
				this.activator = false;
			},
		},
		watch: {
			activator() {
				if (!this.activator) {
					this.$emit("closeSnackbar");
				}
			},
		},
	};
</script>

<style scoped>
	.con {
		padding: 20px;
		text-align: center;
		color: #4b5a76;
	}
</style>
