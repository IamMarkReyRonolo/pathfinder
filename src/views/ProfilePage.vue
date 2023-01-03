<template>
	<div class="profilePageCon">
		<div class="avatarCon">
			<v-avatar size="200"><img src="../assets/dp.png" alt="" /></v-avatar>
		</div>
		<br />
		<br />
		<div class="detail">
			<v-icon color="white">mdi-contacts</v-icon>
			<div class="text">{{ userStore.user.full_name }}</div>
		</div>
		<div class="detail">
			<v-icon color="white">mdi-emoticon</v-icon>
			<div class="text">{{ userStore.user.username }}</div>
		</div>
		<div class="detail">
			<v-icon color="white">mdi-alpha-i-box</v-icon>
			<div class="text">{{ userStore.user.uuid.split("-")[0] }}</div>
		</div>
	</div>
</template>

<script>
	import { useUserStore } from "../store/UserStore";
	export default {
		created() {},
		data: () => ({
			userStore: useUserStore(),
		}),
		methods: {},
	};
</script>

<style scoped>
	.profilePageCon {
		padding: 20px;
		width: 300px;
		margin: auto;
		text-align: center;
	}

	.detail {
		padding: 10px;
		display: flex;
		font-size: 18px;
	}
	.text {
		padding: 0px 10px;
	}
</style>
