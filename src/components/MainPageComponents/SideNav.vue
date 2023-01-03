<template>
	<div class="navDrawerMobileCon">
		<div class="smallConView">
			{{ navigate }}
			<v-dialog
				v-model="openBurger"
				persistent
				fullscreen
				transition="dialog-left-transition"
			>
				<div class="navBarCon" v-if="openBurger">
					<div class="navHeader">
						<v-btn fab small id="drawerBtn">
							<v-avatar
								size="40"
								color="white"
								@click="clickNav"
								v-if="openBurger"
								><img src="../../assets/dp.png" alt="" /></v-avatar
						></v-btn>
						<h2>{{ full_name }}</h2>
					</div>

					<div class="navContent">
						<v-btn
							:text="!homeSelected"
							@click="select('home')"
							dark
							block
							class="navBtn"
							large
							:color="homeSelected ? '#731182' : 'white'"
							to="/home"
							>Home</v-btn
						>
						<v-btn
							:text="!connectionsSelected"
							@click="select('connections')"
							dark
							block
							class="navBtn"
							large
							:color="connectionsSelected ? '#731182' : 'white'"
							to="/connections"
							>Connections</v-btn
						><v-btn
							:text="!profileSelected"
							@click="select('profile')"
							dark
							block
							class="navBtn"
							large
							:color="profileSelected ? '#731182' : 'white'"
							to="/profile"
							>Profile</v-btn
						><v-btn text dark block class="navBtn" large @click="logOut"
							>Log Out</v-btn
						>
					</div>
				</div>
			</v-dialog>
		</div>

		<v-overlay
			:value="overlay"
			v-if="this.$vuetify.breakpoint.width <= 1000"
		></v-overlay>
	</div>
</template>

<script>
	import { useUserStore } from "../../store/UserStore";
	export default {
		props: {
			openBurger: Boolean,
			overlay: Boolean,
		},
		created() {
			this.full_name = this.userStore.user.full_name;
		},
		data: () => ({
			userStore: useUserStore(),
			homeSelected: true,
			connectionsSelected: false,
			profileSelected: false,
		}),

		methods: {
			clickNav() {
				this.$emit("closeNav");
			},
			select(selected) {
				if (selected == "home" && !this.homeSelected) {
					this.homeSelected = true;
					this.connectionsSelected = false;
					this.profileSelected = false;
				}

				if (selected == "connections" && !this.connectionsSelected) {
					this.homeSelected = false;
					this.connectionsSelected = true;
					this.profileSelected = false;
				}

				if (selected == "profile" && !this.profileSelected) {
					this.homeSelected = false;
					this.connectionsSelected = false;
					this.profileSelected = true;
				}
				this.clickNav();
			},
			logOut() {
				localStorage.removeItem("token");
				this.$router.push("/login");
			},
		},
		computed: {
			navigate: function () {
				if (this.$route.name == "home") {
					this.homeSelected = true;
					this.connectionsSelected = false;
					this.profileSelected = false;
				}
				if (this.$route.name == "connections") {
					this.homeSelected = false;
					this.connectionsSelected = true;
					this.profileSelected = false;
				}
				if (this.$route.name == "profile") {
					this.homeSelected = false;
					this.connectionsSelected = false;
					this.profileSelected = true;
				}
			},
		},
	};
</script>

<style scoped>
	h2 {
		color: white;
		font-size: 18px;
		font-weight: lighter;
		padding: 0px 10px;
	}
	.smallConView {
		display: none;
		padding: 10px 10px;

		position: absolute;

		z-index: 5;
		overflow: auto;

		left: -5px;
		margin: 0px;
		background-color: #25124b;
	}

	.navBarCon {
		padding: 20px 10px;
		background-color: #25124b;
		width: 300px;
		height: 100vh;
		overflow-y: auto;
	}

	.navContent {
		padding: 20px 0px;
	}

	.navBtn {
		text-align: left;
		display: flex;
		justify-content: flex-start;
	}

	.navHeader {
		display: flex;
		align-items: center;
		padding: 0px 10px;
	}

	.smallConView .v-btn {
		margin-left: 5px;
		margin-top: 20px;
	}

	.detailsContentCon {
		margin-left: -10px;
	}

	.smallShow {
		display: none;
	}

	@media only screen and (max-width: 1000px) {
		.smallConView {
			display: flex;
		}
	}

	@media only screen and (max-width: 600px) {
		.smallShow {
			display: flex;
		}
	}

	@media only screen and (max-width: 540px) {
		.smallConView {
			background-color: transparent;
		}
		.smallConView .v-btn {
			height: 30px;
			width: 30px;
			margin-top: 0px;
		}
	}
</style>
