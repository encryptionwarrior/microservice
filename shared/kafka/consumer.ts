import { Consumer, EachMessageHandler, Kafka } from "kafkajs";
import { getKafkaConfig } from "./config";

export class KafkaConsumer {
  private kafka: Kafka;
  private consumer: Consumer;
  private isConnected: boolean = false;
  private messageHandlers: Map<string, EachMessageHandler> = new Map();

  constructor(groupId: string, clientId?: string) {
    const config = getKafkaConfig();

    if (clientId) {
      config.clientId = clientId;
    }

    this.kafka = new Kafka(config);
    this.consumer = this.kafka.consumer({
      groupId,
      sessionTimeout: 30000,
      heartbeatInterval: 3000,
      retry: config.retry,
    });
    this.consumer.on("consumer.connect", () => {
      console.log(`✅ Kafka consumer connected (group: ${groupId})`);
      this.isConnected = true;
    });

    this.consumer.on("consumer.disconnect", () => {
      console.log(`⚠️  Kafka consumer disconnected (group: ${groupId})`);
      this.isConnected = false;
    });

    this.consumer.on("consumer.crash", (event) => {
      console.error("❌ Kafka consumer crashed:", event.payload.error);
      this.isConnected = false;
    });

    this.consumer.on("consumer.network.request_timeout", (payload) => {
      console.error("❌ Kafka consumer request timeout:", payload);
    });
  }
}
