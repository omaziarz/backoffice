import { getBaseUrl } from '@/helpers/fetch';

interface Event {
  min: number;
  max: number;
  data: { x: number; y: number; value: number }[];
}

export async function getApplicationEvents(
  accessToken: string,
  applicationId: string,
  width: number,
  height: number,
  event_type?: 'mousemove' | 'click'
): Promise<Event> {
  const res = await fetch(
    `${getBaseUrl()}/tracker-event/${applicationId}?width=${width}&height=${height}` +
      (event_type ? `&event_type=${event_type}` : ''),
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('Unauthorized');
    }
    throw new Error("Can't fetch events");
  }

  return data;
}
