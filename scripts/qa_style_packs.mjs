// Browser integration checks for drawing libraries, not a production renderer.
// Usage: node scripts/qa_style_packs.mjs [--modules /path/to/node_modules]
//   [--out projects/style-pack-qa] [--browser /path/to/chrome]
//   [--clips] [--new | --pack slug1,slug2] [--merge] [--report-only]
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {spawn,execFileSync} from 'node:child_process';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const arg=(key,fallback)=>{const i=process.argv.indexOf(key);return i<0?fallback:process.argv[i+1];};
const modules=path.resolve(arg('--modules',path.join(ROOT,'style-packs/node_modules')));
const out=path.resolve(arg('--out',path.join(ROOT,'projects/style-pack-qa')));
const require=createRequire(path.join(modules,'package.json'));
const {chromium}=require('playwright-core');
const allPacks=JSON.parse(fs.readFileSync(path.join(ROOT,'style-packs/catalog.json'))).packs;
const selected=arg('--pack','').split(',').filter(Boolean);
const packs=allPacks.filter(p=>(!process.argv.includes('--new')||p.group===4)&&(!selected.length||selected.includes(p.id)||selected.includes(p.slug)));
if(!packs.length)throw new Error('No matching styles');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
function writeIndex(report) {
  const visible=allPacks.filter(p=>report.checks.some(r=>r.pack===p.id));
  const cards=visible.map(pack=>{
    const rows=report.checks.filter(r=>r.pack===pack.id),row=rows.find(r=>r.format==='landscape');
    const passed=rows.length===2&&rows.every(r=>r.passed),fit=pack.group<=3?'primary':pack.finance_fit;
    const label={primary:'财经优先',specialist:'专项素材',supporting:'叙事辅助'}[fit];
    return `<article data-fit="${fit}"><h2>${pack.name}</h2><p><small>${pack.slug} · ${label}</small></p><p>${pack.visual_contract}</p>${row?.clip_info?`<video controls preload="none" poster="${pack.id}-landscape-6.5.png" src="${row.clip}"></video>`:`<img loading="lazy" src="${pack.id}-landscape-6.5.png" alt="${pack.name}">`}<p><a href="${pack.id}-portrait-6.5.png">竖屏关键帧</a> · ${passed?'技术检查通过':'检查未通过'}</p><p><small>依赖：${pack.requires.join(' / ')||'Canvas 2D'}</small></p></article>`;
  }).join('');
  fs.writeFileSync(path.join(out,'index.html'),`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${visible.length}种风格 · 技术验证</title><style>body{max-width:1200px;margin:40px auto;padding:0 24px;font:17px/1.7 system-ui;color:#e8e8e5;background:#181c20}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(330px,1fr));gap:28px}article{padding:20px;background:#22282d;border-radius:12px}article[hidden]{display:none}video,img{width:100%;display:block}a{color:#8ed0cf}h2{font-size:22px}small{color:#b7c7c2}select,input{font:inherit;padding:10px;margin:0 12px 24px 0;max-width:90%;background:#29332f;color:#eee;border:1px solid #698278;border-radius:5px}</style><h1>${visible.length}种画面风格</h1><p>12种财经优先风格＋47种叙事辅助/专项风格。合成数据与技术夹具用于验证绘制接口和运动；每段8秒、12fps、无声。真实影像、档案、工程模型、点云和扫描切片须在具体项目另行准备。这些样例不代表原样片全功能等价或最终成片质量；竖屏页保留材质画幅，正式竖屏作品须单独设计镜头。</p><p><a href="report.json">自动检查报告</a> · ${report.checks.filter(r=>r.passed).length}/${report.checks.length} 项通过</p><select id="fit" aria-label="财经适用类型"><option value="all">全部风格</option value="primary">财经优先</option><option value="supporting">叙事辅助</option><option value="specialist">专项素材</option></select><input id="search" aria-label="搜索风格" placeholder="搜索中文名或英文名"><main>${cards}</main><script>const fit=document.getElementById('fit'),search=document.getElementById('search');function filter(){for(const a of document.querySelectorAll('article'))a.hidden=(fit.value!=='all'&&a.dataset.fit!==fit.value)||!a.textContent.toLowerCase().includes(search.value.toLowerCase());}fit.onchange=filter;search.oninput=filter;</script></html>`);
}
if(process.argv.includes('--report-only')) { writeIndex(JSON.parse(fs.readFileSync(path.join(out,'report.json'))));process.exit(0); }
const mime={'.html':'text/html','.js':'text/javascript','.json':'application/json','.css':'text/css','.woff2':'font/woff2','.ttf':'font/ttf','.txt':'text/plain'};
async function clip(page,file) {
  const fps=12,seconds=8;
  const ff=spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-vcodec','mjpeg','-r',String(fps),'-i','-','-an','-c:v','libx264','-preset','fast','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart',file],{stdio:['pipe','ignore','pipe']});
  let error='';ff.stderr.on('data',b=>{error+=b;});
  const closed=new Promise((resolve,reject)=>{ff.once('error',reject);ff.once('close',code=>code===0?resolve():reject(new Error(error)));});
  let pipeError=null;ff.stdin.on('error',e=>{pipeError=e;});
  try{
    for(let frame=0;frame<fps*seconds;frame++){
      if(pipeError)throw pipeError;
      await page.evaluate(t=>window.render(t),frame/fps);
      const buffer=await page.screenshot({type:'jpeg',quality:90});
      if(!ff.stdin.write(buffer))await Promise.race([new Promise(r=>ff.stdin.once('drain',r)),closed]);
    }
    ff.stdin.end();await closed;
  }catch(e){ff.kill();await closed.catch(()=>{});throw e;}
  const probe=JSON.parse(execFileSync('ffprobe',['-v','error','-show_streams','-show_format','-of','json',file],{encoding:'utf8'}));
  if(Math.abs(Number(probe.format.duration)-seconds)>.1||probe.streams[0].codec_name!=='h264')throw new Error('Invalid engineering clip');
  return {fps,seconds,frames:fps*seconds};
}
const server=http.createServer((req,res)=>{
  try{
    const url=new URL(req.url,'http://localhost'),rel=decodeURIComponent(url.pathname);
    let base,sub;
    if(rel.startsWith('/style-packs/node_modules/')){base=modules;sub=rel.slice('/style-packs/node_modules/'.length);}
    else if(rel.startsWith('/style-packs/')){base=path.join(ROOT,'style-packs');sub=rel.slice('/style-packs/'.length);}
    else {res.writeHead(404).end();return;}
    const p=path.resolve(base,sub);
    if(!p.startsWith(base+path.sep)||!mime[path.extname(p)]){res.writeHead(403).end();return;}
    res.writeHead(200,{'Content-Type':mime[path.extname(p)]});res.end(fs.readFileSync(p));
  }catch{res.writeHead(404).end();}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
let browser;
const previous=process.argv.includes('--merge')&&fs.existsSync(path.join(out,'report.json'))?JSON.parse(fs.readFileSync(path.join(out,'report.json'))):null;
const expectedPacks=new Set([...packs.map(p=>p.id),...(previous?.checks.map(r=>r.pack)||[])]);
const report={kind:'engineering-fixtures',real_evidence_validated:false,checks:previous?.checks.filter(r=>!packs.some(p=>p.id===r.pack))||[],errors:[],last_run:{at:new Date().toISOString(),packs:packs.map(p=>p.id)}};
try {
  fs.mkdirSync(out,{recursive:true});
  browser=await chromium.launch({headless:true,executablePath:arg('--browser',process.env.PLAYWRIGHT_CHROME),args:process.platform==='darwin'?['--use-angle=metal','--enable-gpu','--ignore-gpu-blocklist','--force-color-profile=srgb']:['--enable-gpu','--force-color-profile=srgb']});
  const url=`http://127.0.0.1:${server.address().port}/style-packs/examples/finance.html`;
  for(const pack of packs)for(const viewport of [{width:960,height:540},{width:540,height:960}]){
    const format=viewport.width>viewport.height?'landscape':'portrait';
    const page=await browser.newPage({viewport,deviceScaleFactor:1});const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
    page.on('requestfailed',r=>errors.push(r.url()+': '+r.failure()?.errorText));
    page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
    const row={pack:pack.id,format,frames:[],passed:false};
    try {
      await page.goto(`${url}?pack=${pack.id}`);await page.waitForFunction(()=>window.READY===true||window.STUDY_ERROR,{},{timeout:45000});
      const studyError=await page.evaluate(()=>window.STUDY_ERROR);if(studyError)throw new Error(studyError);
      const hashes=[];
      for(const time of [.6,2.5,6.5]){
        await page.evaluate(t=>window.render(t),time);
        const name=`${pack.id}-${format}-${time}.png`,buf=await page.screenshot({path:path.join(out,name)});hashes.push(hash(buf));row.frames.push(name);
      }
      await page.evaluate(()=>window.render(2.5));
      row.seek_deterministic=hash(await page.screenshot())===hashes[1];
      row.motion_changes_picture=hashes[0]!==hashes[2];
      if(process.argv.includes('--clips')&&format==='landscape'){
        row.clip=`${pack.id}-motion.mp4`;
        row.clip_info=await clip(page,path.join(out,row.clip));
      }
      if(['dataviz','iso-infographic','news-package','data-physical'].includes(pack.slug)){
        await page.goto(`${url}?pack=${pack.id}&variant=b`);await page.waitForFunction(()=>window.READY===true,{},{timeout:45000});await page.evaluate(()=>window.render(6.5));
        row.changed_data_changes_picture=hash(await page.screenshot())!==hashes[2];
      }
      row.errors=errors;row.passed=!errors.length&&row.seek_deterministic&&row.motion_changes_picture&&row.changed_data_changes_picture!==false;
    }catch(e){row.errors=[...errors,e.message];}
    report.checks.push(row);console.log(`${row.passed?'PASS':'FAIL'} ${pack.id} ${format}${row.errors?.length?' '+row.errors.join(' | '):''}`);
    await page.close();
  }
}finally{
  await browser?.close();await new Promise(r=>server.close(r));
  report.passed=report.checks.length===expectedPacks.size*2&&report.checks.every(r=>r.passed);
  report.coverage={catalog_packs:allPacks.length,checked_packs:expectedPacks.size,complete_catalog:expectedPacks.size===allPacks.length};
  fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2)+'\n');
  writeIndex(report);
}
if(!report.passed)process.exitCode=1;
