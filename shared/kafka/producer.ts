import { Kafka, Producer } from "kafkajs";
import { getKafkaConfig } from "./config";

export class KafkaProducer {
  private kafka: Kafka;
  private producer: Producer;
  private isConnected: boolean = false;

  constructor(clientId?: string) {
    const config = getKafkaConfig();
    if (clientId) {
      config.clientId = clientId;
    }

    this.kafka = new Kafka(config);
    this.producer = this.kafka.producer({
      allowAutoTopicCreation: true,
      transactionTimeout: 30000,
      retry: config.retry,
    });

    this.producer.on("producer.connect", () => {
      console.log("Kafka producer connected");
      this.isConnected = true;
    });
    this.producer.on("producer.disconnect", () => {
      console.log("Kafka producer disconnected");
      this.isConnected = false;
    });
    this.producer.on("producer.network.request_timeout", (payload) => {
      console.log("Kafka producer request timeout:", payload);
      this.isConnected = false;
    });
  }

  async connect(): Promise<void> {
    if (this.isConnected) {
      console.log("Kafka producer already conducted");
      return;
    }

    try {
      await this.producer.connect();
      this.isConnected = true;
      console.log("Kafka producer connected successfully");
    } catch (error) {
      console.error("Failed to connect Kafka producer:", error);
      throw error;
    }
  }
}
