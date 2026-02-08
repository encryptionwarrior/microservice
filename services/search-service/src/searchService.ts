

export interface SearchDocument {
  noteId: string;
  userId: string;
  title: string;
  content: string;
  tags: string[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  indexedAt: string;
}

export interface SearchQuery {
  query?: string;
  userId: string;
  tags?: string[];
  from?: number;
  size?: number;
  sortBy?: "relevance" | "created" | "updated";
  sortOrder?: "asc" | "desc";
  // Advanced search options
  fuzzy?: boolean;
  fuzziness?: number | "AUTO";
  dateFrom?: string;
  dateTo?: string;
  createdLast?: string; // "7d", "30d", "1y", etc.
  contentLength?: "short" | "medium" | "long";
}

export interface SearchResult {
  noteId: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  score: number;
  highlights?: {
    title?: string[];
    content?: string[];
  };
}


export interface SearchResponse {
  results: SearchResult[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  took: number;
}


// export async function searchNotes(
//     searchQuery: SearchQuery
// ): Promise<SearchResponse> {
//     const client = getElasticSearchClient
// }