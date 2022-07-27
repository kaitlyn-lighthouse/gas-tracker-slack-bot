// Require the Bolt package (github.com/slackapi/bolt)
const { App } = require("@slack/bolt");
const axios = require('axios').default;

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});



// All the room in the world for your code
app.command('/gas', async ({ ack, payload, context, respond }) => {
  // Acknowledge the command request
  await ack();
  try {
    const { data } = await axios.get("https://api.etherscan.io/api?module=gastracker&action=gasoracle");
    if (data.status === 0) {
      // SEND ERROR
    } else {
      respond()
    }
  } catch (error) {
    console.error(error);
  }

  await respond("Hello world!")
});


(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();
