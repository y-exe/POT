const { Client, Collection, GatewayIntentBits, MessageFlags } = require('discord.js');
const fs = require('fs');
require('dotenv').config(); 

const client = new Client({ intents: Object.values(GatewayIntentBits) });

client.commands = new Collection();


const commandFolders = ['./commands/Admin', './commands/General'];
for (const folder of commandFolders) {
  if (!fs.existsSync(folder)) continue;
  
  const commandFiles = fs.readdirSync(folder).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(`${folder}/${file}`);
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
    }
  }
}


const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

client.login(process.env.DISCORD_TOKEN);
