const jwt = require("jsonwebtoken");

const aedes = {};
aedes.aedesMQTT = function (settings, port, wsPort, options = {
    debug: false,
    auth: false,
    cluster: false
}) {
    this.options = options;
    aedes.server = require('aedes')(settings)
    const server = require('net').createServer(aedes.server.handle)
    const httpServer = require('http').createServer()
    const ws = require('websocket-stream')
    ws.createServer({ server: httpServer }, aedes.server.handle)

    server.listen(port, function() {
        console.log('Aedes MQTT listening on port: ' + port)
    })

    httpServer.listen(wsPort, function () {
        console.log('Aedes MQTT-WS listening on port: ' + wsPort)
    });
}
aedes.aedesMQTT.prototype.dis = function(callback) {
    const _this = this
    aedes.server.on('clientDisconnect', function(client) {
        if (_this.options.debug)
            console.log('Client Disconnected: \x1b[31m' + (client ? client.id : client) + '\x1b[0m', 'to broker', aedes.server.id)
        if(callback) {
            callback(client)
        }
    })
}

aedes.aedesMQTT.prototype.pub = function(callback) {
    const _this = this
    aedes.server.on('publish', function(packet, client) {
        if (_this.options.debug) {
            const payload = parsePayload(packet)
            if (payload)
                console.log(payload);
            console.log('MQTT client \x1b[32m' + (client ? client.id : client) +
                '\x1b[0m spacket: ' + packet.toString(), 'from broker', aedes.server.id)
        }
        if(callback) {
            callback(packet, client)
        }
    })
}

aedes.aedesMQTT.prototype.sub = function(callback) {
    const _this = this
    aedes.server.on('subscribe', function(subscriptions, client) {
        if (_this.options.debug)
            console.log('MQTT client \x1b[32m' + (client ? client.id : client) +
                '\x1b[0m subscribed to topics: ' + subscriptions.map(s => s.topic).join('\n'), 'from broker', aedes.server.id)
        if(callback) {
            callback(subscriptions, client)
        }
    })
}

aedes.aedesMQTT.prototype.uns = function(callback) {
    const _this = this
    aedes.server.on('unsubscribe', function(subscriptions, client) {
        if (_this.options.debug)
            console.log('MQTT client \x1b[32m' + (client ? client.id : client) +
                '\x1b[0m unsubscribed to topics: ' + subscriptions.join('\n'), 'from broker', aedes.id)
        if(callback) {
            callback(subscriptions, client)
        }
    })
}

aedes.aedesMQTT.prototype.con = function(callback) {
    const _this = this;
    aedes.server.on('client', function(client) {
        if (_this.options.debug)
            console.log('Client Connected: \x1b[33m' + (client ? client.id : client) + '\x1b[0m', 'to broker', aedes.server.id)
        if(callback) {
            callback(client)
        }
    })
}

aedes.aedesMQTT.prototype.auth = function (_callback) {
    const _this = this;
    if (_this.options.auth) {
        aedes.server.authenticate = (client, username, password, callback) => {
            const {conn, id} = client;
            const clientIpPort = `${conn.remoteAddress}:${conn.remotePort}`;
            try {
                if (`${username}`.toLowerCase() === 'luis') {
                    const token = password.toString();
                    jwt.verify(token, 'SECURE_KEY');
                    const usr = jwt.decode(token);
                    if (usr) {
                        if (_this.options.debug)
                            console.log(`success authenticate client, id=[${id}], ip=[${clientIpPort}]`);
                        return callback(null, true);
                    }
                    callback(new Error(`invalid credential`), false)
                } else {
                    callback(new Error(`unsupported username`), false)
                }
            } catch (error) {
                if (_this.options.debug)
                    console.log(`error on authenticate client [${clientIpPort}]: ${error.message}`)
                error.returnCode = 2;
                callback(error, false)
            }
        }
    }
}

const parsePayload = (payload) => {
    if (payload instanceof Buffer)
        payload = payload.toString('utf8')
    try {
        payload = JSON.parse(payload)
    } catch (e) {
        payload = null
    }
    return payload
}

exports.aedesMqtt = aedes.aedesMQTT
