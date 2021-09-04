const tmi = require('tmi.js');
require('dotenv').config();

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

  let haveMatched = true;

  switch (message.toLowerCase()) {
    case 'pogu':
      client.say(channel, 'PogU');
      break;
    case 'vislaud':
      client.say(channel, 'VisLaud');
      break;
    case 'pogchamp':
      client.say(channel, 'PogChamp');
      break;
    case 'xd':
      client.say(channel, 'xD');
      break;
    case 'monkas':
      client.say(channel, 'monkaS');
      break;
    case 'monkaw':
      client.say(channel, 'monkaW');
      break;
    case 'sadeg':
      client.say(channel, 'Sadeg');
      break;
    case 'sadge':
      client.say(channel, 'Sadge');
      break;
    case 'madge':
      client.say(channel, 'Madge');
      break;
    case 'mods':
      client.say(channel, 'MODS');
      break;
    case 'monke':
      client.say(channel, 'MONKE');
      break;
    case 'porvalo':
      client.say(channel, 'Porvalo');
      break;
    case 'omegalul':
      client.say(channel, 'OMEGALUL');
      break;
    case 'ez':
      client.say(channel, 'EZ');
      break;
    case 'pepejam':
      client.say(channel, 'pepeJAM');
      break;
    case 'pepevixa':
      client.say(channel, 'pepeVIXA');
      break;
    case 'boxdelpls':
      client.say(channel, 'boxdelPls');
      break;
    case ':tf:':
      client.say(channel, ':tf:');
      break;
    case 'd:':
      client.say(channel, 'D:');
      break;
    case 'r)':
      client.say(channel, 'R)');
      break;
    case '+1':
      client.say(channel, '+1');
      break;
    case 'ja':
      client.say(channel, 'ja');
      break;
    case 'tak':
      client.say(channel, 'tak');
      break;
    case 'nie':
      client.say(channel, 'nie');
      break;
    default:
      haveMatched = false;
  }

  if (haveMatched) {
    cooldown();
  } else {
    haveMatched = true;

    switch (true) {
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
      case /instream.ly/i.test(message):
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
