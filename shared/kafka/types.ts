

export interface KafkaConfig {
    clientId: string;
    brokers: string[];
    connectionTimeout?: number;
    requestTimeout?: number;
    retry?: {
        retries?: number;
        initialRetryTime?: number;
        maxRetryTime?: number;
    }
}