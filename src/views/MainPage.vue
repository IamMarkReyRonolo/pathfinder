<template>
	<div class="homePageCon">
		<div class="fetched" v-if="fetched">
			<div class="headerSectionCon">
				<div class="leftCon">
					<SideNav
						:openBurger="openBurger"
						:overlay="openBurger"
						@closeNav="openBurger = false"
						@openNav="openBurger = true"
						v-if="openBurger"
					/>
					<Notifications
						:showNotifications="showNotifications"
						v-if="showNotifications"
						@closeNotifications="showNotifications = false"
					/>
					<v-btn fab small id="drawerBtn" @click="openBurger = true">
						<v-avatar size="40" color="white" v-if="!openBurger"
							><img src="../assets/dp.png" alt="" /></v-avatar
					></v-btn>
					<h2>PathFinder</h2>
				</div>
				<div class="rightCon">
					<v-btn fab small @click="showNotifications = true" text
						><v-icon size="30" color="white">mdi-bell-outline</v-icon></v-btn
					>
				</div>
			</div>
			<div class="viewCon">
				<router-view />
			</div>
		</div>
		<div class="loading" v-if="loading">
			<v-progress-circular
				:size="70"
				:width="5"
				color="purple"
				indeterminate
			></v-progress-circular>
		</div>
		<div class="errorCon" v-if="error">Error Refresh Page</div>
	</div>
</template>

<script>
	import SideNav from "../components/MainPageComponents/SideNav.vue";
	import Notifications from "../components/MainPageComponents/Notifications.vue";
	import { useUserStore } from "../store/UserStore.js";
	export default {
		components: { SideNav, Notifications },
		async created() {
			this.loading = true;
			this.fetched = false;
			await this.userStore.getUserData();
			if (this.userStore.error) {
				this.handleAuthError(this.userStore.error);
			} else {
				this.fetched = true;
			}
			this.loading = false;

			if (this.$route.name == "main") {
				this.$router.push({
					name: "home",
				});
			}
		},
		data: () => ({
			userStore: useUserStore(),
			openBurger: false,
			showNotifications: false,
			fetched: true,
			loading: false,
			error: false,
		}),
		methods: {
			handleAuthError(error) {
				if (error.request.status == 403 || error.request.status == 404) {
					localStorage.removeItem("token");
					this.$router.push({
						name: "login",
					});
				}
				if (error.message == "Network Error") {
					this.error = true;
				}
			},
		},
	};
</script>

<style scoped>
	.homePageCon {
		color: white;
	}
	.headerSectionCon {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px 20px;
	}

	.leftCon {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	h2 {
		padding: 10px;
		font-weight: lighter;
	}

	.loading,
	.errorCon {
		position: absolute;
		top: 40%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.viewCon {
		padding-bottom: 50px;
	}
</style>
