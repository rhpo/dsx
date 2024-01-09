
const fs = require('fs');
const Quote = require('get-random-quote');

const { Client } = require('discord.js-selfbot-v13');
const client = new Client({});

if (!fs.existsSync('./config.ini')) {
  console.error('Config file not found!');
  process.exit(1);
}

const ini = require('ini');
const config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'));

const { token, message, delay, discord: { server_id: GUILD_ID, channel_id: CHANNEL_ID } } = config;

if (!token) {
  console.error('Token not found!');
  process.exit(1);
}

if (!GUILD_ID) {
  console.error('Guild ID not found!');
  process.exit(1);
}

if (!CHANNEL_ID) {
  console.error('Channel ID not found!');
  process.exit(1);
}

if (!delay) {
  console.error('Delay not found!');
  process.exit(1);
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

console.log("DSX V1.0.0 - Press CTRL + C to stop");

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);

  const guild = client.guilds.cache.get(GUILD_ID);
  if (!guild) return console.error('Invalid guild ID');
  const channel = guild.channels.cache.get(CHANNEL_ID);
  if (!channel) return console.error('Invalid channel ID');

  while (true) {

    var sent = 1;
    function send(message) {
      channel.send(message);
      console.log(`(${sent}x): Sent message: ${message}`);
      sent++;
    }

    if (message && message != '""') send(message.replaceAll('"', '').replaceAll("'", ""));
    else {
      Quote().then(quote => {
        console.log("Getting quote...");
        console.log(quote);
        send(`"${quote.text}" - ` + quote.author);
      })
    };

    await sleep(delay * 1000);

  }

});

client.login(token);
