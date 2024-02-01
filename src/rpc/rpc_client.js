import  amqp from 'amqplib';
import  { v4 } from "uuid";


const args = process.argv.slice(2);

if (args.length == 0) {
  console.log("Usage: rpc_client.js num");
  process.exit(1);
}

const num = parseInt(args[0]);
const uid = v4();

const getFibonacci = async() => {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    const q1 = await channel.assertQueue('', {exclusive: true});

    console.log("Requesting fibonacci for : ", num);

    channel.sendToQueue("rpc_queue", Buffer.from(num.toString()), {
        replyTo: q1.queue,
        correlationId: uid
    })
    console.log("request sent: ", num);

    channel.consume(q1.queue, msg => {
        if(msg.properties.correlationId == uid) {
            console.log("Fibonnaci is : ", msg.content.toString());
            setTimeout(()=> {
                connection.close();
                process.exit();
            }, 500)
        }
    }, {noAck: true})
    
}

getFibonacci();