const aedes = require('./broker-ws')

const broker = new aedes.aedesMqtt({
    id: 'BROKER_1'
}, 1883, 1884, {
    debug: true,
    auth: true
})

broker.auth((client) => {
})

broker.con((client) => {
})

broker.dis((client) => {
})

broker.sub((subscriptions, client) => {
})

broker.uns((subscriptions, client) => {
})

broker.pub((packet, client) => {
})


const handleFatalError = (err) => {
    console.error(`[FATAL-ERROR] => ${err.message}`)
    console.error(err.stack)
    process.exit(1)
}

process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)
