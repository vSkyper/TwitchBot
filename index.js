const tmi = require('tmi.js');
require('dotenv').config();

let active = true;
const cooldown = () => {
  active = false;
  console.log('Cooldown starts');
  setTimeout(() => {
    active = true;
    console.log('Cooldown ends');
  }, 10000);
};

const client = new tmi.Client({
  options: { debug: true, messagesLogLevel: 'info' },
  connection: {
    reconnect: true,
    secure: true,
  },
  identity: {
    username: 'zadymka_user',
    password: process.env.TWITCH_OAUTH_TOKEN,
  },
  channels: ['vSkyper'],
});

client.connect().catch(console.error);

client.on('message', (channel, tags, message, self) => {
  if (self || !active) return;

  switch (message) {
    case 'PogU':
      client.say(channel, 'PogU');
      cooldown();
      break;
    case 'OMEGALUL':
      client.say(channel, 'OMEGALUL');
      cooldown();
      break;
    case 'EZ':
      client.say(channel, 'EZ');
      cooldown();
      break;
    case ':tf:':
      client.say(channel, ':tf:');
      cooldown();
      break;
  }

  if (message.toLowerCase().includes('xd')) {
    client.say(channel, 'XDDDDDDDD');
    cooldown();
  }
});
