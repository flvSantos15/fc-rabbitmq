import amqp from "amqplib";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function sendTask() {
  const connection = await amqp.connect("amqp://admin:admin@localhost:5672");
  const channel = await connection.createChannel();

  const queue = "work_queue";

  await channel.assertQueue(queue); // create a queue if it doesn't exist

  for (let i = 1; i <= 50; i++) {
    const dots = ".".repeat(i);
    const message = `Tarefa ${i} ${dots}`;

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));

    console.log(`[x] Enviada tarefa: ${message}`);
    await sleep(500);
  }

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
}

sendTask().catch(console.error);
