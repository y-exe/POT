const discord = require('discord.js');

module.exports = {
    name: discord.Events.ClientReady,
    once: true, 
    async execute(client) {
        await client.user.setPresence({ activities: [{ name: `ぽしゃば | vps online`, type: discord.ActivityType.Custom }] });
    }
};
