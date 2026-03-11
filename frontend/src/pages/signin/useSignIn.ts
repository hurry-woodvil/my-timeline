import { useState } from 'react';
import { signIn } from '../../services/authService';

export function useSignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit() {
    try {
      const res = await signIn({
        email,
        password,
      });
      console.log('login success', res);
    } catch (e) {
      console.log('login failed', e);
    }
  }

  return {
    email,
    password,
    setEmail,
    setPassword,
    handleSubmit,
  };
}
