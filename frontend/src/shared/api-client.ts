import {
  ApiRequest,
  PatchApiRequest,
  PostApiRequest,
  PutApiRequest,
} from './api-request-type';
import { Response } from '../features/auth/types/auth';

export class ApiClient {
  constructor(private readonly baseUrl: string) {}

  async request<TResponse, TBody = unknown, TQuery = unknown>(
    req: ApiRequest<TBody, TQuery>,
  ): Promise<Response<TResponse>> {
    const url = this.buildUrl(req.path, 'query' in req ? req.query : undefined);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...req.headers,
    };

    if (req.withAuth) {
      const token = this.getAccessToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    const response = await fetch(url, {
      method: req.method,
      headers,
      body: this.hasBody(req) ? JSON.stringify(req.body) : undefined,
    });

    if (!response.ok) {
      throw await this.buildError(response);
    }

    if (response.status === 204) {
      return undefined as unknown as Response<TResponse>;
    }

    return (await response.json()) as Response<TResponse>;
  }

  private buildUrl(path: string, query?: unknown): string {
    const url = new URL(path, this.baseUrl);

    if (query && typeof query === 'object') {
      Object.entries(query as Record<string, unknown>).forEach(
        ([key, value]) => {
          if (value === undefined || value === null) return;
          url.searchParams.append(key, String(value));
        },
      );
    }

    return url.toString();
  }

  private getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private hasBody(
    req: ApiRequest<unknown, unknown>,
  ): req is
    | PostApiRequest<unknown>
    | PutApiRequest<unknown>
    | PatchApiRequest<unknown> {
    return (
      req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH'
    );
  }

  private async buildError(response: Response): Promise<Error> {
    try {
      const data = await response.json();
      const message =
        typeof data === 'object' &&
        data !== null &&
        'message' in data &&
        typeof data.message === 'string'
          ? data.message
          : `HTTP Error: ${response.status}`;
      return new Error(message);
    } catch {
      return new Error(`HTTP Error: ${response.status}`);
    }
  }
}
