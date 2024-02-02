import amqp from 'amqplib';

const exchangeName = "logs";

const receiveMsg = async () => {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    await channel.assertExchange(exchangeName, 'fanout', {durable: false});

    const queue = await (await channel).assertQueue("", {exclusive: true});

    console.log("Waiting for the message in queue :", queue.queue);

    await channel.bindQueue(queue.queue, exchangeName, "");

    channel.consume(queue.queue, msg => {
        if(msg.content) {
            console.log("Message us: " , msg.content.toString());
        }
    }, {noack: true})
}

receiveMsg();