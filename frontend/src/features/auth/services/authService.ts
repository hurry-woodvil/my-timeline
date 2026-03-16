import { SignInRequest, SignInResponse } from '../types/auth';

export async function signIn(payload: SignInRequest): Promise<SignInResponse> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!payload.email || !payload.password) {
        reject(new Error('Email and Password are required.'));
        return;
      }

      resolve({
        accessToken: 'token12345',
      });
    }, 500);
  });
}
