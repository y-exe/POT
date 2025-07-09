const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kinro')
    .setDescription('金曜ロードショーの情報を取得します'),
  async execute(interaction) {
    await interaction.deferReply();

    try {
      const apiResponse = await axios.get('https://kinro-api.vercel.app');
      const data = apiResponse.data;

      const embed = new EmbedBuilder()
        .setTitle(data.title)
        .setDescription(`放送予定時刻: ${data.broadcastStartTime}`)
        .setColor('#00FF00')
        .setImage(data.imageUrl);

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error(error);
      await interaction.editReply({ content: '情報の取得に失敗しました。時間をおいて再度お試しください。' });
    }
  }
};
