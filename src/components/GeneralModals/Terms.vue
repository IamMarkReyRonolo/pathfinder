<template>
	<v-dialog v-model="showTerms" persistent width="400">
		<v-card>
			<div class="con">
				<div class="headerTitle" id="modalTitle">Terms and Conditions</div>

				<br />

				<div class="details">
					<p>
						By using our app, you agree to the following terms and conditions:
					</p>
					<ul>
						<li>
							We may collect and use your personal information, including but
							not limited to your name, and location, for the purpose of
							improving our services and providing personalized content.
						</li>
						<li>
							We may share your personal information with third parties for
							advertising and analytics purposes.
						</li>
						<li>
							We will use reasonable efforts to protect your personal
							information, but cannot guarantee the security of your
							information.
						</li>
						<li>
							We reserve the right to change these terms and conditions at any
							time without notice to you.
						</li>
					</ul>
				</div>
				<br />

				<div class="btnsCon">
					<v-btn
						text
						color="#4b5a76"
						@click="$emit('closeTerms')"
						id="cancelBtn"
					>
						Close</v-btn
					>
				</div>
			</div>
		</v-card>
	</v-dialog>
</template>

<script>
	export default {
		props: { showTerms: Boolean },
		data() {
			return {
				assignee: "",
			};
		},
	};
</script>

<style scoped>
	.con {
		padding: 40px;
		text-align: left;
		color: #4b5a76;
	}

	.headerTitle {
		font-size: 24px;
		font-weight: bold;
	}

	.btnsCon {
		display: flex;
		justify-content: flex-end;
	}

	@media only screen and (max-width: 650px) {
		.con {
			padding: 20px;
		}

		.headerTitle {
			font-size: 16px;
		}

		.details {
			font-size: 12px;
			padding: 10px 0px;
		}

		.btnsCon .v-btn {
			font-size: 12px;
			height: 24px;
		}
	}
</style>
