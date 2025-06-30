const { Events, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');


const userAnswers = new Map();

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) return;
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: `コマンド実行中にエラーが発生しました。`, ephemeral: true });
            }
            return;
        }


        if (interaction.isButton()) {
            const customId = interaction.customId;
            const member = interaction.member;

            if (customId.startsWith("verify1")) {
                const roleId = customId.slice(7);
                const role = interaction.guild.roles.cache.get(roleId);
                if (!role) return interaction.reply({ content: '対象ロールが見つかりません。', ephemeral: true });

                if (member.roles.cache.has(roleId)) {
                    const nogive = new EmbedBuilder()
                        .setTitle("エラー")
                        .setDescription(`あなたは既に認証されています`)
                        .setColor("Red")
                        .setFields({ name: 'ロール名', value: `${role}` });
                    return interaction.reply({ embeds: [nogive], ephemeral: true });
                }

                try {
                    await member.roles.add(role);
                    const giverole = new EmbedBuilder()
                        .setTitle("認証完了")
                        .setDescription("認証できました")
                        .setColor("Green")
                        .setFields({ name: "ロール名", value: `${role}` });
                    await interaction.reply({ embeds: [giverole], ephemeral: true });
                } catch (error) {
                    console.error('ロール付与エラー(verify1):', error);
                    await interaction.reply({ content: `エラー: ロールの付与に失敗しました。権限設定を確認してください。\n\`\`\`${error.message}\`\`\``, ephemeral: true });
                }
                return;
            }


            if (customId.startsWith("verify2")) {
                const roleId = customId.slice(7);
                const role = interaction.guild.roles.cache.get(roleId);
                if (!role) return interaction.reply({ content: '対象ロールが見つかりません。', ephemeral: true });
                
                if (member.roles.cache.has(roleId)) {
                    const nogive = new EmbedBuilder().setTitle("エラー").setDescription(`あなたは既に認証されています`).setColor("Red").setFields({ name: 'ロール名', value: `${role}` });
                    return interaction.reply({ embeds: [nogive], ephemeral: true });
                }

                const one = Math.floor(Math.random() * 8) + 1;
                const two = Math.floor(Math.random() * 8) + 1;
                const answer = one + two;
                userAnswers.set(interaction.user.id, { answer: answer, roleId: roleId });

                const modal = new ModalBuilder()
                    .setCustomId("verify_modal_2") 
                    .setTitle(`${one} + ${two}`);
                const answerInput = new TextInputBuilder()
                    .setCustomId("answer_input")
                    .setLabel("計算の答えを入力して送信してください")
                    .setStyle(TextInputStyle.Short);
                modal.addComponents(new ActionRowBuilder().addComponents(answerInput));
                await interaction.showModal(modal);
                return;
            }

            if (customId.startsWith("verify3")) {
                const roleId = customId.slice(7);
                const role = interaction.guild.roles.cache.get(roleId);
                if (!role) return interaction.reply({ content: '対象ロールが見つかりません。', ephemeral: true });
                
                if (member.roles.cache.has(roleId)) {
                    const nogive = new EmbedBuilder().setTitle("エラー").setDescription(`あなたは既に認証されています`).setColor("Red").setFields({ name: 'ロール名', value: `${role}` });
                    return interaction.reply({ embeds: [nogive], ephemeral: true });
                }

                const one = Math.floor(Math.random() * 8) + 1;
                const two = Math.floor(Math.random() * 8) + 1;
                const answer = one * two;
                userAnswers.set(interaction.user.id, { answer: answer, roleId: roleId });

                const modal = new ModalBuilder()
                    .setCustomId("verify_modal_3") 
                    .setTitle(`${one} × ${two}`);
                const answerInput = new TextInputBuilder()
                    .setCustomId("answer_input")
                    .setLabel("計算の答えを入力して送信してください")
                    .setStyle(TextInputStyle.Short);
                modal.addComponents(new ActionRowBuilder().addComponents(answerInput));
                await interaction.showModal(modal);
                return;
            }
        }


        if (interaction.isModalSubmit()) {
            const customId = interaction.customId;

            if (customId.startsWith("verify_modal")) {
                const userAnswer = parseInt(interaction.fields.getTextInputValue("answer_input"), 10);
                const storedData = userAnswers.get(interaction.user.id);
                
                if (!storedData) {
                    return interaction.reply({ content: '認証セッションが見つかりません。もう一度ボタンを押し直してください。', ephemeral: true });
                }

                const role = interaction.guild.roles.cache.get(storedData.roleId);
                if (!role) return interaction.reply({ content: '対象ロールが見つかりません。', ephemeral: true });

                if (userAnswer === storedData.answer) {
                    try {
                        await interaction.member.roles.add(role);
                        const giverole = new EmbedBuilder()
                            .setTitle("認証完了")
                            .setDescription("ロールが付与されました")
                            .setColor("Green")
                            .setFields({ name: "ロール名", value: `${role}` });
                        await interaction.reply({ embeds: [giverole], ephemeral: true });
                    } catch (error) {
                        console.error('ロール付与エラー(modal):', error);
                        await interaction.reply({ content: `エラー: ロールの付与に失敗しました。権限設定を確認してください。\n\`\`\`${error.message}\`\`\``, ephemeral: true });
                    }
                } else {
                    const notgive = new EmbedBuilder()
                        .setTitle("エラー")
                        .setDescription("計算が間違っています")
                        .setColor("Red");
                    await interaction.reply({ embeds: [notgive], ephemeral: true });
                }
                userAnswers.delete(interaction.user.id);
            }
        }
    }
};
