'use client';

import { useRouter } from 'next/navigation';
import { useMutation } from 'react-query';
import { createApplication } from './applications';

export function useCreateApplicationMutation() {
  const router = useRouter();

  return useMutation(createApplication, {
    onSuccess: () => {
      router.refresh();
    },
  });
}
