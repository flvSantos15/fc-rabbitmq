import amqp from "amqplib";

async function producer() {
  const connection = await amqp.connect("amqp://admin:admin@localhost:5672");
  const channel = await connection.createChannel();

  const queue = "produto";
  const message = { id: 1, name: "Camisa", price: 19.99 };

  await channel.assertQueue(queue); // create a queue if it doesn't exist
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
    contentType: "application/json",
  });

  console.log(`[x] Sent ${message}`);

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
}

producer().catch(console.error);
