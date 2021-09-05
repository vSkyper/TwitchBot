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

const channels = ['vSkyper'];
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
  if (self || !active) return;

  if (emotes.has(message)) {
    client.say(channel, message);
    cooldown();
  } else {
    let haveMatched = true;

    switch (true) {
      case /^1$/.test(message):
        client.say(channel, '1');
        break;
      case /^2$/.test(message):
        client.say(channel, '2');
        break;
      case /^\+1$/.test(message):
        client.say(channel, '+1');
        break;
      case /^-1$/.test(message):
        client.say(channel, '-1');
        break;
      case /^ja$/i.test(message):
        client.say(channel, 'ja');
        break;
      case /^ta$/i.test(message):
        client.say(channel, 'ta');
        break;
      case /^nie$/i.test(message):
        client.say(channel, 'nie');
        break;
      case /^xd/i.test(message):
        client.say(channel, 'XDDDDD');
        break;
      case /^\?\?/.test(message):
        client.say(channel, '??????');
        break;
      case /🥶/.test(message):
        client.say(channel, '🥶');
        break;
      case /chować braci/i.test(message):
        client.say(
          channel,
          'CHOWAĆ BRACI POLICE CHOWAĆ BRACI POLICE CHOWAĆ BRACI POLICE CHOWAĆ BRACI POLICE CHOWAĆ BRACI POLICE CHOWAĆ BRACI POLICE'
        );
        break;
      case /zamieszki/i.test(message):
        client.say(
          channel,
          'ZAMIESZKI MODS ZAMIESZKI MODS ZAMIESZKI MODS ZAMIESZKI MODS ZAMIESZKI MODS ZAMIESZKI MODS'
        );
        break;
      case /^oddaj /i.test(message):
        client.say(
          channel,
          'ODDAJ Madge ODDAJ Madge ODDAJ Madge ODDAJ Madge ODDAJ Madge'
        );
        break;
      case /lebronjam/i.test(message) && /fire/i.test(message):
        client.say(
          channel,
          'lebronJAM FIRE lebronJAM FIRE lebronJAM FIRE lebronJAM FIRE lebronJAM FIRE lebronJAM FIRE lebronJAM FIRE lebronJAM FIRE'
        );
        break;
      case /alienpls/i.test(message) && /fire/i.test(message):
        client.say(
          channel,
          'AlienPls FIRE AlienPls FIRE AlienPls FIRE AlienPls FIRE AlienPls FIRE AlienPls FIRE AlienPls FIRE AlienPls FIRE'
        );
        break;
      case /boxdelpls/i.test(message) && /fire/i.test(message):
        client.say(
          channel,
          'boxdelPls FIRE boxdelPls FIRE boxdelPls FIRE boxdelPls FIRE boxdelPls FIRE boxdelPls FIRE boxdelPls FIRE boxdelPls FIRE'
        );
        break;
      case /pepebass/i.test(message) && /fire/i.test(message):
        client.say(
          channel,
          'pepeBASS FIRE pepeBASS FIRE pepeBASS FIRE pepeBASS FIRE pepeBASS FIRE pepeBASS FIRE pepeBASS FIRE pepeBASS FIRE'
        );
        break;
      case /peepodj/i.test(message) && /disco/i.test(message):
        client.say(
          channel,
          'peepoDJ Disco peepoDJ Disco peepoDJ Disco peepoDJ Disco peepoDJ Disco peepoDJ Disco peepoDJ Disco peepoDJ Disco'
        );
        break;
      case /sadeg/i.test(message) && /rapthis/i.test(message):
        client.say(
          channel,
          'Sadeg RapThis Sadeg RapThis Sadeg RapThis Sadeg RapThis Sadeg RapThis Sadeg RapThis Sadeg RapThis Sadeg RapThis'
        );
        break;
      case /catjam/i.test(message):
        client.say(
          channel,
          'catJAM 🎸 catJAM 🎸 catJAM 🎸 catJAM 🎸 catJAM 🎸 catJAM 🎸 catJAM 🎸 catJAM 🎸'
        );
        break;
      case /pompuj mods/i.test(message):
        client.say(
          channel,
          'POMPUJ MODS POMPUJ MODS POMPUJ MODS POMPUJ MODS POMPUJ MODS POMPUJ MODS POMPUJ MODS POMPUJ MODS'
        );
        break;
      case /luki oooo/i.test(message):
        client.say(
          channel,
          'LUKI OOOO LUKI OOOO LUKI OOOO LUKI OOOO LUKI OOOO LUKI OOOO'
        );
        break;
      case /https:\/\/instream\.ly/i.test(message):
        client.say(
          channel,
          'WIRUS POLICE WIRUS POLICE WIRUS POLICE WIRUS POLICE WIRUS POLICE WIRUS POLICE WIRUS POLICE'
        );
        break;
      default:
        haveMatched = false;
    }

    if (haveMatched) {
      cooldown();
    }
  }
});
