const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("top")
    .setDescription("このチャンネルの最も古いメッセージへのリンクを取得します"),
  async execute(interaction) {
    await interaction.deferReply(); 
    try {
      const messages = await interaction.channel.messages.fetch({ after: '0', limit: 1 });
      const firstMessage = messages.first();

      if (firstMessage) {
        const row = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setLabel('最初のメッセージへ飛ぶ')
              .setStyle(ButtonStyle.Link)
              .setURL(firstMessage.url)
          );
        await interaction.editReply({ content: 'このチャンネルの最初のメッセージです。', components: [row] });
      } else {
        await interaction.deleteReply();
        await interaction.followUp({ content: 'このチャンネルにはメッセージがありません。', flags: [MessageFlags.Ephemeral] });
      }
    } catch (error) {
        console.error(error);
        await interaction.editReply({ content: 'メッセージの取得に失敗しました。' });
    }
  }
};
