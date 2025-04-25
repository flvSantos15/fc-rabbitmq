import amqp from "amqplib";

async function producer() {
  const connection = await amqp.connect("amqp://admin:admin@localhost:5672");
  const channel = await connection.createChannel();

  const queueHello = "hello";
  const queueProducts = "products";

  await channel.assertQueue(queueHello); // create a queue if it doesn't exist
  await channel.assertQueue(queueProducts); // create a queue if it doesn't exist

  const messages = new Array(10000).fill(0).map((_, i) => ({
    id: 1,
    name: `Produto ${i}`,
    price: Math.floor(Math.random() * 100),
  }));

  await Promise.all(
    messages.map((message) => {
      return channel.publish(
        "amq.fanout",
        "",
        Buffer.from(JSON.stringify(message)),
        {
          contentType: "application/json",
        }
      );
    })
  );

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
}

producer().catch(console.error);
