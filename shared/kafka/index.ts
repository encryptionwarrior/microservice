export * from "./types";

export * from "./config";

export { KafkaProducer, getKafkaProducer, publishEvent } from "./producer";

export { KafkaConsumer, createConsumer } from "./consumer";

export type { RecordMetadata } from "kafkajs";
