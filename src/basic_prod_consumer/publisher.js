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

        let message = "Message from transimitter";

        channel.assertQueue(qName, {
            durable: false
        })

        channel.sendToQueue(qName, Buffer.from(message));

        setTimeout(() => {
            connection.close();

        }, 2000)
    })
})