import { useState } from 'react';
import { signup as signupService } from '@/features/auth';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function useSignUp() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const result = await signupService(email, password);
      if (!result) {
        console.log('signup failed');
      }
      signup(result.data);
      navigate('/timeline');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to sign up.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    email,
    password,
    isSubmitting,
    errorMessage,
    setEmail,
    setPassword,
    handleSubmit,
  };
}
