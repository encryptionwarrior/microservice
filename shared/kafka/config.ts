import { KafkaConfig } from "./types";

export function getKafkaConfig(): KafkaConfig {
  const brokers = process.env.KAFKA_BROKERS || "localhost:9092";
  const clientId = process.env.KAFKA_CLIENT_ID || "notesverb-service";

  return {
    clientId,
    brokers: brokers.split(","),
    connectionTimeout: parseInt(
      process.env.KAFKA_REQUEST_TIMEOUT || "3000",
      10,
    ),
    requestTimeout: parseInt(process.env.KAFKA_REQUEST_TIMEOUT || "30000", 10),
    retry: {
      retries: parseInt(process.env.KAFKA_RETRY_COUNT || "5", 10),
      initialRetryTime: parseInt(
        process.env.KAFKA_INITIAL_RETRY_TIME || "300",
        10,
      ),
      maxRetryTime: parseInt(process.env.KAFKA_MAX_RETRY_TIME || "30000", 10),
    },
  };
}

export function validateKafkaConfig(): void  {
    const brokers = process.env.KAFKA_BROKERS;
    if(!brokers){
        console.warn("KAFKA_BROKERS not set, using default: localhost:9092");
    }
}
