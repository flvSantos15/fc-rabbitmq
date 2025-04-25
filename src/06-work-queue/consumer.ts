import amqp from "amqplib";

async function worker() {
  const connection = await amqp.connect("amqp://admin:admin@localhost:5672");
  const channel = await connection.createChannel();

  const queue = "work_queue";
  await channel.assertQueue(queue); // create a queue if it doesn't exist

  channel.prefetch(1);

  console.log(`[x] Waiting for tasks. To exit press CTRL+C`);

  channel.consume(
    queue,
    (msg) => {
      if (msg !== null) {
        const content = msg.content.toString();
        console.log(`[x] Recebido ${content}`);

        const dots = content.split(".").length - 1;
        const timeToProcess = dots * 1000;

        setTimeout(() => {
          console.log(`[x] Tarefa concluída`);
          channel.ack(msg);
        }, timeToProcess);
      }
    },
    { noAck: false }
  );
}

worker().catch(console.error);
