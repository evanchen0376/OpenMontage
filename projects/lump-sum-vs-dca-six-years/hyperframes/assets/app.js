window.initFilm = () => {
  "use strict";
  const DATA = window.CHART_DATA;
  const $ = id => { const node = document.getElementById(id); if (!node) throw new Error(`Missing scene element: ${id}`); return node; };
  const fmt0 = n => Math.round(n).toLocaleString("en-US");
  const fmt2 = n => n.toLocaleString("en-US", {minimumFractionDigits:2, maximumFractionDigits:2});
  const signed = n => `${n >= 0 ? "+" : "−"}${fmt0(Math.abs(n))}`;
  const pct = n => `${n >= 0 ? "+" : "−"}${Math.abs(n).toFixed(2)}%`;
  const topline = (number, right) => `<div class="topline"><span>72 MONTHS / ${number}</span><span>${right}</span></div><div class="rule"></div>`;
  const src = text => `<div class="source">${text}</div>`;
  const tl = gsap.timeline({paused:true});

  $("sc01").innerHTML = `<div class="inner">${topline("00", "THREE INDEXES / SIX YEARS")}
    <h1 class="hero-title">同样10万元，<br>一次买入还是定投？</h1>
    <p class="hero-sub">沪深300 · 中证500 · 中证红利低波动</p>
    <p class="hero-meta">三条指数全收益曲线｜2020.10—2026.09</p>
    <p class="hero-plot-label">曲线预告：沪深300，两种买法的逐日净收益</p>
    <svg id="heroPlot" class="hero-plot" viewBox="0 0 888 400" aria-label="两种资金路径预告"></svg>
    ${src("中证指数全收益日频数据 · 2020.10.09—2026.09.29")}</div>`;
  $("sc02").innerHTML = `<div class="inner">${topline("01", "TWO ENTRY PATHS")}
    <h2 class="rules-title">同一笔钱，两种入场时间</h2>
    <div class="rules-grid">
      <div class="rule-col lump"><div class="name">一次买入</div><div class="big teal">¥100,000</div><div class="detail">2020.10.09 全部入场</div></div>
      <div class="rule-col dca"><div class="name">每月定投</div><div class="big verm">72 期</div><div class="detail">每月首个交易日买入，累计10万元</div></div>
    </div>
    <div class="month-caption"><span>2020.10</span><span>72 MONTHS</span><span>2026.09</span></div>
    <div class="months" id="months"></div>
    <p class="funding-note">定投每期约 ¥1,388.89；末期调至 ¥1,388.81</p>
    ${src("实际首日 2020.10.09 · 固定截至 2026.09.29 · 项目现金流回测")}</div>`;
  $("months").innerHTML = Array.from({length:72}, (_,i) => `<span class="month" id="month-${i+1}"></span>`).join("");
  $("sc03").innerHTML = `<div class="inner">${topline("02", "HOW TO READ")}
    <h2 class="formula-title">接下来，只看曲线</h2>
    <div class="formula-brief">账户价值 − 当时已投入本金<strong>＝ 逐日净收益（元）</strong></div>
    ${src("比较资金进入市场的路径，不是首日等额资金都在市场里。")}</div>`;

  const plotConfig = [
    ["sc04", "沪深300", "H00300", "03"],
    ["sc05", "中证500", "H00905", "04"],
    ["sc06", "中证红利低波动", "H20269", "05"]
  ];
  const namespace = "http://www.w3.org/2000/svg";
  const make = (tag, attrs, parent) => {
    const node = document.createElementNS(namespace, tag);
    Object.entries(attrs).forEach(([key,value]) => node.setAttribute(key, String(value)));
    parent.appendChild(node);
    return node;
  };
  function drawIndexChart(sceneId, name, rows) {
    const svg = $(sceneId).querySelector("svg.chart");
    const left = 74, right = 852, chartTop = 38, chartBottom = 650;
    const [minY,maxY,ticks] = name === "沪深300" ? [-30000,30000,[-30000,-15000,0,15000,30000]] : name === "中证500" ? [-30000,60000,[-30000,0,30000,60000]] : [-10000,90000,[-10000,0,30000,60000,90000]];
    const sx = i => left + (right-left) * i / (rows.length-1);
    const sy = value => chartTop + (maxY-value) / (maxY-minY) * (chartBottom-chartTop);
    ticks.forEach(value => {
      const y = sy(value);
      make("line", {x1:left, x2:right, y1:y, y2:y, class:value===0?"zero-line":"axis-line"}, svg);
      const label = make("text", {x:0, y:y+7, class:"axis-text"}, svg);
      label.textContent = value===0 ? "0" : `${value>0?"+":"−"}${Number((Math.abs(value)/10000).toFixed(1))}万`;
    });
    const defs = make("defs", {}, svg);
    const clip = make("clipPath", {id:`${sceneId}-clip`}, defs);
    const mask = make("rect", {id:`${sceneId}-mask`, x:left, y:chartTop, width:right-left, height:chartBottom-chartTop}, clip);
    const curves = make("g", {"clip-path":`url(#${sceneId}-clip)`}, svg);
    const path = accessor => rows.map((row,i) => `${i?"L":"M"}${sx(i).toFixed(2)},${sy(accessor(row)).toFixed(2)}`).join(" ");
    make("path", {d:path(row => row.lump_value - 100000), class:"profit-line lump"}, curves);
    make("path", {d:path(row => row.dca_value - row.dca_contributed), class:"profit-line dca"}, curves);
    const cursor = make("g", {id:`${sceneId}-cursor`}, svg);
    make("line", {x1:left,x2:left,y1:chartTop,y2:chartBottom,class:"cursor-line"}, cursor);
    make("circle", {cx:left,cy:sy(0),r:10,class:"cursor-dot"}, cursor);
    const state = {progress:0};
    const update = () => {
      const i = Math.max(0, Math.min(rows.length-1, Math.round(state.progress * (rows.length-1))));
      const row = rows[i];
      const scene = $(sceneId);
      scene.querySelector(".date").textContent = `${row.date.slice(0,4)}.${row.date.slice(4,6)}.${row.date.slice(6,8)}`;
      scene.querySelector(".read-values .lump strong").textContent = signed(row.lump_value-100000);
      scene.querySelector(".read-values .dca strong").textContent = signed(row.dca_value-row.dca_contributed);
      scene.querySelector(".capital-head strong").textContent = `¥${fmt2(row.dca_contributed)} / 100,000`;
      scene.querySelector(".capital-fill").style.transform = `scaleX(${row.dca_contributed/100000})`;
      cursor.setAttribute("transform", `translate(${sx(i)-left},0)`);
    };
    update();
    const start = Number($(sceneId).dataset.sceneStart);
    tl.fromTo(mask, {scaleX:0,transformOrigin:"left center"}, {scaleX:1,duration:43,ease:"none"}, start+1);
    tl.to(state, {progress:1,duration:43,ease:"none",onUpdate:update}, start+1);
    tl.to($(sceneId).querySelector(".result-panel"), {opacity:1,y:0,duration:.6,ease:"power2.out"}, start+44);
    tl.to($(sceneId).querySelectorAll(".readout, .capital, .index-source"), {opacity:0,duration:.35}, start+44);
    return {name, rows};
  }
  plotConfig.forEach(([sceneId,name,code,number]) => {
    const data = DATA[name], lump = data.lump, dca = data.dca;
    $(sceneId).innerHTML = `<div class="inner">${topline(number,"2020.10—2026.09")}
      <h1 class="index-title">${name}</h1><p class="index-sub">一次买入 VS 每月定投 · 逐日净收益（元）· 本图独立纵轴</p>
      <div class="legend"><span class="legend-item"><i class="swatch lump"></i>一次买入</span><span class="legend-item"><i class="swatch dca"></i>每月定投</span></div>
      <div class="chart-shell"><svg class="chart" viewBox="0 0 888 706" role="img" aria-label="${name}两种买法逐日净收益曲线"></svg></div>
      <div class="readout"><div><small>日期 / DATE</small><span class="date">2020.10.09</span></div><div class="read-values"><div class="v lump"><small>一次买入 / 净收益</small><strong>+0</strong></div><div class="v dca"><small>定投 / 净收益</small><strong>+0</strong></div></div></div>
      <div class="capital"><div class="capital-head"><span>定投累计投入</span><strong>¥1,388.89 / 100,000</strong></div><div class="capital-track"><div class="capital-fill"></div></div></div>
      <div class="index-source">数据：中证指数 ${code} 全收益 · 固定观察区间 2020.10.09—2026.09.29</div>
      <div class="result-panel"><h3>${name}｜72个月后</h3><div class="result-main">
        <div class="result-column lump"><div class="method">一次买入</div><div class="amount">¥${fmt2(lump.final_value_yuan)}</div><div class="metric">盈利 <strong>¥${fmt2(lump.profit_yuan)}</strong><br>总收益 <strong>${pct(lump.total_return_pct)}</strong><br>年化 <strong>${pct(lump.annualized_return_pct)}</strong><br>最大浮亏 <strong>${pct(lump.maximum_floating_loss_pct_of_contributions)}</strong></div></div>
        <div class="result-column dca"><div class="method">每月定投</div><div class="amount">¥${fmt2(dca.final_value_yuan)}</div><div class="metric">盈利 <strong>¥${fmt2(dca.profit_yuan)}</strong><br>总收益 <strong>${pct(dca.total_return_pct)}</strong><br>XIRR <strong>${pct(dca.xirr_pct)}</strong><br>最大浮亏 <strong>${pct(dca.maximum_floating_loss_pct_of_contributions)}</strong></div></div>
      </div><div class="result-foot">数据：中证指数 ${code} 全收益 · 2020.10.09—2026.09.29<br>最大浮亏相对当时已投入本金；两种买法的低点不一定同日。</div></div>
      </div>`;
    drawIndexChart(sceneId,name,data.path);
  });
  const summaryRows = ["沪深300","中证500","中证红利低波动"].map(name => {
    const data=DATA[name], difference=data.lump.final_value_yuan-data.dca.final_value_yuan;
    const who=difference>0?"一次买入多":"定投多";
    return `<div class="summary-row"><span class="name">${name}</span><span class="amount teal">¥${fmt2(data.lump.final_value_yuan)}</span><span class="amount verm">¥${fmt2(data.dca.final_value_yuan)}</span><span class="delta">${who} ¥${fmt2(Math.abs(difference))}</span></div>`;
  }).join("");
  const lossRows = ["沪深300","中证500","中证红利低波动"].map(name => `<div class="loss-row"><span>${name}</span><span>${pct(DATA[name].lump.maximum_floating_loss_pct_of_contributions)}</span><span>${pct(DATA[name].dca.maximum_floating_loss_pct_of_contributions)}</span></div>`).join("");
  $("sc07").innerHTML = `<div class="inner">${topline("06","SIX OUTCOMES")}
    <h2 class="summary-title">10万元，六年后</h2>
    <div class="summary-head"><span>指数</span><span>一次买入</span><span>每月定投</span></div>
    ${summaryRows}
    <div class="summary-loss-title">途中最深的浮亏（相对当时已投入本金）</div>
    ${lossRows}
    ${src("中证指数全收益日频 · 2020.10.09—2026.09.29 · 历史回测")}</div>`;
  $("sc08").innerHTML = `<div class="inner">${topline("07","METHOD / LIMITS")}
    <h2 class="method-title">数字的口径，也要看清</h2>
    <div class="method-list">
      <div class="method-item"><span class="num">01</span><span>三条指数统一采用全收益口径，包含分红再投资。</span></div>
      <div class="method-item"><span class="num">02</span><span>定投年化按每笔钱的实际入场时间计算，使用 XIRR。</span></div>
      <div class="method-item"><span class="num">03</span><span>未计交易费、税费、基金跟踪误差和场外资金利息。</span></div>
    </div><p class="method-note">这是指数历史回测，不是基金实际收益；换个起点或定投周期，结果可能不同。</p>
    ${src("原始数据：中证指数 H00300 / H00905 / H20269；计算见本项目回测记录。")}</div>`;
  $("sc09").innerHTML = `<div class="inner">${topline("08","WHAT TO LOOK AT NEXT")}
    <h2 class="final-title">哪种买法更好？</h2>
    <div class="final-claim">先看钱<strong>什么时候进场</strong>；再看<strong>期末金额</strong>，也看<strong>途中最深的浮亏</strong>。</div>
    <p class="final-secondary">这三条历史路径没有给出适用于所有时间、所有指数的统一答案。</p>
    <div class="disclaimer">本视频仅作知识分享，不构成任何投资建议。市场有风险，投资需谨慎。</div>
    <div class="endmark">DATA ENDS · JUDGMENT CONTINUES</div></div>`;

  const heroSvg = $("heroPlot");
  const heroRows = DATA["沪深300"].path.slice(0, 380);
  const heroLeft=26, heroRight=846, heroTop=40, heroBottom=350;
  const heroSx=i=>heroLeft+(heroRight-heroLeft)*i/(heroRows.length-1);
  const heroSy=v=>heroTop+(30000-v)/60000*(heroBottom-heroTop);
  make("line",{x1:heroLeft,x2:heroRight,y1:heroSy(0),y2:heroSy(0),class:"zero-line"},heroSvg);
  const heroPath=accessor=>heroRows.map((row,i)=>`${i?"L":"M"}${heroSx(i).toFixed(2)},${heroSy(accessor(row)).toFixed(2)}`).join(" ");
  make("path",{d:heroPath(row=>row.lump_value-100000),class:"profit-line lump"},heroSvg);
  make("path",{d:heroPath(row=>row.dca_value-row.dca_contributed),class:"profit-line dca"},heroSvg);

  tl.from("#sc01 .hero-plot",{opacity:0,y:20,duration:.55,ease:"power2.out"},1.2);
  tl.from("#sc02 .rules-title",{opacity:0,y:30,duration:.5,ease:"power3.out"},5.2);
  tl.from("#sc02 .rule-col",{opacity:0,y:32,duration:.5,stagger:.12,ease:"power2.out"},5.8);
  tl.fromTo("#sc02 .month",{opacity:.15},{opacity:1,duration:.07,stagger:.04,ease:"none"},7.4);
  tl.from("#sc03 .formula-title",{opacity:0,y:27,duration:.45,ease:"power3.out"},11.15);
  tl.from("#sc03 .formula-brief",{opacity:0,y:24,duration:.5,ease:"power2.out"},11.8);
  tl.from("#sc07 .summary-title",{opacity:0,y:28,duration:.5,ease:"power3.out"},164.2);
  tl.from("#sc07 .summary-row",{opacity:0,x:-24,duration:.4,stagger:.25,ease:"power2.out"},165);
  tl.from("#sc08 .method-title",{opacity:0,y:28,duration:.45,ease:"power3.out"},173.2);
  tl.from("#sc08 .method-item",{opacity:0,x:-24,duration:.3,stagger:.2,ease:"power2.out"},173.7);
  tl.from("#sc09 .final-title",{opacity:0,y:28,duration:.45,ease:"power3.out"},179.15);
  tl.from("#sc09 .final-claim",{opacity:0,y:28,duration:.5,ease:"power2.out"},179.7);
  tl.from("#sc09 .disclaimer",{opacity:0,y:16,duration:.45,ease:"power2.out"},180.5);
  [["sc01","sc02",5],["sc02","sc03",11],["sc03","sc04",14],["sc04","sc05",64],["sc05","sc06",114],["sc06","sc07",164],["sc07","sc08",173],["sc08","sc09",179]].forEach(([previous,next,at]) => {
    tl.set($(previous), {opacity:0}, at);
    tl.set($(next), {opacity:1}, at);
  });
  window.__timelines = window.__timelines || {};
  window.__timelines.main = tl;
};
