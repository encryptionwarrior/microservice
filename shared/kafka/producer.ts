import { Kafka, Producer, RecordMetadata } from "kafkajs";
import { getKafkaConfig } from "./config";
import { KafkaEvent, KafkaTopic, ProducerMessageOptions } from "./types";
import { v4 as uuidv4 } from "uuid";

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

  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await this.producer.disconnect();
      this.isConnected = false;
      console.log("Kafka producer disconnected cusccessfully");
    } catch (error) {
      console.error("Error disconnecting Kafka producer:", error);
      throw error;
    }
  }

  async publishEvent<T extends KafkaEvent>(
    topic: KafkaTopic | string,
    event: Omit<T, "eventId" | "timestamp">,
    options: ProducerMessageOptions,
  ): Promise<RecordMetadata[]> {
    if (!this.isConnected) {
      throw new Error("Kafka producer is not connected");
    }

    const fullEvent: KafkaEvent = {
      ...event,
      eventId: uuidv4(),
      timestamp: new Date().toISOString(),
      version: "1.0",
    } as unknown as KafkaEvent;

    try {
      const result = await this.producer.send({
        topic,
        messages: [
          {
            key: options?.key || fullEvent.eventId,
            value: JSON.stringify(fullEvent),
            headers: options?.headers,
            partition: options.partition,
          },
        ],
      });

      console.log(
        `Event published: ${fullEvent.eventType} to ${topic}`,
        result,
      );

      return result;
    } catch (error) {
      console.error(
        `Failed to publish event ${fullEvent.eventType} to ${topic}:`,
        error,
      );
      throw error;
    }
  }
}
