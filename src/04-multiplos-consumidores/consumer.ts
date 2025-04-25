import amqp from "amqplib";

async function consumer() {
  const connection = await amqp.connect("amqp://admin:admin@localhost:5672");
  const channel = await connection.createChannel();

  const queue = "products";

  await channel.assertQueue(queue); // create a queue if it doesn't exist
  console.log(`[x] Waiting for messages in ${queue}. To exit press CTRL+C`);

  channel.consume(
    queue,
    (msg) => {
      if (msg) {
        const obj = JSON.parse(msg.content.toString());
        console.log(`[x] Received ${JSON.stringify(obj)}`);
      }
    },
    { noAck: true }
  );
}

consumer().catch(console.error);
