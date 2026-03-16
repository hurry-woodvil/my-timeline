import { ApiClient } from '../shared/api-client';
import { env } from '../config/env';

export const apiClient = new ApiClient(env.apiBaseUrl);
