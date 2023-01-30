import { precacheAndRoute } from "workbox-precaching/precacheAndRoute";

self.__precacheManifest == [].concat(self.__precacheManifest || []);

precacheAndRoute(self.__WB_MANIFEST);

// if (!self.define) {
// 	let e,
// 		i = {};
// 	const n = (n, c) => (
// 		(n = new URL(n + ".js", c).href),
// 		i[n] ||
// 			new Promise((i) => {
// 				if ("document" in self) {
// 					const e = document.createElement("script");
// 					(e.src = n), (e.onload = i), document.head.appendChild(e);
// 				} else (e = n), importScripts(n), i();
// 			}).then(() => {
// 				let e = i[n];
// 				if (!e) throw new Error(`Module ${n} didn’t register its module`);
// 				return e;
// 			})
// 	);
// 	self.define = (c, r) => {
// 		const s =
// 			e ||
// 			("document" in self ? document.currentScript.src : "") ||
// 			location.href;
// 		if (i[s]) return;
// 		let l = {};
// 		const o = (e) => n(e, s),
// 			u = { module: { uri: s }, exports: l, require: o };
// 		i[s] = Promise.all(c.map((e) => u[e] || o(e))).then((e) => (r(...e), l));
// 	};
// }
// define(["./workbox-2d118ab0"], function (e) {
// 	"use strict";
// 	e.setCacheNameDetails({ prefix: "tms-frontend" }),
// 		self.addEventListener("message", (e) => {
// 			e.data && "SKIP_WAITING" === e.data.type && self.skipWaiting();
// 		}),
// 		e.precacheAndRoute(
// 			[
// 				{ url: "/css/app.c597a434.css", revision: null },
// 				{ url: "/css/chunk-vendors.d1145c59.css", revision: null },
// 				{ url: "/img/Ellipse2.f36a9106.png", revision: null },
// 				{ url: "/img/emptyTrash.bcd4b1c3.png", revision: null },
// 				{
// 					url: "/img/icons2/output-onlinepngtools.png",
// 					revision: "b0465f8cf059de993704a836fa234a0c",
// 				},
// 				{
// 					url: "/img/icons2/recycle-bin(1)-256.png",
// 					revision: "b4a8bb872cbd67a1aa3a792d7803b8bb",
// 				},
// 				{
// 					url: "/img/icons2/recycle-bin(2)-128.png",
// 					revision: "ee6fc246d1733c1ef24d7f2a6353d82e",
// 				},
// 				{
// 					url: "/img/icons2/recycle-bin(3)-64.png",
// 					revision: "b230e70d3ae6552390ec34497f28ef4c",
// 				},
// 				{
// 					url: "/img/icons2/recycle-bin(4)-32.png",
// 					revision: "d796887031a2b468c774c80e9dbfe497",
// 				},
// 				{
// 					url: "/img/icons2/recycle-bin(5)-16.png",
// 					revision: "41e37a869bbfe95cd90b1760bf161450",
// 				},
// 				{
// 					url: "/img/icons2/recycle-bin-512.png",
// 					revision: "e33b961ddb5204f7bba7a501193e5907",
// 				},
// 				{
// 					url: "/img/icons2/recycle_bin_1__256_Af1_icon.ico",
// 					revision: "4b003c6b43fd20968bac280da5382fda",
// 				},
// 				{ url: "/img/no statistics.c4823ddc.png", revision: null },
// 				{ url: "/img/no teachers.49c5f5ed.png", revision: null },
// 				{ url: "/img/recycling.2ee72655.png", revision: null },
// 				{ url: "/img/schedule.b12cc302.png", revision: null },
// 				{ url: "/img/undraw_bug_fixing_oc-7-a 1.5cdfea92.png", revision: null },
// 				{ url: "/index.html", revision: "9d09023c90edfcef15dae5b5773acc5b" },
// 				{ url: "/js/app.e3504e79.js", revision: null },
// 				{ url: "/js/chunk-vendors.8ff6536c.js", revision: null },
// 				{ url: "/manifest.json", revision: "cd85cd6d9445026ce4ed2c75a13c7651" },
// 				{ url: "/robots.txt", revision: "b6216d61c03e6ce0c9aea6ca7808f7ca" },
// 			],
// 			{}
// 		);
// });

self.addEventListener("push", (event) => {
	let options = {};
	if (event.data.text() == "Buzzer") {
		options = {
			body: "Calling all teachers for trash collection. If you have any trash to deposit please proceed to the designated area along with your FeedbACTS Card.",
			icon: "./img/icons2/recycle-bin-512.png",
			vibrate: [100, 50, 100],
			tag: "vibration-smaple",
		};
	} else {
		options = {
			body: "Your trash has been recorded. You may read the feedback from admin.",
			icon: "./img/icons2/recycle-bin-512.png",
			vibrate: [100, 50, 100],
			tag: "vibration-smaple",
		};
	}

	event.waitUntil(
		self.registration.showNotification("Buzzer Sounded", options)
	);
});

self.addEventListener("notificationclick", (event) => {
	const notification = event.notification;
	const action = event.action;

	if (action === "close") {
		notification.close();
	} else {
		const promiseChain = clients.openWindow("https://feedbacts.vercel.app/");
		event.waitUntil(promiseChain);
	}
});

//# sourceMappingURL=service-worker.js.map
