<template>
	<div class="main">
		<!-- <v-btn @click="showAllRoutes">Click</v-btn>
		<v-btn @click="removeAllRoutes">Remove</v-btn>
		<v-btn @click="addRoute">Add route</v-btn>
		<v-btn @click="removeCustomMarker">Remove custom route</v-btn> -->
		<div class="sectionHeader">
			<v-btn rounded small color="#c51ad5" dark>
				{{ this.userLocations.length }} people responded.
			</v-btn>
			<v-btn @click="showAllRoutes" rounded>Show Routes</v-btn>
			<!-- <v-btn @click="showAllRoutes">Hide Routes</v-btn> -->
			{{ listenForUsers }}
		</div>

		<div class="map-holder">
			<div class="loading" v-if="loading">
				<div class="loadingDiv">
					<v-progress-circular :size="200" color="primary" indeterminate>
						<div class="loadingAnim">
							<h2>PathFinder</h2>
							<div class="iconDiv">
								<img src="../assets/icon.png" alt="" />
							</div>
						</div>
					</v-progress-circular>
				</div>
			</div>
		</div>
		<div id="map"></div>
	</div>
</template>

<script>
	import mapboxgl from "mapbox-gl";
	import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
	import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
	import axios from "axios";
	import db from "../db";
	import { useUserStore } from "../store/UserStore";

	export default {
		props: {
			sessionCode: String,
		},
		data() {
			return {
				userStore: useUserStore(),
				loading: false,
				fetched: false,
				location: "",
				access_token:
					"pk.eyJ1Ijoibm92ZW56YW1vcmEiLCJhIjoiY2xhZTI3dWQzMHB4OTNwczQ3ZjI2MWtjdSJ9.Xuj3yEJzk9DZMf00LCEZLQ",
				center: [0, 0],
				map: {},
				geojson: {
					type: "FeatureCollection",
					features: [
						{
							type: "Feature",
							properties: {
								name: "Raffy",
								iconSize: [60, 60],
							},
							geometry: {
								type: "Point",
								coordinates: [-66.324462, -16.024695],
							},
						},
						{
							type: "Feature",
							properties: {
								name: "Eiron",
								iconSize: [50, 50],
							},
							geometry: {
								type: "Point",
								coordinates: [-61.21582, -15.971891],
							},
						},
						{
							type: "Feature",
							properties: {
								name: "Chad",
								iconSize: [40, 40],
							},
							geometry: {
								type: "Point",
								coordinates: [-63.292236, -18.281518],
							},
						},
					],
				},
				customMarker: null,
				user: {},
				lat: 0,
				lng: 0,
				userLocations: [],
				currentMarkers: [],
				updateSource: {},
			};
		},

		async mounted() {
			this.loading = true;

			// setTimeout(() => {
			// 	this.getUserLocations();
			// 	this.startLocationUpdates();
			// 	this.initializeMap();
			// 	this.loading = false;
			// }, 1500);

			this.getUserLocations();
			this.startLocationUpdates();
			this.initializeMap();
		},

		destroyed() {
			clearInterval(this.updateSource);
		},

		methods: {
			startLocationUpdates() {
				if (navigator.geolocation) {
					navigator.geolocation.watchPosition(
						(position) => {
							this.lng = position.coords.longitude;
							this.lat = position.coords.latitude;

							db.database()
								.ref(
									"locationUsers/" +
										this.sessionCode +
										"/" +
										this.userStore.user.uuid
								)
								.set({
									username: this.user.username,
									coordinates: [this.lng, this.lat],
								});
						},
						(error) => {
							console.log(error.message);
						}
					);
				}
			},
			async getUserLocations() {
				try {
					this.fetched = false;

					this.user.username = this.userStore.user.full_name;
					db.database()
						.ref(
							"locationUsers/" +
								this.sessionCode +
								"/" +
								this.userStore.user.uuid
						)
						.set({
							username: this.user.username,
							coordinates: [this.lng, this.lat],
						});

					const locationsRef = db
						.database()
						.ref("locationUsers/" + this.sessionCode);

					// const location = {
					// 	username: this.user.username,
					// 	coordinates: [this.lat, this.lng],
					// };
					// locationsRef.push(location);
					locationsRef.on("value", (snapshot) => {
						if (snapshot.exists()) {
							const data = snapshot.val();
							let userLocations = [];
							Object.keys(data).forEach((user) => {
								userLocations.push(data[user]);
							});

							this.userLocations = userLocations;
						} else {
							console.log("node do not exist");
							this.snackbar = true;
							this.message = "Find Me event has ended.";
							this.status = "Success";
							setTimeout(() => {
								this.$router.push("/home");
							}, 1500);
						}
					});

					setTimeout(() => {
						this.fetched = true;
					}, 1000);
				} catch (error) {
					console.log(error);
					this.fetched = false;
					this.loading = false;
					this.error = false;
				}
			},

			async initializeMap() {
				mapboxgl.accessToken = this.access_token;
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition((position) => {
						this.lng = position.coords.longitude;
						this.lat = position.coords.latitude;
						db.database()
							.ref(
								"locationUsers/" +
									this.sessionCode +
									"/" +
									this.userStore.user.uuid
							)
							.set({
								username: this.user.username,
								coordinates: [this.lng, this.lat],
							});
						this.createMap(position);
					});
				} else {
					this.createMap([0, 0]);
				}
			},
			async createMap(position) {
				try {
					const lng = position.coords.longitude;
					const lat = position.coords.latitude;
					this.center = [lng, lat];

					this.map = new mapboxgl.Map({
						container: "map",
						style: "mapbox://styles/mapbox/streets-v11",
						center: this.center,
						zoom: 1,
						projection: "globe",
					});

					this.map.on("style.load", () => {
						this.loading = false;
						this.map.setFog({});
					});

					this.map.on("load", () => {
						this.addFriendsLocations();
					});

					this.addMapControls();
					// this.addClickEvents();
				} catch (err) {
					console.log("map error", err);
				}
			},

			addMapControls() {
				// this.map.addControl(
				// 	new MapboxGeocoder({
				// 		accessToken: this.access_token,
				// 		mapboxgl: mapboxgl,
				// 		marker: true,
				// 	}).on("result", (e) => {
				// 		new mapboxgl.Marker({
				// 			draggable: false,
				// 			color: "#D80739",
				// 		})
				// 			.setLngLat(e.result.center)
				// 			.addTo(this.map);
				// 		this.center = e.result.center;
				// 	})
				// );
				this.map.addControl(
					new mapboxgl.GeolocateControl({
						positionOptions: {
							enableHighAccuracy: true,
						},
						trackUserLocation: true,
						showUserHeading: true,
					})
				);

				// this.map.addControl(
				// 	new MapboxDirections({
				// 		accessToken: mapboxgl.accessToken,
				// 		geometries: "geojson",
				// 		controls: { instructions: false },
				// 	}),
				// 	"top-left"
				// );

				// const directions = new MapboxDirections({
				// 	accessToken: mapboxgl.accessToken,
				// 	unit: "metric",
				// 	profile: "mapbox/walking",
				// 	alternatives: false,
				// 	geometries: "geojson",
				// 	controls: { instructions: false },
				// 	flyTo: false,
				// });

				// this.map.addControl(directions, "top-left");
				// this.map.scrollZoom.enable();
			},

			addFriendsLocations() {
				if (this.currentMarkers.length != 0) {
					for (var i = this.currentMarkers.length - 1; i >= 0; i--) {
						this.currentMarkers[i].remove();
					}
				}

				for (const marker of this.userLocations) {
					// Create a DOM element for each marker.
					const el = document.createElement("div");

					const width = 40;
					const height = 40;

					el.textContent = `${marker.username.split(" ")[0]}`;
					el.className = "marker";
					el.style.backgroundColor = "#28066f";
					el.style.color = "white";
					el.style.display = "flex";
					el.style.boxShadow =
						"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)";
					el.style.justifyContent = "center";
					el.style.alignItems = "center";

					el.style.width = `${width}px`;
					el.style.height = `${height}px`;
					el.style.backgroundSize = "100%";
					el.style.borderRadius = "100%";
					el.style.cursor = "pointer";

					// el.addEventListener("click", () => {
					// 	this.map.flyTo({
					// 		center: marker.coordinates,
					// 	});
					// 	this.removeAllRoutes();
					// 	this.apiCall(
					// 		this.userLocations[0].coordinates[0],
					// 		this.userLocations[0].coordinates[1],
					// 		marker.coordinates[0],
					// 		marker.coordinates[1],
					// 		marker.username
					// 	);
					// });

					// el.addEventListener("mouseenter", () => {
					// 	// Copy coordinates array.
					// 	const coordinates = marker.coordinates.slice();
					// 	const description = marker.username;

					// 	// Ensure that if the map is zoomed out such that multiple
					// 	// copies of the feature are visible, the popup appears
					// 	// over the copy being pointed to.
					// 	// while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
					// 	// 	coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
					// 	// }

					// 	// Populate the popup and set its coordinates
					// 	// based on the feature found.
					// 	popup.setLngLat(coordinates).setHTML(description).addTo(this.map);
					// });

					// el.addEventListener("mouseleave", () => {
					// 	popup.remove();
					// });

					// Add markers to the map.
					const onemarker = new mapboxgl.Marker(el)
						.setLngLat(marker.coordinates)
						.setPopup(
							new mapboxgl.Popup({ offset: 25 }) // add popups
								.setHTML(`<div style="color: black;">${marker.username}</div>`)
						)
						.addTo(this.map);

					this.currentMarkers.push(onemarker);
				}
			},

			async apiCall(from_one, from_two, to_one, to_two, naming) {
				const data = await axios.get(
					"https://api.mapbox.com/directions/v5/mapbox/walking/" +
						from_one +
						"," +
						from_two +
						";" +
						to_one +
						"," +
						to_two +
						"?access_token=" +
						this.access_token +
						"&geometries=geojson"
				);

				this.map.addLayer({
					id: naming,
					type: "line",
					source: {
						type: "geojson",
						data: {
							type: "Feature",
							properties: {},
							geometry: data.data.routes[0].geometry,
						},
					},
					layout: {
						"line-join": "round",
						"line-cap": "round",
					},
					paint: {
						"line-color": "#ff7e5f",
						"line-width": 8,
					},
				});
			},

			showAllRoutes() {
				this.removeAllRoutes();
				this.userLocations.forEach((marker) => {
					this.map.flyTo({
						center: marker.coordinates,
					});
					this.apiCall(
						this.userLocations[0].coordinates[0],
						this.userLocations[0].coordinates[1],
						marker.coordinates[0],
						marker.coordinates[1],
						marker.username
					);
				});
			},

			showAllRoutesToCustomRoute(coordinates) {
				this.removeAllRoutes();

				this.geojson.features.forEach((marker) => {
					this.apiCall(
						coordinates[1],
						coordinates[0],
						marker.geometry.coordinates[0],
						marker.geometry.coordinates[1],
						marker.properties.name
					);
				});
			},

			removeAllRoutes() {
				this.userLocations.forEach((marker) => {
					if (this.map.getLayer(marker.username)) {
						this.map.removeLayer(marker.username);
					}
					if (this.map.getSource(marker.username)) {
						this.map.removeSource(marker.username);
					}
				});
			},

			addRoute() {
				this.map.on("click", this.add_marker);
			},

			add_marker(event) {
				const el = document.createElement("div");
				const width = 50;
				const height = 50;
				el.className = "custom-marker";
				el.style.backgroundImage = `url(https://placekitten.com/g/${width}/${height}/)`;
				el.style.width = `${width}px`;
				el.style.height = `${height}px`;
				el.style.backgroundSize = "100%";
				el.style.borderRadius = "100%";
				el.style.cursor = "pointer";

				this.removeCustomMarker();
				this.customMarker = new mapboxgl.Marker(el);
				var coordinates = event.lngLat;
				this.customMarker.setLngLat(coordinates).addTo(this.map);

				this.showAllRoutesToCustomRoute([coordinates.lat, coordinates.lng]);
			},

			removeCustomMarker() {
				if (this.customMarker) {
					this.customMarker.remove();
					this.removeAllRoutes();
				}
			},
		},

		computed: {
			listenForUsers: function () {
				this.updateSource = setInterval(async () => {
					this.addFriendsLocations();
				}, 1000);
			},
		},
	};
</script>

<style scoped>
	#map {
		margin: auto;
		width: 100%;
		height: 80vh;
		margin-bottom: -50px;
	}

	.loading {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
	}

	.loadingDiv {
		margin-top: 70px;
	}

	.loadingAnim h2 {
		font-size: 18px;
		color: white;
	}

	.loadingAnim .iconDiv img {
		width: 100px;
	}

	.sectionHeader {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px 20px;
	}

	.marker {
		background-image: url("https://placekitten.com/g/40/40/");
		width: 40px;
		height: 40px;
		background-size: 100%;
		border-radius: 100%;
		cursor: pointer;
	}
</style>
