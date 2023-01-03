<template>
	<div class="logInContainer">
		{{ validateRules }}
		<Snackbar
			:snackbar="snackbar"
			:message="message"
			:status="status"
			@closeSnackbar="snackbar = false"
			v-if="snackbar"
		/>
		<div class="formCon">
			<div class="headerDiv">
				<div class="iconDiv">
					<img src="../assets/icon.png" alt="" />
				</div>
				<h3>PathFinder</h3>
			</div>
			<br />
			<br />
			<div class="formLabel">Log In</div>
			<br />
			<br />
			<div class="fields">
				<v-text-field
					filled
					placeholder="Username"
					dense
					color="#f502fe"
					outlined
					dark
					label="Username"
					:rules="[rules.required]"
					v-model="user.username"
				></v-text-field>
			</div>

			<div class="fields">
				<v-text-field
					filled
					placeholder="Password"
					dense
					color="#f502fe"
					dark
					label="Password"
					outlined
					v-model="user.password"
					:append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
					:rules="[rules.required]"
					:type="show ? 'text' : 'password'"
					counter
					@click:append="show = !show"
				></v-text-field>
			</div>

			<br />
			<div class="formButton">
				<v-btn
					color="#f502fe"
					:dark="proceed"
					rounded
					:disabled="!proceed"
					@click="handleLoginEvent"
					:loading="userStore.loading"
					>Log in</v-btn
				>
				<p>or</p>
				<v-btn text color="white" rounded to="/signup">Sign up</v-btn>
			</div>
		</div>
	</div>
</template>

<script>
	import { useUserStore } from "../store/UserStore.js";
	import Snackbar from "../components/GeneralModals/Snackbar.vue";
	export default {
		components: { Snackbar },
		created() {
			try {
				const token = JSON.parse(localStorage.getItem("token"));
				if (token) {
					this.$router.push("/");
				}
			} catch (error) {
				localStorage.removeItem("token");
			}
		},
		data: () => ({
			userStore: useUserStore(),
			show: false,
			user: {
				username: "",
				password: "",
			},
			rules: {
				required: (value) => !!value.trim() || "Required.",
			},
			proceed: false,
			snackbar: false,
			status: null,
			message: "",
		}),
		methods: {
			async handleLoginEvent() {
				await this.userStore.logIn(this.user);
				if (this.userStore.error) {
					if (this.userStore.error.message == "Network Error") {
						this.message = this.userStore.error.message;
					} else {
						this.message = "Incorrect Credentials";
					}
					this.status = "Error";
					this.snackbar = true;
				} else {
					this.$router.push("/");
				}
			},
		},

		computed: {
			validateRules: function () {
				if (
					this.user.username.trim() != "" &&
					this.user.password.trim() != ""
				) {
					this.proceed = true;
				} else {
					this.proceed = false;
				}
			},
		},
	};
</script>

<style scoped>
	.logInContainer {
		padding: 50px 0px;
	}
	.formCon {
		margin: 20px auto;
		width: 300px;
		color: white;
	}

	.titleCon,
	.formLabel,
	.formButton {
		text-align: center;
	}
	.titleCon {
		font-size: 20px;
	}

	.formButton p {
		margin: 0px;
		padding: 10px;
	}

	.fieldLabel {
		padding: 10px 0px;
	}

	.headerDiv {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.iconDiv {
		padding: 5px 10px;
	}
	.iconDiv img {
		width: 40px;
	}
</style>
