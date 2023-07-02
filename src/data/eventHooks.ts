import { useQuery } from 'react-query';
import { getApplicationEvents } from './event';

type Event = 'mousemove' | 'click';

export function useApplicationEventHeatmap(
  accessToken: string,
  applicationId: string,
  width: number,
  height: number,
  event?: Event
) {
  return useQuery(
    ['applicationEventHeatmap', applicationId, width, height, event],
    async () =>
      await getApplicationEvents(
        accessToken,
        applicationId,
        width,
        height,
        event
      ),
    {
      enabled: !!accessToken && width > 0 && height > 0,
      suspense: false,
    }
  );
}
