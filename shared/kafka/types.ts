
export interface BaseEvent {
  eventId: string;
  eventType: string;
  timestamp: string;
  version?: string;
}

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

export interface UserRegisteredEvent extends BaseEvent {
  eventType: "UserRegistered";
  userId: string;
  email: string;
}

export interface UserDeletedEvent extends BaseEvent {
  eventType: "UserDeleted";
  userId: string;
  email: string;
  deletedBy?: string;
  reason?: string;
}

export interface UserUpdatedEvent extends BaseEvent {
  eventType: "UserUpdated";
  userId: string;
  email: string;
  changes: Record<string, any>;
}

// Authentication events
export interface UserLoggedInEvent extends BaseEvent {
  eventType: "UserLoggedIn";
  userId: string;
  email: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface UserLoggedOutEvent extends BaseEvent {
  eventType: "UserLoggedOut";
  userId: string;
  email: string;
}

export interface TokenRefreshedEvent extends BaseEvent {
  eventType: "TokenRefreshed";
  userId: string;
  email: string;
}

// Note events
export interface NoteCreatedEvent extends BaseEvent {
  eventType: "NoteCreated";
  noteId: string;
  userId: string;
  title: string;
  contentLength: number;
  tagIds: string[];
}

export interface NoteUpdatedEvent extends BaseEvent {
  eventType: "NoteUpdated";
  noteId: string;
  userId: string;
  changes: {
    title?: boolean;
    content?: boolean;
    tags?: boolean;
  };
}

export interface NoteDeletedEvent extends BaseEvent {
  eventType: "NoteDeleted";
  noteId: string;
  userId: string;
  isSoftDelete: boolean;
}

export interface NoteViewedEvent extends BaseEvent {
  eventType: "NoteViewed";
  noteId: string;
  userId: string;
}

// Tag events
export interface TagCreatedEvent extends BaseEvent {
  eventType: "TagCreated";
  tagId: string;
  userId: string;
  name: string;
  color?: string;
}

export interface TagUpdatedEvent extends BaseEvent {
  eventType: "TagUpdated";
  tagId: string;
  userId: string;
  changes: {
    name?: string;
    color?: string;
  };
}

export interface TagDeletedEvent extends BaseEvent {
  eventType: "TagDeleted";
  tagId: string;
  userId: string;
  name: string;
}

// Search events
export interface SearchPerformedEvent extends BaseEvent {
  eventType: "SearchPerformed";
  userId: string;
  query: string;
  filters?: {
    tags?: string[];
  };
  resultsCount: number;
  responseTime: number;
}

export interface SearchIndexedEvent extends BaseEvent {
  eventType: "SearchIndexed";
  noteId: string;
  userId: string;
  action: "created" | "updated" | "deleted";
}

export enum KafkaTopic {
  USER_LIFECYCLE = "user.lifecycle",
  USER_AUTHENTICATION = "user.authentication",
  NOTES_EVENTS = "notes.events",
  NOTES_VIEWS = "notes.views",
  TAGS_EVENTS = "tags.events",
  SEARCH_EVENTS = "search.events",
  AUDIT_LOGS = "audit.logs",
  ANALYTICS_EVENTS = "analytics.events",
}



export type KafkaEvent =
  | UserRegisteredEvent
  | UserDeletedEvent
  | UserUpdatedEvent
  | UserLoggedInEvent
  | UserLoggedOutEvent
  | TokenRefreshedEvent
  | NoteCreatedEvent
  | NoteUpdatedEvent
  | NoteDeletedEvent
  | NoteViewedEvent
  | TagCreatedEvent
  | TagUpdatedEvent
  | TagDeletedEvent
  | SearchPerformedEvent
  | SearchIndexedEvent;

  export interface ProducerMessageOptions {
  key?: string; // Message key for partitioning
  headers?: Record<string, string>; // Message headers
  partition?: number; // Specific partition to send to
}