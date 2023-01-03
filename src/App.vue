<template>
	<v-app>
		<v-main>
			<router-view />
		</v-main>
	</v-app>
</template>

<script>
	export default {
		name: "App",

		data: () => ({
			//
		}),
	};
</script>

<style>
	#app {
		font-family: "Poppins", sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		background: rgb(245, 2, 254);
		background: linear-gradient(
			344deg,
			rgba(245, 2, 254, 1) 0%,
			rgba(40, 6, 111, 1) 47%
		);
	}
	.mainApp {
		background: rgb(245, 2, 254);
		background: linear-gradient(
			344deg,
			rgba(245, 2, 254, 1) 0%,
			rgba(40, 6, 111, 1) 47%
		);
	}
</style>
