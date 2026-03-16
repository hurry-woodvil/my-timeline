export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type BaseApiRequest = {
  path: string;
  withAuth?: boolean;
  headers?: Record<string, string>;
};

export type GetApiRequest<TQuery = undefined> = BaseApiRequest & {
  method: 'GET';
  query?: TQuery;
};

export type DeleteApiRequest<TQuery = undefined> = BaseApiRequest & {
  method: 'DELETE';
  query?: TQuery;
};

export type PostApiRequest<TBody = undefined> = BaseApiRequest & {
  method: 'POST';
  body: TBody;
};

export type PutApiRequest<TBody = undefined> = BaseApiRequest & {
  method: 'PUT';
  body: TBody;
};

export type PatchApiRequest<TBody = undefined> = BaseApiRequest & {
  method: 'PATCH';
  body: TBody;
};

export type ApiRequest<TBody = unknown, TQuery = unknown> =
  | GetApiRequest<TQuery>
  | DeleteApiRequest<TQuery>
  | PostApiRequest<TBody>
  | PutApiRequest<TBody>
  | PatchApiRequest<TBody>;
