function uuid32() {
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
        return "0" + n;
    } else {
        return "" + n;
    }
}

function convTime(time) {
    var d, h, m, s;
    d = new Date(time);
    h = lz(d.getHours());
    m = lz(d.getMinutes());
    s = lz(d.getSeconds());
    return "~" + h + "." + m + "." + s;
}

function talkPath() {
    slice = [].slice;
    var components,
        encodedTypes,
        key,
        types,
        val;
    types = arguments[0], components = arguments.length >= 2 ? slice.call(arguments, 1) : [];
    encodedTypes = ((function() {
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

function sendTalkMessage(txt, audi) {
    var station = 'a-second-station';

    var audience = {};
    audience[audi] = {
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

    var chan = {
        design: {
            party: '',
            config: {}
        }
    };
    chan.design.party = station;
    chan.design.config = {
        sources: [],
        caption: 'a second %mailbox station.',
        cordon: {
            posture: 'brown',                           // %mailbox
            list: []
        }
    };

    window.urb.send(
        chan, {
            appl: 'talk',
            mark: 'talk-command'
        },
        function(err, res) {
            console.log('urb.send');
            console.log(chan);
            if (err || !res.data) {
                console.log(path, 'err!');
                console.log(err);
                return;
            }
            console.log('Just in case `' + station + '` didn\'t exist, we created it so we can send our Talk post.');
            console.log(res.data);
        }
    );

    var obj = {};
    obj.publish = [message.thought];

    window.urb.send(
        obj, {
            appl: 'talk',
            mark: 'talk-command'
        },
        function(err, res) {
            console.log('urb.send');
            console.log(obj);
            if (err || !res.data) {
                console.log(path, 'err!');
                console.log(err);
                return;
            }
            console.log(res.data);
            console.log('We just sent our ship a Talk message!');
        }
    );

    var now;
    var date = window.urb.util.toDate(
        (now = new Date(),
            now.setSeconds(0),
            now.setMilliseconds(0),
            new Date(now - 24 * 3600 * 1000)));

    var path = talkPath({
        f_grams: 'f_grams'
    }, station, date);

    return window.urb.bind(path, {
        appl: 'talk',
        mark: 'json'
    }, function(err, res) {
        console.log('We\'re going to try to listen to the station at this path:');
        console.log(path);
        console.log('urb.bind');
        if (err || !res.data) {
            console.log(path, 'err!');
            console.log(err);
            return;
        }
        console.log('`urb.bind` at the path was successful. Now we\'re listening!');
        console.log(res.data);
        var messages = '';
        res.data.grams.tele.forEach(function(gram) {
            messages += "<div class='message'>";
            messages += '<h2>' + '~' + gram.ship + '</h2>';
            messages += '<h3>' + convTime(gram.thought.statement.date) + '</h3>';
            messages += gram.thought.statement.speech.lin.txt;
            messages += '</div>';
        });
        document.getElementById('messages').innerHTML = messages;
    });
}
