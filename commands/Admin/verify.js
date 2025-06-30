const discord = require('discord.js');

module.exports = {
    data: new discord.SlashCommandBuilder()
        .setName('verify')
        .setDescription('認証パネルを設置')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('認証ロールを選択')
                .setRequired(true)
        )
        .addStringOption((option) =>
        option
        .setName('type')
        .setDescription('認証方法を指定してください')
        .setRequired(true)
        .addChoices(
          { name: 'ワンクリック認証', value: '1' }, 
          { name: '足し算認証', value: '2' },
          { name: "掛け算認証", value: "3"})
    )
        .setDefaultMemberPermissions(discord.PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const role = interaction.options.getRole('role');
        if (interaction.options.getString('type') === '1') {
        const givebutton = new discord.ButtonBuilder()
            .setCustomId("verify1"+role.id)
            .setLabel('認証')
            .setStyle(discord.ButtonStyle.Success)
        const row = new discord.ActionRowBuilder()
        .addComponents(givebutton);
        const embed = new discord.EmbedBuilder()
        .setTitle("認証")
        .setDescription("下のボタンを押すと認証できます")
        .setFields({name:"ロール名",value:"<@&"+role+">"})
        .setColor("Green")
        await interaction.reply({ embeds:[embed], components: [row] });
    }
      else if (interaction.options.getString('type') === '2') {
        const givebutton = new discord.ButtonBuilder()
            .setCustomId("verify2"+role.id)
            .setLabel('認証')
            .setStyle(discord.ButtonStyle.Success)
        const row = new discord.ActionRowBuilder()
        .addComponents(givebutton);
        const embed = new discord.EmbedBuilder()
        .setTitle("認証")
        .setDescription("下のボタンを押すと認証できます")
        .setFields({name:"ロール名",value:"<@&"+role+">"})
        .setColor("Green")
        await interaction.reply({ embeds:[embed], components: [row] });
    }
      else if (interaction.options.getString('type') === '3') {
        const givebutton = new discord.ButtonBuilder()
            .setCustomId("verify3"+role.id)
            .setLabel('認証')
            .setStyle(discord.ButtonStyle.Success)
        const row = new discord.ActionRowBuilder()
        .addComponents(givebutton);
        const embed = new discord.EmbedBuilder()
        .setTitle("認証")
        .setDescription("下のボタンを押すと認証できます")
        .setFields({name:"ロール名",value:"<@&"+role+">"})
        .setColor("Green")
        await interaction.reply({ embeds:[embed], components: [row] });
    }}
};
