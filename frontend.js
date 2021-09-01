var client = mqtt.connect("ws://localhost:1884", {
    clientId: 'browser_mqtt',
    username: 'luis',
    password: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJsdWlzanJtOTM2QGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiMTIzNDU2IiwiaWF0IjoxNjI4MDQ2NjI3LCJleHAiOjE2MjgwNTAyMjd9.bDBQ9SYlqagarvPAzF6brbYa7TY3N4N8nLoQtrrIOZ8'
})

function connect() {
    console.log('conetado')
    client.subscribe("broker-mqtt/#", function(err) {
        if (!err) {
            client.publish("broker-mqtt/test", JSON.stringify({
                message: "hola desde el navegador"
            }));
        }
    })
}

function message(topic, message) {
    console.log(topic + " - " + message.toString());
    // client.end()
}

client.on("connect", connect);
client.on("message", message);
