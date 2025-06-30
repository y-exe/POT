const Discord = require("discord.js");

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName("top")
    .setDescription("topページを取得します"),
  async execute(interaction) {
    const channel = interaction.channel;
    const messages = await channel.messages.fetch({ after: '0', limit: 1 });
    if (messages.size > 0) {
      const message = messages.first();
      const messageLink = `https://discord.com/channels/${message.guild.id}/${channel.id}/${message.id}`;
      const row = new Discord.ButtonBuilder()
        .setLabel('メッセージリンク')
        .setURL(messageLink)
        .setStyle(Discord.ButtonStyle.Link);
      await interaction.reply({
        content: '最も古いメッセージのリンクを取得しました',
        components: [new Discord.ActionRowBuilder().setComponents(row)],
      });
    } else {
      await interaction.reply('このチャンネルにはメッセージがありません。');
    }
  }
};
