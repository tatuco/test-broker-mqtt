const mqtt = require('mqtt')
const jwt = require('jsonwebtoken')

const main = async () => {
    const token = await jwt.sign(
        {id: 1, username: 'luisjrm936@gmail.com', password: '123456'},
        'SECURE_KEY',
        {expiresIn: "1h"}
    );

    const client  = mqtt.connect('mqtt://broker:1883', {
        username: 'luis',
        password: token,
        clientId: 'client-node'
    })

    client.on('connect', function () {
        console.log('Connected')
        client.subscribe('broker-mqtt/test', (err) => {
            if (!err)
                client.publish('broker-mqtt/node', JSON.stringify({message: 'hola desde node'}))
        })
    })
    client.on("error", err => console.log(err));
    client.on('message', (topic, message) => {
       // if (topic === 'broker-mqtt/otro')
            console.log(`${topic}: ${message.toString()}`)
    });
}

main()
