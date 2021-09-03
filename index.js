const { Client, MessageAttachment, MessageEmbed } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

const client = new Client({ intents: ['GUILDS', 'GUILD_MESSAGES'] });
const prefix = '>';

const randomImage = (message, url) => {
  axios
    .get(url)
    .then((res) => {
      const embed = new MessageEmbed()
        .setColor('#f1c40f')
        .setTitle('✨')
        .setImage(res.data.link);

      message.channel.send({ embeds: [embed] });
    })
    .catch((error) => console.log(error));
};

const rainbow = (message) => {
  const embed = new MessageEmbed()
    .setColor('#f1c40f')
    .setTitle('🌈')
    .setImage(
      `https://some-random-api.ml/canvas/gay/?avatar=${message.author.avatarURL(
        {
          format: 'png',
        }
      )}`
    );
  message.channel.send({ embeds: [embed] });
};

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.trim().slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  switch (command) {
    case 'hello':
      message.reply(`Hi ${message.author.username}!`);
      break;
    case 'cat':
      randomImage(message, 'https://some-random-api.ml/img/cat');
      break;
    case 'panda':
      randomImage(message, 'https://some-random-api.ml/img/panda');
      break;
    case 'rainbow':
      rainbow(message);
      break;
    default:
      message.reply('Invalid command used.');
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
