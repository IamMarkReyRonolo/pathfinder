<template>
	<div class="pathFinderDiv" app>
		<!--Navbar Here -->

		<v-navigation-drawer v-model="drawer" app width="370">
			<div class="drawer">
				<div class="headerDiv">
					<div class="iconDiv">
						<img src="../assets/icon.png" alt="" />
					</div>
					<h3>PathFinder</h3>
				</div>

				<div class="searchbar">
					<v-text-field placeholder="Search Channels" solo dense></v-text-field>
				</div>

				<div class="listOfChannels">
					<div
						class="channel"
						v-for="channel in channels"
						:key="channel.channelID"
						:class="channel.clicked ? 'chosen' : ''"
					>
						<div class="left">
							<v-avatar class="white--text" color="primary">{{
								channel.channelName.split("")[0]
							}}</v-avatar>
							<div class="channelDetails">
								<div class="name">{{ channel.channelName }}</div>
								<div class="id">{{ channel.channelID }}</div>
							</div>
						</div>

						<div class="right">
							<v-btn rounded small>view</v-btn>
						</div>
					</div>
				</div>
			</div>
		</v-navigation-drawer>

		<div class="mapHeader">
			<v-icon
				color="#1f2a53"
				@click="drawer = true"
				v-if="!drawer"
				style="margin: 0px 5px"
				>mdi-backburger</v-icon
			>
			<v-icon
				color="#1f2a53"
				@click="drawer = false"
				v-if="drawer"
				style="margin: 0px 5px"
				>mdi-forwardburger</v-icon
			>
			<h3>Channel: <v-btn rounded small class="primary">Raffy</v-btn></h3>
			<v-btn @click="showTerms = true">Click</v-btn>
		</div>
		<Map />
	</div>
</template>

<script>
	import Map from "./Map.vue";

	export default {
		components: {
			Map,
		},
		data: () => ({
			drawer: true,
			showTerms: false,
			channels: [
				{
					channelName: "Raffy",
					channelID: "123123123",
					clicked: true,
				},
				{
					channelName: "Eiron",
					channelID: "43434343",
					clicked: false,
				},
				{
					channelName: "Chad",
					channelID: "1232345",
					clicked: false,
				},
			],
		}),
	};
</script>

<style scoped>
	.drawer {
		padding: 10px 30px;
	}
	.headerDiv {
		display: flex;
		align-items: center;
	}

	.searchbar {
		width: 300px;
		margin: auto;
		padding-top: 10px;
	}

	.channel {
		padding: 10px 15px;
		/* border-bottom: 1px solid rgb(182, 182, 182);
		border-top: 1px solid rgb(182, 182, 182); */
		border-radius: 5px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.left {
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.channelDetails {
		margin: 0px 10px;
	}

	.id {
		font-size: 10px;
		font-weight: lighter;
	}

	.chosen {
		background-color: rgb(218, 218, 218);
		color: white;
		border: none;
	}

	.mapHeader {
		display: flex;
		align-items: center;
		padding: 20px;
		background-color: white;
	}

	.iconDiv {
		padding: 5px 10px;
	}
	.iconDiv img {
		width: 40px;
	}

	.headerDiv h3,
	.mapHeader h3 {
		color: #1f2a53;
		font-weight: 600;
	}
</style>
