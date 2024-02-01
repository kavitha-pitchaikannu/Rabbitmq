const amqp = require('amqplib/callback_api');

amqp.connect(`amqp://localhost`, (err, connection) => {
    if(err) {
        throw err;
    }
    connection.createChannel((err, channel) => {
        if(err) {
            throw err;
        }
        let qName = "Transmitter";

        channel.assertQueue(qName, {
            durable: false
        })

        channel.consume(qName, (msg)=> {
            console.log(`Receieved : ${msg.content.toString()} `)
        })
    })
})