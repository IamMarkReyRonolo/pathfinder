<template>
	<div class="main">
		<v-btn @click="showAllRoutes">Click</v-btn>
		<v-btn @click="removeAllRoutes">Remove</v-btn>
		<v-btn @click="addRoute">Add route</v-btn>
		<v-btn @click="removeCustomMarker">Remove custom route</v-btn>
		<div class="map-holder">
			<div class="loading" v-if="loading">
				<div class="loadingDiv">
					<v-progress-circular :size="200" color="primary" indeterminate>
						<div class="loadingAnim">
							<h2 class>PathFinder</h2>
							<div class="iconDiv">
								<img src="../assets/icon.png" alt="" />
							</div>
						</div>
					</v-progress-circular>
				</div>
			</div>
		</div>
		<div id="map" v-if="!loading"></div>
	</div>
</template>

<script>
	import mapboxgl from "mapbox-gl";
	import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
	import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
	import axios from "axios";

	export default {
		data() {
			return {
				loading: false,
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
			};
		},

		async mounted() {
			this.loading = true;

			setTimeout(() => {
				this.initializeMap();
				this.loading = false;
			}, 1500);
		},

		methods: {
			async initializeMap() {
				mapboxgl.accessToken = this.access_token;
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition((position) => {
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
						zoom: 2,
						projection: "globe",
					});

					this.map.on("style.load", () => {
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
				this.map.addControl(
					new MapboxGeocoder({
						accessToken: this.access_token,
						mapboxgl: mapboxgl,
						marker: true,
					}).on("result", (e) => {
						new mapboxgl.Marker({
							draggable: false,
							color: "#D80739",
						})
							.setLngLat(e.result.center)
							.addTo(this.map);
						this.center = e.result.center;
					})
				);
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
				for (const marker of this.geojson.features) {
					// Create a DOM element for each marker.
					const el = document.createElement("div");
					const width = marker.properties.iconSize[0];
					const height = marker.properties.iconSize[1];
					el.className = "marker";
					el.style.backgroundImage = `url(https://placekitten.com/g/${width}/${height}/)`;
					el.style.width = `${width}px`;
					el.style.height = `${height}px`;
					el.style.backgroundSize = "100%";
					el.style.borderRadius = "100%";
					el.style.cursor = "pointer";

					const popup = new mapboxgl.Popup({
						closeButton: false,
						closeOnClick: false,
					});

					el.addEventListener("click", () => {
						this.map.flyTo({
							center: marker.geometry.coordinates,
						});
						this.removeAllRoutes();
						this.apiCall(
							this.geojson.features[0].geometry.coordinates[0],
							this.geojson.features[0].geometry.coordinates[1],
							marker.geometry.coordinates[0],
							marker.geometry.coordinates[1],
							marker.properties.name
						);
					});

					el.addEventListener("mouseenter", () => {
						// Copy coordinates array.
						const coordinates = marker.geometry.coordinates.slice();
						const description = marker.properties.name;

						// Ensure that if the map is zoomed out such that multiple
						// copies of the feature are visible, the popup appears
						// over the copy being pointed to.
						// while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
						// 	coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
						// }

						// Populate the popup and set its coordinates
						// based on the feature found.
						popup.setLngLat(coordinates).setHTML(description).addTo(this.map);
					});

					el.addEventListener("mouseleave", () => {
						popup.remove();
					});

					// Add markers to the map.
					new mapboxgl.Marker(el)
						.setLngLat(marker.geometry.coordinates)
						.addTo(this.map);
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
				this.geojson.features.forEach((marker) => {
					this.apiCall(
						this.geojson.features[0].geometry.coordinates[0],
						this.geojson.features[0].geometry.coordinates[1],
						marker.geometry.coordinates[0],
						marker.geometry.coordinates[1],
						marker.properties.name
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
				this.geojson.features.forEach((marker) => {
					if (this.map.getLayer(marker.properties.name)) {
						this.map.removeLayer(marker.properties.name);
					}
					if (this.map.getSource(marker.properties.name)) {
						this.map.removeSource(marker.properties.name);
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
	};
</script>

<style scoped>
	#map {
		margin: auto;
		width: 100%;
		height: 100vh;
	}

	.loading {
		width: 100%;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
	}

	.loadingDiv {
		margin-top: -100px;
	}

	.loadingAnim h2 {
		font-size: 20px;
		color: #1f2a53;
	}

	.loadingAnim .iconDiv img {
		width: 100px;
	}
</style>
