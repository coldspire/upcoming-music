require("dotenv").config();

const {
  env: { UM_DISCORD_TOKEN: DISCORD_TOKEN },
} = process;
const { Client, Events, GatewayIntentBits } = require("discord.js");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(DISCORD_TOKEN);
