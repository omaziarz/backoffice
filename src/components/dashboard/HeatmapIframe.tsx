'use client';

import { Application } from '@/data/applications';
import { useApplicationEventHeatmap } from '@/data/eventHooks';
import HM from 'heatmap.js';
import IframeResizer from 'iframe-resizer-react';
import { debounce } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { PageLoader } from '../PageLoader';

interface Props {
  accessToken: string;
  application: Application;
}

export function HeatMapIframe({ accessToken, application }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  const onResize = debounce(() => {
    if (ref.current) {
      setDimensions({
        width: ref.current.clientWidth,
        height: ref.current.clientHeight,
      });
    }
  }, 400);

  const removeHeatmap = () => {
    ref.current?.querySelector('canvas')?.remove();
  };

  useEffect(() => {
    window.addEventListener('resize', onResize);
    window.addEventListener('resize', removeHeatmap);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('resize', removeHeatmap);
      removeHeatmap();
    };
  }, []);

  const query = useApplicationEventHeatmap(
    accessToken,
    application.id,
    dimensions.width,
    dimensions.height
  );

  if (
    query.isSuccess &&
    query.data &&
    ref.current &&
    dimensions.width > 0 &&
    dimensions.height > 0
  ) {
    ref.current?.querySelector('canvas')?.remove();

    const heatmap = HM.create({
      container: ref.current,
      radius: 10,
    });

    heatmap.setData(query.data);
  }

  return (
    <div className="relative">
      <div ref={ref}>
        <IframeResizer
          onResized={onResize}
          style={{ width: '1px', minWidth: '100%' }}
          src={application?.origin}
        />
      </div>
      {(query.isLoading || query.isFetching) && (
        <div className="absolute inset-0 bg-black/90 flex flex-1 justify-center items-center">
          <PageLoader />
        </div>
      )}
    </div>
  );
}
