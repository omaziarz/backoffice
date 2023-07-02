import { getBaseUrl } from '@/helpers/fetch';

export interface Application {
  id: string;
  secret: string;
  name: string;
  origin: string;
}

export async function getApplication(
  accessToken: string,
  applicationId: string
): Promise<Application> {
  const res = await fetch(`${getBaseUrl()}/applications/${applicationId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await res.json();

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('Unauthorized');
    }
    throw new Error("Can't fetch application");
  }

  return data;
}

export async function getFirstUserApplication(
  accessToken: string
): Promise<Pick<Application, 'id'>> {
  const res = await fetch(`${getBaseUrl()}/applications/first`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await res.json();

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('Unauthorized');
    }
    throw new Error("Can't fetch application");
  }

  console.log('data', data);

  return data;
}

export async function getAllUserApplications(
  accessToken: string
): Promise<Application[]> {
  const res = await fetch(`${getBaseUrl()}/applications`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await res.json();

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('Unauthorized');
    }
    throw new Error("Can't fetch applications");
  }

  return data;
}

interface CreateApplicationData {
  name: string;
  origin: string;
  accessToken: string;
}

export async function createApplication({
  accessToken,
  ...rest
}: CreateApplicationData) {
  console.log(rest);

  const res = await fetch(`${getBaseUrl()}/applications`, {
    method: 'POST',
    body: JSON.stringify(rest),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const payload = await res.json();

  console.log(payload);

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('Unauthorized');
    }
    throw new Error("Couldn't create application. Please try again later.");
  }

  return payload;
}
