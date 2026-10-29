/** Validate AUTHOR-SUPPLIED measured text intervals, not OCR or AI judgment.
 * Supply complete text after entry/typewriting, continuous fully-visible start
 * and end, and its measured screen box. Empty input is NOT a passing check.
 */
export function checkReading(blocks,{width,height,cjkCps=4.5,latinCps=15,pad=1.5,captionSafe=false}={}) {
  if(!blocks?.length)return {status:'not_checked',issues:['No measured text intervals supplied']};
  if(!(width>0&&height>0&&cjkCps>0&&latinCps>0))throw new Error('Positive dimensions and reading speeds required');
  const issues=[];
  for(const b of blocks){
    let cjk=0,latin=0;for(const c of b.text||''){if(/\s/u.test(c))continue;if(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u.test(c))cjk++;else latin++;}
    const needed=Math.max(1.5,cjk/cjkCps+latin/latinCps+pad);
    const finite=[b.start,b.end,b.x0,b.y0,b.x1,b.y1].every(Number.isFinite);
    if(!finite||!b.text||b.end-b.start<needed)issues.push({id:b.id,reason:'reading_time_or_metadata',needed});
    if(!finite||b.x0<0||b.y0<0||b.x1>width||b.y1>height||b.x1<=b.x0||b.y1<=b.y0)issues.push({id:b.id,reason:'outside_frame_or_invalid_box'});
    if(captionSafe&&b.caption&&height>width&&(b.x0<96*width/1080||b.x1>width-96*width/1080||b.y1>height-520*height/1920))issues.push({id:b.id,reason:'caption_safe_area'});
  }
  return {status:issues.length?'fail':'pass',issues};
}
