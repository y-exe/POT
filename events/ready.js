const { Events, ActivityType , MessageFlags } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    console.log(`${client.user.tag}としてログインしました！`);

    await client.user.setPresence({
      activities: [{
        name: 'ぽしゃば | online (run by yexe)', 
        type: ActivityType.Custom  
      }],
      status: 'DoNotDisturb'
    });

    try {
      const data = client.commands.map(cmd => cmd.data.toJSON());
      await client.application.commands.set(data);
      console.log(`${data.length}個のスラッシュコマンドを登録しました。`);
    } catch (error) {
      console.error('コマンドの登録中にエラーが発生しました:', error);
    }
  }, 
}; 
