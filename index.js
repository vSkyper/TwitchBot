const tmi = require('tmi.js');
const axios = require('axios');
require('dotenv').config();

const getUserID = (channel) => {
  return axios
    .get(`https://api.twitch.tv/helix/users?login=${channel}`, {
      headers: {
        Authorization: `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`,
        'Client-Id': `${process.env.TWITCH_CLIENT_ID}`,
      },
    })
    .then((res) => res.data.data[0].id)
    .catch((error) => console.log(error));
};

const getUserEmotes = (user_id) => {
  return axios
    .all([
      axios
        .get('https://api.betterttv.net/3/cached/emotes/global')
        .catch(() => ({ data: [] })),
      axios
        .get(`https://api.betterttv.net/3/cached/users/twitch/${user_id}`)
        .catch(() => ({ data: { channelEmotes: [], sharedEmotes: [] } })),
      axios
        .get(
          `https://api.betterttv.net/3/cached/frankerfacez/users/twitch/${user_id}`
        )
        .catch(() => ({ data: [] })),
      axios
        .get(`https://api.7tv.app/v2/users/${user_id}/emotes`)
        .catch(() => ({ data: [] })),
      axios
        .get('https://api.7tv.app/v2/emotes/global')
        .catch(() => ({ data: [] })),
      axios
        .get('https://api.twitch.tv/helix/chat/emotes/global', {
          headers: {
            Authorization: `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`,
            'Client-Id': `${process.env.TWITCH_CLIENT_ID}`,
          },
        })
        .catch(() => ({ data: { data: [] } })),
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
      resArr[3].data.forEach((element) => {
        emotes.add(element.name);
      });
      resArr[4].data.forEach((element) => {
        emotes.add(element.name);
      });
      resArr[5].data.data.forEach((element) => {
        emotes.add(element.name);
      });
      return emotes;
    })
    .catch((error) => {
      console.log(error);
      return new Set();
    });
};

const channels = ['vSkyper'];
let emotes = new Set();
(async () => {
  const user_id = await getUserID(channels[0]);
  emotes = await getUserEmotes(user_id);
  console.log('\x1b[33m%s\x1b[0m', `Number of emotes: ${emotes.size}`);
})();

let active = true;
const cooldown = () => {
  active = false;
  console.log('\x1b[32m%s\x1b[0m', 'Cooldown starts');
  setTimeout(() => {
    active = true;
    console.log('\x1b[32m%s\x1b[0m', 'Cooldown ends');
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
  if (self || !active) return;

  if (emotes.has(message)) {
    client.say(channel, message);
    cooldown();
  } else if (
    [...emotes].some(
      (s) => message.includes(` ${s} `) && !message.includes('@')
    )
  ) {
    client.say(channel, message);
    cooldown();
  }
});
