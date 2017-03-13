function sendPost() {
    var post = document.getElementById('post').value;
    var audience = document.getElementById('audience').value;
    return sendTalkMessage(post, audience);
}

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

function sendTalkMessage(txt, audi) {
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

    var obj = {};
    obj.publish = [message.thought];

    return window.urb.send(
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
}
