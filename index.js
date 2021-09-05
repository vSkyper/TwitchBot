const tmi = require('tmi.js');
const axios = require('axios');
require('dotenv').config();

const getUserID = async (channels) => {
  return axios
    .get(`https://api.twitch.tv/helix/users?login=${channels[0]}`, {
      headers: {
        Authorization: `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`,
        'Client-Id': `${process.env.TWITCH_CLIENT_ID}`,
      },
    })
    .then((res) => res.data.data[0].id)
    .catch((error) => console.log(error));
};

const getUserEmotes = async (user_id) => {
  return axios
    .all([
      axios.get('https://api.betterttv.net/3/cached/emotes/global'),
      axios.get(`https://api.betterttv.net/3/cached/users/twitch/${user_id}`),
      axios.get(
        `https://api.betterttv.net/3/cached/frankerfacez/users/twitch/${user_id}`
      ),
      axios.get('https://api.twitch.tv/helix/chat/emotes/global', {
        headers: {
          Authorization: `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`,
          'Client-Id': `${process.env.TWITCH_CLIENT_ID}`,
        },
      }),
    ])
    .then((resArr) => {
      let emotes = new Set();
      resArr[0].data.forEach((element) => {
        emotes.add(element.code);
      });
      resArr[1].data.channelEmotes.forEach((element) => {
        emotes.add(element.code);
      });
      resArr[1].data.sharedEmotes.forEach((element) => {
        emotes.add(element.code);
      });
      resArr[2].data.forEach((element) => {
        emotes.add(element.code);
      });
      resArr[3].data.data.forEach((element) => {
        emotes.add(element.name);
      });
      return emotes;
    })
    .catch((error) => console.log(error));
};

const channels = ['holak1337'];
let emotes = new Set();
(async () => {
  const user_id = await getUserID(channels);
  emotes = await getUserEmotes(user_id);
  console.log(`Number of emotes: ${emotes.size}`);
})();

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
  channels,
});

client.connect().catch(console.error);

client.on('message', (channel, tags, message, self) => {
  if (self) return;

  if (message.includes('@zadymka_user')) {
    client.say(
      channel,
      `@${tags.username} ja człowiek nie robot MrDestructoid`
    );
  }
});

client.on('message', (channel, tags, message, self) => {
  if (self || !active) return;

  if (emotes.has(message)) {
    client.say(channel, message);
    cooldown();
  } else if (
    [...emotes].some(
      (s) =>
        new RegExp(` ${s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')} `).test(
          message
        ) && !message.includes('@')
    )
  ) {
    client.say(channel, message);
    cooldown();
  }
});
