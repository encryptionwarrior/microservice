import { Consumer, EachMessageHandler, Kafka } from "kafkajs";
import { getKafkaConfig } from "./config";
import { KafkaTopic, MessageHandler } from "./types";

export class KafkaConsumer {
  private kafka: Kafka;
  private consumer: Consumer;
  private isConnected: boolean = false;
  private messageHandlers: Map<string, MessageHandler> = new Map();

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

  async connect(): Promise<void> {
    if (this.isConnected) {
      console.log("Kafka consumer already connected");
      return;
    }

    try {
      this.consumer.connect();
      console.log("Kafka consumer connected succesffully");
    } catch (error) {
      console.error("Failed to connect kafka consumer", error);
      throw error;
    }
  }
  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      this.consumer.disconnect();
      console.log("Kafka consumer disconnected succesffully");
    } catch (error) {
      console.error("Error dicconnecting kafka consumer", error);
      throw error;
    }
  }

  async subscribe(
    topics: string[] | KafkaTopic[],
    handler: MessageHandler,
  ): Promise<void> {
    if (!this.isConnected) {
      throw new Error("Kafka consumer is connected");
    }

    try {
      await this.consumer.subscribe({
        topics: topics as string[],
        fromBeginning: false,
      });

      topics.forEach((topic) => {
        this.messageHandlers.set(topic, handler);
      });

      console.log(`📥 Subscribed to topics: ${topics.join(", ")}`);
    } catch (error) {
      console.error("Failed to subscribe to topics:", error);
      throw error;
    }
  }
}
