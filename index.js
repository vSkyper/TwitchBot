const tmi = require('tmi.js');
require('dotenv').config();

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
  if (self) return;

  switch (message) {
    case 'PogU':
      client.say(channel, 'PogU');
      break;
    case 'EZ':
      client.say(channel, 'EZ');
      break;
    case ':tf:':
      client.say(channel, ':tf:');
      break;
  }

  if (message.includes('XD')) {
    client.say(channel, 'XDDDDDDDD');
  }

  switch (tags.username) {
    case '17norbert':
      client.say(channel, `@${tags.username} antyzadymkowicz Porvalo`);
      break;
  }
});
