const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("upcoming")
    .setDescription("Responds with upcoming music releases"),
  async execute(interaction) {
    await interaction.reply("Upcoming: lol");
  },
};
