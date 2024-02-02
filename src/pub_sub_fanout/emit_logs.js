import amqp from 'amqplib';

const exchangeName = "logs";
const args = process.argv.slice(2);

if (args.length == 0) {
  console.log("Enter the message !!");
  process.exit(1);
}

const msg = args[0];

const sendMsg = async () => {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    await channel.assertExchange(exchangeName, 'fanout', {durable: false});

    channel.publish(exchangeName, "", Buffer.from(msg));

    console.log("Sent :", msg);

    setTimeout(()=>{
        connection.close();
        process.exit();
    })
}

sendMsg();