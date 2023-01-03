<template>
	<div class="signUpContainer">
		{{ validateRules }}
		<div class="formCon" v-if="showForm">
			<div class="headerDiv">
				<div class="iconDiv">
					<img src="../assets/icon.png" alt="" />
				</div>
				<h3>PathFinder</h3>
			</div>
			<br />
			<!-- <Map /> -->

			<div class="formLabel">Sign up</div>

			<br />

			<div class="fields">
				<!-- <div class="fieldLabel">Username</div> -->
				<v-text-field
					filled
					placeholder="Full name"
					dense
					color="#f502fe"
					outlined
					dark
					label="Full name"
					:rules="[rules.required]"
					v-model="user.full_name"
				></v-text-field>
			</div>
			<div class="fields">
				<!-- <div class="fieldLabel">Username</div> -->
				<v-text-field
					filled
					placeholder="Username"
					dense
					color="#f502fe"
					outlined
					dark
					label="Username"
					:rules="[rules.required, rules.min]"
					v-model="user.username"
				></v-text-field>
			</div>

			<div class="fields">
				<!-- <div class="fieldLabel">Password</div> -->
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
					:rules="[rules.required, rules.min]"
					:type="show ? 'text' : 'password'"
					counter
					@click:append="show = !show"
				></v-text-field>
			</div>

			<v-checkbox
				v-model="agreeTerms"
				label="Agree to terms and conditions"
				color="#f502fe"
				dense
				dark
			></v-checkbox>
			<div class="terms" style="margin-left: 30px; margin-top: -15px">
				<v-btn x-small text dark @click="showTerms = true"
					>Read terms and conditions</v-btn
				>
			</div>

			<br />
			<div class="formButton">
				<v-btn
					color="#f502fe"
					:dark="proceed"
					:disabled="!proceed"
					rounded
					@click="createAccount"
					:loading="userStore.loading"
					>Sign up</v-btn
				>
				<p>or</p>
				<v-btn text color="white" rounded to="/login">Log in</v-btn>
			</div>
		</div>
		<br />
		<Terms
			:showTerms="showTerms"
			v-if="showTerms"
			@closeTerms="showTerms = false"
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
	import Terms from "../components/GeneralModals/Terms.vue";
	import { useUserStore } from "../store/UserStore.js";
	import Snackbar from "../components/GeneralModals/Snackbar.vue";
	export default {
		components: { Terms, Snackbar },
		data: () => ({
			userStore: useUserStore(),
			user: {
				full_name: "",
				username: "",
				password: "",
			},
			agreeTerms: false,
			showTerms: false,
			show: false,
			proceed: false,
			rules: {
				required: (value) => !!value.trim() || "Required.",
				min: (v) => v.trim().length >= 8 || "Min 8 characters",
			},
			snackbar: false,
			status: null,
			message: "",
			showForm: true,
		}),
		methods: {
			async createAccount() {
				this.userStore.newUser = this.user;
				await this.userStore.registerUser();
				if (this.userStore.error) {
					if (this.userStore.error.message == "Network Error") {
						this.message = this.userStore.error.message;
					} else {
						this.message = "Username is already taken";
					}
					this.status = "Error";
					this.snackbar = true;
				} else {
					this.status = "Success";
					this.snackbar = true;
					this.message = "Successfully created account.";
					this.user = {
						full_name: "",
						username: "",
						password: "",
					};
					this.showForm = false;
					this.agreeTerms = false;

					setTimeout(() => {
						this.showForm = true;
					}, 10);
				}
			},
		},
		computed: {
			validateRules: function () {
				this.proceed = true;
				if (
					this.user.username.trim() == "" ||
					this.user.username.trim().length < 8
				) {
					this.proceed = false;
				}

				if (
					this.user.password.trim() == "" ||
					this.user.password.trim().length < 8
				) {
					this.proceed = false;
				}

				if (this.user.full_name.trim() == "") {
					this.proceed = false;
				}

				if (!this.agreeTerms) {
					this.proceed = false;
				}
			},
		},
	};
</script>

<style scoped>
	.signUpContainer {
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
