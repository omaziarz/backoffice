'use client';

import { Application } from '@/data/applications';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface Props {
  applications: Application[];
  defaultApplicationId?: string;
}

export function ApplicationPicker({
  applications,
  defaultApplicationId,
}: Props) {
  const [applicationId, setApplicationId] = useState<string | undefined>(
    defaultApplicationId
  );

  const router = useRouter();

  useEffect(() => {
    if (applicationId) {
      router.replace(`/dashboard/${applicationId}`);
    }
  }, [applicationId]);

  return (
    <select
      value={applicationId}
      onChange={(e) => setApplicationId(e.target.value)}
      className="select select-sm w-full max-w-xs bg-base-200 mb-4"
    >
      {applications.map((application) => (
        <option key={application.id} value={application.id}>
          {application.name}
        </option>
      ))}
    </select>
  );
}
