import { SignInRequest, SignInResponse } from '../types/auth';

export async function signIn(payload: SignInRequest): Promise<SignInResponse> {
  console.log('mock signin request', payload);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        token: 'mock-token-123',
      });
    }, 500);
  });
}
