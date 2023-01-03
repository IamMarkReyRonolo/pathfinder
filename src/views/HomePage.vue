<template>
	<div class="homePageCon">
		<v-btn x-large block color="#c51ad5" dark to="/connections" rounded>
			<v-icon>mdi-contacts</v-icon>
			<span style="width: 150px; padding-right: 5px; text-align: left"
				>Connections</span
			></v-btn
		>
		<v-btn x-large block color="#c51ad5" dark to="/findMe" rounded>
			<v-icon size="35">mdi-map-marker-account</v-icon>
			<span style="width: 150px; padding-right: 5px; text-align: left"
				>Find Me</span
			></v-btn
		>
		<v-btn x-large block color="#c51ad5" dark rounded>
			<v-icon size="30">mdi-map-legend</v-icon>
			<span style="width: 150px; padding-right: 5px; text-align: left"
				>Map</span
			>
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
	.homePageCon {
		padding: 20px;
		width: 300px;
		margin: auto;
	}

	.v-btn {
		margin: 30px 0px;
		display: flex;
		justify-content: space-evenly;
	}
</style>
