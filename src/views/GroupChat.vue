<template>
	<div class="view chat">
		<section class="chat-box">
			<div class="chatHeader">
				<h2>Chat</h2>
				<v-btn fab small color="#28066f" dark @click="$emit('closeChat')"
					><v-icon>mdi-close</v-icon></v-btn
				>
			</div>
			<br />
			<div class="waitOnMessage" v-if="loading || error">
				<div class="loading" v-if="loading">
					<v-progress-circular
						:size="40"
						:width="5"
						color="purple"
						indeterminate
					></v-progress-circular>
				</div>
				<div class="errorCon" v-if="error">Check Internet Connection</div>
			</div>
			<div v-if="fetched">
				<div
					class="messageContent"
					v-chat-scroll
					id="messageContent"
					ref="message"
				>
					<div
						v-for="message in state.messages"
						:key="message.key"
						:class="
							message.username == state.username
								? 'message current-user'
								: message.username == 'Bot'
								? ''
								: 'message'
						"
					>
						<div class="message-inner" v-if="message.username != 'Bot'">
							<div class="username">{{ message.username }}</div>
							<div class="content">{{ message.content }}</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<footer>
			<form @submit.prevent="SendMessage">
				<input
					type="text"
					v-model="inputMessage"
					placeholder="Write a message..."
				/>
				<input type="submit" value="Send" />
			</form>
		</footer>

		<Snackbar
			:snackbar="snackbar"
			:message="message"
			:status="status"
			@closeSnackbar="snackbar = false"
			v-if="snackbar"
		/>
	</div>
</template>

<script>
	import db from "../db";
	import { useUserStore } from "../store/UserStore";
	import Snackbar from "../components/GeneralModals/Snackbar.vue";
	export default {
		components: {
			Snackbar,
		},
		created() {},
		props: {
			sessionCode: String,
		},
		data: () => ({
			userStore: useUserStore(),
			inputUsername: "",
			inputMessage: "",
			state: { username: "", messages: [] },
			loading: false,
			fetched: false,
			error: false,
			snackbar: false,
			status: null,
			message: "",
		}),

		methods: {
			SendMessage() {
				const messagesRef = db.database().ref("groupChat/" + this.sessionCode);
				if (this.inputMessage === "" || this.inputMessage === null) {
					return;
				}
				const message = {
					username: this.state.username,
					content: this.inputMessage,
				};
				messagesRef.push(message);
				this.inputMessage = "";

				const database = db.database();
				const fieldRef = database.ref(
					"Users/" +
						this.userStore.user.uuid +
						"/countOfSentMessagesInRooms/" +
						this.sessionCode
				);

				fieldRef.transaction(function (currentValue) {
					return (currentValue || 0) + 1;
				});
			},

			async DeleteGroupChat() {
				try {
					const messagesRef = db
						.database()
						.ref("groupChat/" + this.sessionCode);
					const result = await messagesRef.delete();
				} catch (error) {
					console.log(result);
				}
			},
		},

		computed: {
			scrollDownMessages: function () {
				var objDiv = this.$refs.message;
				console.log(objDiv);
				// objDiv.scrollTop = objDiv.scrollHeight;
			},
		},

		mounted() {
			try {
				this.fetched = false;
				this.loading = true;
				this.state.username = this.userStore.user.full_name;
				const messagesRef = db.database().ref("groupChat/" + this.sessionCode);
				const message = {
					username: "Bot",
					content: "Event is active.",
				};
				messagesRef.push(message);
				messagesRef.on("value", (snapshot) => {
					if (snapshot.exists()) {
						const data = snapshot.val();
						let messages = [];
						Object.keys(data).forEach((key) => {
							messages.push({
								id: key,
								username: data[key].username,
								content: data[key].content,
							});
						});
						this.state.messages = messages;
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
					this.loading = false;
				}, 1000);
			} catch (error) {
				console.log(error);
				this.fetched = false;
				this.loading = false;
				this.error = false;
			}
		},
	};
</script>

<style lang="scss" scoped>
	* {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	.loading,
	.errorCon {
		position: absolute;
		top: 5%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.errorCon {
		color: black;
	}

	.waitOnMessage {
		height: 300px;
		padding: 20px;
	}

	.view,
	.chat {
		position: absolute;
		max-height: 50vh;
		min-height: 50vh;
		bottom: 0px;
		z-index: 100;
	}

	.messageContent {
		max-height: 50vh;
		min-height: 50vh;
		overflow-y: auto;
	}

	.chatHeader {
		display: flex;
		justify-content: space-between;
		color: black;
		margin-top: -20px;
		font-size: 20px;
		padding: 0px 0px;
	}
	.view {
		display: flex;
		justify-content: center;
		background-color: #28066f;

		&.login {
			align-items: center;
			.login-form {
				display: block;
				width: 100%;
				padding: 15px;

				.form-inner {
					display: block;
					background-color: #fff;
					padding: 50px 15px;
					border-radius: 16px;
					box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
					h1 {
						color: #aaa;
						font-size: 28px;
						margin-bottom: 30px;
					}
					label {
						display: block;
						margin-bottom: 5px;
						color: #aaa;
						font-size: 16px;
						transition: 0.4s;
					}
					input[type="text"] {
						appearance: none;
						border: none;
						outline: none;
						background: none;
						display: block;
						width: 100%;
						padding: 10px 15px;
						border-radius: 8px;
						margin-bottom: 15px;

						color: #333;
						font-size: 18px;
						box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
						background-color: #f3f3f3;
						transition: 0.4s;
						&::placeholder {
							color: #888;
							transition: 0.4s;
						}
					}
					input[type="submit"] {
						appearance: none;
						border: none;
						outline: none;
						background: none;
						display: block;
						width: 100%;
						padding: 10px 15px;
						background-color: #28066f;
						border-radius: 8px;
						color: #fff;
						font-size: 18px;
						font-weight: 700;
					}
					&:focus-within {
						label {
							color: #28066f;
						}
						input[type="text"] {
							background-color: #fff;
							box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
							&::placeholder {
								color: #666;
							}
						}
					}
				}
			}
		}
		&.chat {
			flex-direction: column;
			header {
				position: relative;
				display: block;
				width: 100%;
				padding: 50px 30px 10px;
				.logout {
					position: absolute;
					top: 15px;
					right: 15px;
					appearance: none;
					border: none;
					outline: none;
					background: none;

					color: #fff;
					font-size: 18px;
					margin-bottom: 10px;
					text-align: right;
				}
				h1 {
					color: #fff;
				}
			}
			.chat-box {
				margin-top: -200px;
				border-radius: 24px 24px 0px 0px;
				background-color: #fff;
				box-shadow: 0px 0px 12px rgba(100, 100, 100, 0.2);
				flex: 1 1 100%;
				padding: 30px;
				width: 100vw;

				.message {
					display: flex;
					margin-bottom: 15px;

					.message-inner {
						.username {
							color: #888;
							font-size: 16px;
							margin-bottom: 5px;
							padding-left: 15px;
							padding-right: 15px;
						}
						.content {
							display: inline-block;
							padding: 10px 20px;
							background-color: #f3f3f3;
							border-radius: 20px;
							color: #333;
							font-size: 18px;
							line-height: 1.2em;
							text-align: left;
						}
					}
					&.current-user {
						margin-top: 30px;
						justify-content: flex-end;
						text-align: right;
						.message-inner {
							max-width: 75%;
							.content {
								color: #fff;
								font-weight: 600;
								background-color: #28066f;
							}
						}
					}
				}
			}
			footer {
				position: sticky;
				bottom: 0px;
				width: 100vw;
				background-color: #fff;
				padding: 30px;
				box-shadow: 0px 0px 12px rgba(100, 100, 100, 0.2);
				form {
					display: flex;
					input[type="text"] {
						flex: 1 1 100%;
						appearance: none;
						border: none;
						outline: none;
						background: none;
						display: block;
						width: 100%;
						padding: 10px 15px;
						border-radius: 8px 0px 0px 8px;

						color: #333;
						font-size: 18px;
						box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
						background-color: #f3f3f3;
						transition: 0.4s;
						&::placeholder {
							color: #888;
							transition: 0.4s;
						}
					}

					input[type="submit"] {
						appearance: none;
						border: none;
						outline: none;
						background: none;
						display: block;
						padding: 10px 15px;
						border-radius: 0px 8px 8px 0px;
						background-color: #28066f;
						color: #fff;
						font-size: 18px;
						font-weight: 700;
					}
				}
			}
		}
	}
</style>
