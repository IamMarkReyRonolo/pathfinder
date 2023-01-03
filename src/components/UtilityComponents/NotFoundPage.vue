<template>
	<div class="notFoundPage">
		<div class="message">Page Not Found</div>
		<v-btn x-large block color="#c51ad5" dark rounded to="/login">
			Back To Page
		</v-btn>
	</div>
</template>

<script>
	export default {
		data: () => ({}),
		methods: {},
	};
</script>

<style scoped>
	.notFoundPage {
		padding: 40px;
	}
	.message {
		font-size: 24px;
		font-weight: bold;
		padding: 20px;
		color: white;
		text-align: center;
	}
</style>
