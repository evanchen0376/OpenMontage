/** Connect a custom drawing function to an existing, locally loaded GSAP runtime.
 * Call synchronously, BEFORE asynchronous asset loading. Await assets separately
 * and use the returned redraw() after they are ready. No RAF or wall clocks.
 */
export function registerDrawing(gsap, id, duration, draw) {
  if (!gsap?.timeline || !id || !(duration > 0)) throw new Error('GSAP, composition id and positive duration required');
  const time = { seconds: 0 };
  const timeline = gsap.timeline({ paused: true });
  // This tween drives real picture state; it is not a duration-only dummy tween.
  timeline.to(time, { seconds: duration, duration, ease: 'none', onUpdate: () => draw(time.seconds) }, 0);
  window.__timelines = window.__timelines || {};
  window.__timelines[id] = timeline;
  return { timeline, redraw: () => draw(time.seconds) };
}
