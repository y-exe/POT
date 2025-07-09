const { SlashCommandBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('認証パネルを設置します')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator) 
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('認証で付与するロールを選択')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('type')
                .setDescription('認証方法を指定してください')
                .setRequired(true)
                .addChoices(
                    { name: 'ワンクリック認証', value: '1' },
                    { name: '足し算認証', value: '2' },
                    { name: '掛け算認証', value: '3' }
                )
        ),
    async execute(interaction) {
        const role = interaction.options.getRole('role');
        const type = interaction.options.getString('type');

        
        const verifyButton = new ButtonBuilder()
            .setCustomId(`verify${type}${role.id}`)
            .setLabel('認証')
            .setStyle(ButtonStyle.Success);
        
        const row = new ActionRowBuilder()
            .addComponents(verifyButton);

        const embed = new EmbedBuilder()
            .setTitle("サーバー認証")
            .setDescription("下のボタンを押して認証を完了してください。")
            .setFields({ name: "付与されるロール", value: `${role}` })
            .setColor("Green");

        
        await interaction.channel.send({ embeds: [embed], components: [row] });
        
        await interaction.reply({
            content: '認証パネルを設置しました。',
            flags: [MessageFlags.Ephemeral] 
        });
    }
};
