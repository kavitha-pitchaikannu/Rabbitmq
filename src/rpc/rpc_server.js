import  amqp from 'amqplib';

const qName = "rpc_queue";

function fibonacci(n){
    if (n == 0 || n ==1 ){
        return n;
    } else {
        return fibonacci(n-1)+fibonacci(n-2);
    }
}

const processTask = async() => {

    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    await channel.assertQueue(qName, {durable: false});

    //channel.prefetch();
    console.log("Processing rpc request...");

    channel.consume(qName, msg => {
        const n = parseInt(msg.content.toString());
        console.log("Requested fib of : " , n);

        const fibNum = fibonacci(n);

        channel.sendToQueue(msg.properties.replyTo, Buffer.from(fibNum.toString()), {
            correlationId: msg.properties.correlationId
        })

        channel.ack(msg);

        // manual acknowledgement - false
    }, {noAck: false})

}

processTask();


