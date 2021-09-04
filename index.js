const tmi = require('tmi.js');
const axios = require('axios');
require('dotenv').config();

let emotes = new Set();
axios
  .all([
    axios.get('https://api.betterttv.net/3/cached/emotes/global'),
    axios.get(
      `https://api.betterttv.net/3/cached/users/twitch/${process.env.USER_ID}`
    ),
    axios.get(
      `https://api.betterttv.net/3/cached/frankerfacez/users/twitch/${process.env.USER_ID}`
    ),
  ])
  .then((resArr) => {
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
  })
  .catch((error) => console.log(error));

let active = true;
const cooldown = () => {
  active = false;
  console.log('Cooldown starts');
  setTimeout(() => {
    active = true;
    console.log('Cooldown ends');
  }, 5000);
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

client.on('notice', (channel, msgid, message) => {
  if (msgid === 'msg_duplicate') {
    console.log('Duplicate handled');
    active = true;
  }
});

client.on('message', (channel, tags, message, self) => {
  if (self) return;

  switch (tags.username) {
    case '17norbert':
      client.say(channel, '@17norbert Idź do swojego pana Porvalo');
      break;
    case 'lewus':
      if (channel != '#lewus') {
        client.say(
          channel,
          'ZJEBUS POLICE ZJEBUS POLICE ZJEBUS POLICE ZJEBUS POLICE'
        );
      }
      break;
  }
});

client.on('message', (channel, tags, message, self) => {
  if (self || !active) return;

  if (emotes.has(message)) {
    client.say(channel, message);
    cooldown();
  } else {
    haveMatched = true;

    switch (true) {
      case /^\+1$/i.test(message):
        client.say(channel, '+1');
        break;
      case /^ja$/i.test(message):
        client.say(channel, 'ja');
        break;
      case /^tak$/i.test(message):
        client.say(channel, 'tak');
        break;
      case /^nie$/i.test(message):
        client.say(channel, 'nie');
        break;
      case /^xd/i.test(message):
        client.say(channel, 'XDDDDDDDD');
        break;
      case /^\?/i.test(message):
        client.say(channel, '??????');
        break;
      case /🥶/i.test(message):
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
      case /oddaj/i.test(message):
        client.say(
          channel,
          'ODDAJ Madge ODDAJ Madge ODDAJ Madge ODDAJ Madge ODDAJ Madge'
        );
        break;
      case /lebronjam/i.test(message) || /fire/i.test(message):
        client.say(
          channel,
          'lebronJAM FIRE lebronJAM FIRE lebronJAM FIRE lebronJAM FIRE lebronJAM FIRE lebronJAM FIRE lebronJAM FIRE lebronJAM FIRE lebronJAM FIRE lebronJAM FIRE'
        );
        break;
      case /catjam/i.test(message):
        client.say(
          channel,
          'catJAM 🎸 catJAM 🎸 catJAM 🎸 catJAM 🎸 catJAM 🎸 catJAM 🎸 catJAM 🎸 catJAM 🎸 catJAM 🎸 catJAM 🎸 catJAM 🎸'
        );
        break;
      case /luki oooo/i.test(message):
        client.say(
          channel,
          'LUKI OOOO LUKI OOOO LUKI OOOO LUKI OOOO LUKI OOOO LUKI OOOO'
        );
        break;
      case /instream\.ly/i.test(message):
        if (tags.username == channel.replace('#', '')) {
          client.say(
            channel,
            'WIRUS POLICE WIRUS POLICE WIRUS POLICE WIRUS POLICE WIRUS POLICE WIRUS POLICE WIRUS POLICE'
          );
        } else {
          haveMatched = false;
        }
        break;
      default:
        haveMatched = false;
    }

    if (haveMatched) {
      cooldown();
    }
  }
});
