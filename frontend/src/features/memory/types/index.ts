// GET /memories
export type GetMemoriesRequestPayload = {};

export type GetMemoriesResponseBodyData = {
  items: Memory[];
};

// GET /memories/{id}
export type GetMemoryRequestPayload = {};

export type GetMemoryResponseBodyData = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

// POST /memories
export type PostMemoryRequestPayload = {
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type PostMemoryResponseBodyData = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

// DELETE /memories/{id}
export type DeleteMemoryRequestPayload = {};

export type DeleteMemoryResponseBodyData = {
  id: string;
};

// PATCH /memories/{id}
export type PatchMemoryRequestPayload = {
  content: string | null;
  updatedAt: string;
};

export type PatchMemoryResponseBodyData = {
  content?: string;
};

export type Memory = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};
