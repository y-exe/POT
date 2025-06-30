const discord = require("discord.js");
const axios = require('axios');

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName('kinro')
    .setDescription('金曜ロードショーについての情報を取得します'),
  async execute(interaction) {
    const kinroApiUrl = 'https://kinro-api.vercel.app';
    const response = await axios.get(kinroApiUrl);
    const kinroData = response.data;
    const embed = new discord.EmbedBuilder()
      .setTitle(kinroData.title)
      .setDescription(`放送予定時刻: ${kinroData.broadcastStartTime}`)
      .setColor('#00FF00')
      .setImage(kinroData.imageUrl);
    await interaction.reply({ embeds: [embed] });
  }
};
