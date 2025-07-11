const { Events, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, MessageFlags } = require('discord.js');

const userAnswers = new Map();

async function handleInteractionError(interaction, error) {
    console.error('インタラクション処理中にエラーが発生しました:', error);
    const errorMessage = {
        content: 'コマンド実行中に予期せぬエラーが発生しました。時間をおいて再度お試しください。',
        flags: [MessageFlags.Ephemeral]
    };
    
    if (interaction.replied || interaction.deferred) {
        await interaction.followUp(errorMessage).catch(err => console.error('followUpでのエラーメッセージ送信に失敗:', err));
    } else {
        await interaction.reply(errorMessage).catch(err => console.error('replyでのエラーメッセージ送信に失敗:', err));
    }
}


module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        try { 
            if (interaction.isChatInputCommand()) {
                const command = interaction.client.commands.get(interaction.commandName);
                if (!command) {
                    console.error(`${interaction.commandName} というコマンドは見つかりませんでした。`);
                    return;
                }
                await command.execute(interaction);
                return;
            }

            if (interaction.isButton()) {
                const customId = interaction.customId;
                const member = interaction.member;

                if (customId.startsWith("verify1")) {
                    await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

                    const roleId = customId.slice(7);
                    const role = interaction.guild.roles.cache.get(roleId);
                    if (!role) return interaction.editReply({ content: '対象ロールが見つかりません。' });

                    if (member.roles.cache.has(roleId)) {
                        const nogive = new EmbedBuilder().setTitle("エラー").setDescription(`あなたは既に認証されています`).setColor("Red").setFields({ name: 'ロール名', value: `${role}` });
                        return interaction.editReply({ embeds: [nogive] });
                    }

                    await member.roles.add(role);
                    const giverole = new EmbedBuilder().setTitle("認証完了").setDescription("認証できました").setColor("Green").setFields({ name: "ロール名", value: `${role}` });
                    await interaction.editReply({ embeds: [giverole] });
                    return;
                }

                if (customId.startsWith("verify2") || customId.startsWith("verify3")) {
                    const isAddition = customId.startsWith("verify2");
                    const roleId = customId.slice(7);
                    const role = interaction.guild.roles.cache.get(roleId);
                    if (!role) return interaction.reply({ content: '対象ロールが見つかりません。', flags: [MessageFlags.Ephemeral] });

                    if (member.roles.cache.has(roleId)) {
                        const nogive = new EmbedBuilder()
                            .setTitle("エラー")
                            .setDescription(`あなたは既に認証されています`)
                            .setColor("Red")
                            .setFields({ name: 'ロール名', value: `${role}` });
                        return interaction.reply({ embeds: [nogive], flags: [MessageFlags.Ephemeral] });
                    }
                    
                    const one = Math.floor(Math.random() * 8) + 1;
                    const two = Math.floor(Math.random() * 8) + 1;
                    const answer = isAddition ? one + two : one * two;
                    const question = isAddition ? `${one} + ${two}` : `${one} × ${two}`;
                    userAnswers.set(interaction.user.id, { answer, roleId });

                    const modal = new ModalBuilder()
                        .setCustomId("verify_modal")
                        .setTitle(question);
                    const answerInput = new TextInputBuilder().setCustomId("answer_input").setLabel("計算の答えを入力してください").setStyle(TextInputStyle.Short);
                    modal.addComponents(new ActionRowBuilder().addComponents(answerInput));
                    
                    await interaction.showModal(modal);
                    return;
                }
            }

            if (interaction.isModalSubmit() && interaction.customId === "verify_modal") {
                await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

                const userAnswer = parseInt(interaction.fields.getTextInputValue("answer_input"), 10);
                const storedData = userAnswers.get(interaction.user.id);

                if (!storedData) {
                    return interaction.editReply({ content: '認証セッションが見つかりません。もう一度ボタンを押し直してください。' });
                }

                const role = interaction.guild.roles.cache.get(storedData.roleId);
                if (!role) return interaction.editReply({ content: '対象ロールが見つかりません。' });

                if (userAnswer === storedData.answer) {
                    await interaction.member.roles.add(role);
                    const giverole = new EmbedBuilder().setTitle("認証完了").setDescription("ロールが付与されました").setColor("Green").setFields({ name: "ロール名", value: `${role}` });
                    await interaction.editReply({ embeds: [giverole] });
                } else {
                    const notgive = new EmbedBuilder().setTitle("エラー").setDescription("計算が間違っています").setColor("Red");
                    await interaction.editReply({ embeds: [notgive] });
                }
                userAnswers.delete(interaction.user.id);
            }

        } catch (error) { 
            await handleInteractionError(interaction, error);
        }
    }
};
