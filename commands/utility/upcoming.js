const { SlashCommandBuilder } = require("discord.js");
const getUpcomingMusicValues = require("../../sheets");
const createMessageFromUpcomingsRaw = require("../../message-maker");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("upcoming")
    .setDescription("Responds with upcoming music releases"),
  async execute(interaction) {
    const upcomingsRaw = await getUpcomingMusicValues();
    await interaction.reply(createMessageFromUpcomingsRaw(upcomingsRaw));
  },
};
