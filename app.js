// Require the Bolt package (github.com/slackapi/bolt)
import { App } from "@slack/bolt";
import axios from "axios";

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

async function getGas(respond) {
    try {
      const { data } = await axios.get("https://api.etherscan.io/api?module=gastracker&action=gasoracle");
      if (data.status === "0") {
        respond({
          "blocks": [
            {
              "type": "header",
              "text": {
                "type": "plain_text",
                "text": "ETH Gas Tracker"
              }
            },
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": "All values are pulled from the Etherscan API."
              }
            },
            {
              "type": "divider"
            },
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": "*Error*: too many requests at once. Please wait a moment and try again."
              }
            },
            {
              "type": "actions",
              "elements": [
                {
                  "type": "button",
                  "text": {
                    "type": "plain_text",
                    "text": "Check again"
                  },
                  "action_id": "recheck_gas"
                }
              ]
            }
          ]
        });
      } else {
        respond({
          "blocks": [
            {
              "type": "header",
              "text": {
                "type": "plain_text",
                "text": "ETH Gas Tracker"
              }
            },
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": "All values are pulled from the Etherscan API."
              }
            },
            {
              "type": "divider"
            },
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": `Low: *${data.result.SafeGasPrice}* gwei`
              }
            },
            {
              "type": "divider"
            },
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": `Average: *${data.result.ProposeGasPrice}* gwei`
              }
            },
            {
              "type": "divider"
            },
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": `High: *${data.result.FastGasPrice}* gwei`
              }
            },
            {
              "type": "divider"
            },
            {
              "type": "actions",
              "elements": [
                {
                  "type": "button",
                  "text": {
                    "type": "plain_text",
                    "text": "Check again"
                  },
                  "action_id": "recheck_gas"
                }
              ]
            }
          ]
        });
      }
    } catch (error) {
      console.error(error);
      respond({
        "blocks": [
          {
            "type": "header",
            "text": {
              "type": "plain_text",
              "text": "ETH Gas Tracker"
            }
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "All values are pulled from the Etherscan API."
            }
          },
          {
            "type": "divider"
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*Unknown Error*: Please try again."
            }
          },
          {
            "type": "actions",
            "elements": [
              {
                "type": "button",
                "text": {
                  "type": "plain_text",
                  "text": "Check again"
                },
                "action_id": "recheck_gas"
              }
            ]
          }
        ]
    });
  }
}


// All the room in the world for your code
app.command('/gas', async ({ ack, respond }) => {
  // Acknowledge the command request
  ack();
  await getGas(respond);
});

app.action('recheck_gas', async ({ ack, respond }) => {
  // Acknowledge action request
  ack();
  await getGas(respond);
});


(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();
