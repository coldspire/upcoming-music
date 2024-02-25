const { SlashCommandBuilder } = require("discord.js");
const getUpcomingMusicValues = require("../../sheets");
const createMessageFromUpcomingsRaw = require("../../message-maker");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("upcoming")
    .setDescription("Responds with upcoming music releases"),
  async execute(interaction) {
    let replyMessage;
    try {
      const upcomingsRaw = await getUpcomingMusicValues();
      replyMessage = createMessageFromUpcomingsRaw(upcomingsRaw);
    } catch (error) {
      const hautespireUserId = `407620237106610177`;
      const errorMessage = error.message ?? error;
      replyMessage = `💀 _**Oh no!**_ Something went wrong. Paging <@${hautespireUserId}> to fix it.\n👉 Error: _${errorMessage}_`;
    }

    await interaction.reply(replyMessage);
  },
};
