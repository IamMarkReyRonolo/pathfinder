import Vue from "vue";
import VueRouter from "vue-router";
import PathFinder from "../views/PathFinder.vue";
import MainPage from "../views/MainPage.vue";
import HomePage from "../views/HomePage";
import ConnectionPage from "../views/ConnectionsPage";
import FindMePage from "../views/FindMePage";
import LogInPage from "../views/LogInPage.vue";
import SignUpPage from "../views/SignUpPage.vue";
import ProfilePage from "../views/ProfilePage.vue";
import NotFoundPage from "../components/UtilityComponents/NotFoundPage.vue";
Vue.use(VueRouter);

const routes = [
	{
		path: "/",
		name: "main",
		component: MainPage,
		children: [
			{
				path: "home",
				name: "home",
				component: HomePage,
				props: {
					header: true,
					content: true,
				},
			},
			{
				path: "connections",
				name: "connections",
				component: ConnectionPage,
				props: {
					header: true,
					content: true,
				},
			},
			{
				path: "findMe",
				name: "findMe",
				component: FindMePage,
				props: {
					header: true,
					content: true,
				},
			},
			{
				path: "profile",
				name: "profile",
				component: ProfilePage,
				props: {
					header: true,
					content: true,
				},
			},
		],
	},
	{
		path: "/login",
		name: "login",
		component: LogInPage,
	},
	{
		path: "/signup",
		name: "signup",
		component: SignUpPage,
	},
	{
		path: "/old",
		name: "pathfinder",
		component: PathFinder,
	},
	{ path: "*", component: NotFoundPage },
];

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes,
});

export default router;
