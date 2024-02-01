# Rabbitmq
RabbitMQ executions

RabbitMQ  Basics:
	is a message broker: it accepts and forwards messages.
	it accepts, stores, and forwards binary blobs of data ‒ messages.
uses some jargon.
1. producer 
	A program that sends messages is a producer 
2. Queue: 
	A queue is the name for the post box in RabbitMQ. 
 	A queue is only bound by the host's memory & disk limits, it's essentially a large message buffer.
	Many producers can send messages that go to one queue, and many consumers can try to receive data from one queue. This is how we represent a queue:
3. Consumer:
	A consumer is a program that mostly waits to receive messages:

Note::::::: An application can be both a producer and consumer, too.

=======================================================

Work Queues
	Distributing tasks among workers (the competing consumers pattern)
	is to avoid doing a resource-intensive task immediately and having to wait for it to complete. Instead we schedule the task to be done later. We encapsulate a task as a message and send it to the queue. A worker process running in the background will pop the tasks and eventually execute the job. When you run many workers the tasks will be shared between them.
	work queue is that each task is delivered to exactly one worker.

def callback(ch, method, properties, body):

=======================================================

PUblish/Subscribe
	Sending messages to many consumers at once
	we'll deliver a message to multiple consumers. This pattern is known as "publish/subscribe".
	
=======================================================

A producer is a user application that sends messages.
A queue is a buffer that stores messages.
A consumer is a user application that receives messages.

=======================================================

The core idea in the messaging model in RabbitMQ is that the producer never sends any messages directly to a queue. Actually, quite often the producer doesn't even know if a message will be delivered to any queue at all.

Instead, the producer can only send messages to an exchange. An exchange is a very simple thing. On one side it receives messages from producers and on the other side it pushes them to queues. The exchange must know exactly what to do with a message it receives. Should it be appended to a particular queue? Should it be appended to many queues? Or should it get discarded. The rules for that are defined by the exchange type.

	direct, topic, headers and fanout

// declaration
channel.exchange_declare(exchange='logs',
                         exchange_type='fanout')


channel.basic_publish(exchange='',
                      routing_key='hello',
                      body=message)

exchange parameter is the name of the exchange.
messages are routed to the queue with the name specified by routing_key, if it exists.

channel.queue_declare(queue='')
channel.queue_declare(queue='', exclusive=True)

random queue name, once the consumer connection is closed, the queue should be deleted. There's an exclusive flag for that:

Bingings:
	Now we need to tell the exchange to send messages to our queue. That relationship between exchange and a queue is called a binding.

channel.queue_bind(exchange='logs',
                   queue=result.method.queue)


Basic Messaging:


import pika

connection = pika.BlockingConnection(
    pika.ConnectionParameters(host='localhost'))
channel = connection.channel()

channel.exchange_declare(exchange='logs', exchange_type='fanout')

result = channel.queue_declare(queue='', exclusive=True)
queue_name = result.method.queue

channel.queue_bind(exchange='logs', queue=queue_name)

print(' [*] Waiting for logs. To exit press CTRL+C')

def callback(ch, method, properties, body):
    print(f" [x] {body}")

channel.basic_consume(
    queue=queue_name, on_message_callback=callback, auto_ack=True)

channel.start_consuming()


============================================================

Routing

We were able to broadcast log messages to many receivers.

In this tutorial we're going to add a feature to it - we're going to make it possible to subscribe only to a subset of the messages. For example, we will be able to direct only critical error messages to the log file (to save disk space), while still being able to print all of the log messages on the console.


Binding with Key for the filterations: & Multiple bindings

channel.queue_bind(exchange=exchange_name,
                   queue=queue_name,
                   routing_key='black')

Note:::::::::::::::: The meaning of a binding key depends on the exchange type

Fanout => Delivers messages to all queues mindless broadcasting
Direct Exchange:
	The routing algorithm behind a direct exchange is simple - a message goes to the queues whose binding key exactly matches the routing key of the message.

================================================================
Topics:


================================================================
Remote Proceedure Call:

	When the Client starts up, it creates an anonymous exclusive callback queue.
	For an RPC request, the Client sends a message with two properties: reply_to, which is set to the callback queue and correlation_id, which is set to a unique value for every request.
	The request is sent to an rpc_queue queue.
	The RPC worker (aka: server) is waiting for requests on that queue. When a request appears, it does the job and sends a message with the result back to the Client, using the queue from the reply_to field.
	The client waits for data on the callback queue. When a message appears, it checks the correlation_id property. If it matches the value from the request it returns the response to the application.


