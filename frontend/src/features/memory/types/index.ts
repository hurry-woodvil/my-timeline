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
  isClip: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

// POST /memories
export type PostMemoryRequestPayload = {
  content: string;
  isClip: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type PostMemoryResponseBodyData = {
  id: string;
  content: string;
  isClip: boolean;
  tags: string[];
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
  isClip: boolean | null;
  tags: string[] | null;
  updatedAt: string;
};

export type PatchMemoryResponseBodyData = {
  id: string;
  content?: string;
  isClip?: boolean;
  tags?: string[];
  updatedAt: string;
};

export type Memory = {
  id: string;
  content: string;
  isClip: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};
