export type PostMemoryRequest = {
  content: string;
};

export type PostMemoryResponseData = {
  memory_id: string;
  content: string;
  created_at: string;
};

export type MemoriesRequest = {};

export type MemoriesResponseData = {
  items: Memory[];
};

export type Memory = {
  memory_id: string;
  content: string;
  created_at: string;
};
