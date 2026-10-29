import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {registerDrawing} from '../../style-packs/shared/hyperframes.js';
import {checkReading} from '../../style-packs/shared/readability.js';
const require=createRequire(new URL('../../style-packs/package.json',import.meta.url));
const {gsap}=require('gsap');

test('HF adapter registers immediately, seeks actual drawing state and rewinds',()=>{
  globalThis.window={};const samples=[];
  const {timeline,redraw}=registerDrawing(gsap,'finance-style',8,t=>samples.push(t));
  assert.equal(window.__timelines['finance-style'],timeline);
  timeline.seek(6,false);assert.equal(samples.at(-1),6);
  timeline.seek(2,false);assert.equal(samples.at(-1),2);
  timeline.seek(0,false);redraw();assert.equal(samples.at(-1),0);
  timeline.kill();gsap.ticker.sleep();delete globalThis.window;
});
test('reading QA distinguishes not checked, inadequate hold, and unsafe portrait captions',()=>{
  const options={width:1080,height:1920,captionSafe:true};
  assert.equal(checkReading([],options).status,'not_checked');
  const block={id:'caption',text:'利率变化需要结合期限理解',start:0,end:6,x0:96,y0:1200,x1:984,y1:1320,caption:true};
  assert.equal(checkReading([block],options).status,'pass');
  assert.equal(checkReading([{...block,end:1}],options).status,'fail');
  assert.equal(checkReading([{...block,y1:1650}],options).issues.at(-1).reason,'caption_safe_area');
});
