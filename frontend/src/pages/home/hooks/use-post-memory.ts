import { useState } from 'react';
import { postMemory as postMemoryService } from '@/features/memory/services/memory-service';

export function usePostMemory() {
  const [content, setContent] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const result = await postMemoryService(content);

      if (result.success) {
        setContent('');
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to post memory';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
      setContent('');
    }
  }

  return {
    content,
    errorMessage,
    isSubmitting,
    setContent,
    setErrorMessage,
    setIsSubmitting,
    handleSubmit,
  };
}
