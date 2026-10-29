import React, {useLayoutEffect, useRef, useState} from 'react';
import {cancelRender, continueRender, delayRender, useCurrentFrame, useVideoConfig} from 'remotion';

type Drawing = {render: (seconds: number) => void; dispose?: () => void};
type Props = {create: (canvas: HTMLCanvasElement) => Drawing | Promise<Drawing>};

/** Keep create stable (module-level or useCallback). Load all assets in create.
 * Production scene composition and captions remain project-owned.
 */
export const RemotionDrawing: React.FC<Props> = ({create}) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const latestTime = useRef(frame / fps);
  latestTime.current = frame / fps;
  const drawing = useRef<Drawing | null>(null);
  const [generation, setGeneration] = useState(0);
  // Block the first frame until the async drawing engine and fonts are ready.
  const [initialHandle] = useState(() => delayRender('Style-pack drawing initialization'));
  const first = useRef(true);
  useLayoutEffect(() => {
    let live = true;
    const handle = first.current ? initialHandle : delayRender('Style-pack drawing reinitialization');
    first.current = false;
    Promise.resolve().then(() => create(canvas.current!)).then(d => {
      if (!live) { d.dispose?.(); continueRender(handle); return; }
      drawing.current = d;
      d.render(latestTime.current);
      setGeneration(g => g + 1);
      continueRender(handle);
    }).catch(e => { if (live) cancelRender(e); else continueRender(handle); });
    return () => { live = false; drawing.current?.dispose?.(); drawing.current = null; };
  }, [create, width, height, initialHandle]);
  useLayoutEffect(() => { drawing.current?.render(frame / fps); }, [frame, fps, generation]);
  return <canvas ref={canvas} width={width} height={height} style={{width, height}} />;
};
