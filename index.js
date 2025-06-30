// --- Load Modules ---
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
require('dotenv').config(); 

// --- Express Server (for uptime) ---
const express = require('express');
const app = express();
app.get('/', (req, res) => {
  res.send('ぽっさんは男でゲイではありません');
});
app.listen(2045, () => console.log('Webサーバーがポート2045で起動しました。'));


// --- Create Client ---
const client = new Client({ intents: Object.values(GatewayIntentBits) });

client.commands = new Collection();


// --- Load Commands ---
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


// --- Load Events ---
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}


// --- Login ---
client.login(process.env.DISCORD_TOKEN);
