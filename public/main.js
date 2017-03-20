function listen(user) {
  return window.urb.bind('/', {
    ship: user,
    appl: 'talk',
    mark: 'json'
  }, function (err, res) {
    console.log('Now trying to listen to our ship at path `/`:');
    console.log('urb.bind');
    if (err || !res.data) {
      console.log('/', 'err!');
      console.log(err);
      return;
    }
    console.log('urb.bind response: ', res.data);
    console.log('`urb.bind` at path `/` was successful.');
    window.house = res.data.house;
  });
}

function talkPath() {
  var slice = [].slice;
  var components,
    encodedTypes,
    key,
    types,
    val;
  types = arguments[0];
  components = arguments.length >= 2 ? slice.call(arguments, 1) : [];
  encodedTypes = ((function () {
    var results;
    results = [];
    for (key in types) {
      val = types[key];
      if (key !== 'a_group' && key !== 'f_grams' && key !== 'v_glyph' && key !== 'x_cabal') {
        throw new Error("Weird type: '" + key + "'");
      }
      if (val) {
        results.push(key[0]);
      } else {
        results.push(void 0);
      }
    }
    return results;
  })()).join('');
  return ['', encodedTypes].concat(slice.call(components)).join('/');
}

function uuid32() {
  var serial;
  var str = '0v';
  str += Math.ceil(Math.random() * 8) + '.';
  for (i = j = 0; j <= 5; i = ++j) {
    _str = Math.ceil(Math.random() * 10000000).toString(32);
    _str = ('00000' + _str).substr(-5, 5);
    str += _str + '.';
  }
  serial = str.slice(0, -1);
  return serial;
}

function lz(n) {
  if (n < 10) {
    return '0' + n;
  }
  return '' + n;
}

function convTime(time) {
  var d,
    h,
    m,
    s;
  d = new Date(time);
  h = lz(d.getHours());
  m = lz(d.getMinutes());
  s = lz(d.getSeconds());
  return '~' + h + '.' + m + '.' + s;
}


function mainStation(user) {
  if (!user) {
    user = window.urb.user;
  }
  if (!user) {
    return;
  }
  switch (user.length) {
    case 3:
      return 'court';
    case 6:
      return 'floor';
    default:
      return 'porch';
  }
}

function mainStationPath(user) {
  if (user) {
    return '~' + user + '/' + (mainStation(user));
  }
}

function loadSources(user) {
  var subscribed = {};
  var k,
    path,
    types;
  if (subscribed[mainStation(user)] == null) {
    subscribed[mainStation(user)] = {};
  }
  types = {
    a_group: 'a_group',
    v_glyph: 'v_glyph',
    x_cabal: 'x_cabal'
  };
  for (k in types) {
    if (subscribed[mainStation(user)][k]) {
      delete types[k];
    } else {
      subscribed[mainStation(user)][k] = types[k];
    }
  }
  if (_.isEmpty(types)) {
    return;
  }
  path = talkPath(types, mainStation(user));
  return window.urb.bind(path, {
    appl: 'talk',
    mark: 'json'
  }, function (err, res) {
    var ok,
      ref;
    console.log('Now trying to listen to the station at path: `' + path + '`');
    console.log('urb.bind');
    if (err || !res.data) {
      console.log(path, 'err!');
      console.log(err);
      return;
    }
    console.log('urb.bind response: ', res.data);
    console.log('`urb.bind` at path `' + path + '` was successful.');
    window.ok = res.data.ok;
    window.group = res.data.group;
    window.cabal = res.data.cabal;
    window.glyph = res.data.glyph;
    if (res.data.cabal) {
      window.sources = res.data.cabal.loc.sources;
    }
  });
}

function loadPublicStation(ship) {
  var station = 'public';

  var now;
  var date = window.urb.util.toDate(
        (now = new Date(),
            now.setSeconds(0),
            now.setMilliseconds(0),
            new Date(now - 24 * 3600 * 1000)));

  var path = talkPath({
    f_grams: 'f_grams'
  }, station, date);

  document.getElementById('loading').classList.remove('hidden');

  return window.urb.bind(path, {
    ship: ship,
    appl: 'talk',
    mark: 'json'
  }, function (err, res) {
    var oldPosts, newPosts;
    console.log('Now trying to listen to ' + ship + "'s `" + station + '` station at the path: `' + path + '`.');
    console.log('urb.bind');
    if (err || !res.data) {
      console.log(path, 'err!');
      console.log(err);
      console.warn('Error: ' + res + err);
      return;
    }
    document.getElementById('loading').classList.add('hidden');
    console.log('`urb.bind` at ' + path + ' was successful.');
    console.log(res.data);
    oldPosts = document.getElementById('posts').innerHTML;
    newPosts = '';
    res.data.grams.tele.reverse().forEach(function (gram) {
      newPosts += "<div class='post'>";
      newPosts += '<h2 class="ship">~' + gram.ship + '</h2>';
      newPosts += '<h3>' + convTime(gram.thought.statement.date) + '</h3>';
      newPosts += gram.thought.statement.speech.lin.txt;
      newPosts += '</div>';
    });
    document.getElementById('posts').innerHTML = newPosts + oldPosts;
    window.grams = res.data.grams;
  });
}

function postToStation(txt, fullStation) {
  var audience = {};
  audience[fullStation] = {
    envelope: {
      visible: true,
      sender: null
    },
    delivery: 'pending'
  };

  var speech = {
    lin: {
      txt: txt,
      say: true
    }
  };

  var message = {
    ship: window.urb.user,
    thought: {
      serial: uuid32(),
      audience: audience,
      statement: {
        bouquet: [],
        speech: speech,
        date: Date.now()
      }
    }
  };

  var obj = {};
  obj.publish = [message.thought];

  return window.urb.send(
        obj, {
          appl: 'talk',
          mark: 'talk-command'
        },
        function (err, res) {
          console.log('urb.send');
          console.log(obj);
          if (err || !res.data) {
            console.log('err!');
            console.log(err);
            return;
          }
          console.log(res.data);
          console.log('We just sent a Talk message!');
        }
    );
}

function sendPost() {
  var post = document.getElementById('postBox').value;
  var station = '~' + window.urb.user + '/public';
  return postToStation(post, station);
}
