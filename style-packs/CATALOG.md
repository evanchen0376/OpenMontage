# 完整风格索引

59种正式风格；首批12种保持财经优先，新增47种用于叙事辅助或专项素材。`_template`不在正式索引中。

原生表示保留独立上游模块；适配表示从内联视觉语法抽取接口。两者都不代表原样片全功能等价。工程片段不替代事实核验、真实素材测试或正式影片设计。

| 风格 | 财经定位 | 内容用途 | 入口 | 素材/运行条件 |
|---|---|---|---|---|
| [数据叙事](dataviz/STYLE.md) · `dataviz` | 财经优先 | 通胀与估值、资产回报、行业趋势 | 原生/适配 · `engine/engine.js` | Canvas 2D |
| [瑞士动态排版](swiss-motion/STYLE.md) · `swiss-motion` | 财经优先 | 观点短评、关键数字、概念辨析 | 原生/适配 · `engine/primitives.js` | Canvas 2D |
| [等距信息图](iso-infographic/STYLE.md) · `iso-infographic` | 财经优先 | 产业链、商业模式、资金流转 | 原生/适配 · `engine/engine.js` | Canvas 2D |
| [电视新闻包装](news-package/STYLE.md) · `news-package` | 财经优先 | 财经周报、政策发布、财报速览 | 原生/适配 · `engine/primitives.js` | Canvas 2D |
| [蓝图／工程制图](blueprint/STYLE.md) · `blueprint` | 财经优先 | 货币传导、杠杆结构、金融产品机制 | 原生/适配 · `engine/draw.js` | webgl2 |
| [白板讲解](whiteboard/STYLE.md) · `whiteboard` | 财经优先 | 债券久期、复利与费用、汇率机制 | 原生/适配 · `engine/engine/wb.js` | Canvas 2D |
| [复古半调案卷](halftone-dossier/STYLE.md) · `halftone-dossier` | 财经优先 | 投资误区、金融骗局案例、公司案例 | 原生/适配 · `engine/primitives.js` | Canvas 2D |
| [视觉调查](visual-investigation/STYLE.md) · `visual-investigation` | 财经优先 | 暴雷复盘、事件时间线、公告与事实核对 | 原生/适配 · `engine/primitives.js` | licensed-evidence |
| [数据实物化](data-physical/STYLE.md) · `data-physical` | 财经优先 | 债务规模、资产配置、财富分布、费用累积 | 原生/适配 · `engine/primitives.js` | three, webgl2 |
| [工程简报板](briefing-board/STYLE.md) · `briefing-board` | 财经优先 | 行业研究、产能分析、供应链约束 | 原生/适配 · `engine/kit/board.js` | licensed-object-photos |
| [档案灯台](archive-lighttable/STYLE.md) · `archive-lighttable` | 财经优先 | 公司历史、金融史、招股书细读 | 原生/适配 · `engine/primitives.js` | licensed-archive-scans |
| [卫星简报](satellite-briefing/STYLE.md) · `satellite-briefing` | 财经优先 | 港口物流、能源设施、地产开发、大宗商品供给 | 原生/适配 · `engine/engine.js` | webgl2, georeferenced-imagery |
| [装饰艺术](art-deco/STYLE.md) · `art-deco` | 叙事辅助 | 商业兴衰、财经历史、复古栏目片头 | 原生 · `engine/engine/deco.js` | Canvas 2D |
| [ASCII / CRT 终端](ascii-crt/STYLE.md) · `ascii-crt` | 叙事辅助 | 量化系统、科技产业、信息处理 | 原生 · `engine/term.js` | webgl2 |
| [后室 / 新怪谈](backrooms/STYLE.md) · `backrooms` | 叙事辅助 | 风险隐喻、空置空间、商业悬疑 | 原生 · `engine/tex.js` | three, webgl2 |
| [积木玩具](brick-toy/STYLE.md) · `brick-toy` | 叙事辅助 | 机制入门、产业搭建、供应链隐喻 | 原生 · `engine/bricks.js` | three, webgl2 |
| [字幕新闻](caption-news/STYLE.md) · `caption-news` | 专项 | 财经快讯、政策摘要、静音阅读 | 适配 · `engine/primitives.js` | licensed-footage |
| [80 年代赛璐璐动画](cel-anime-80s/STYLE.md) · `cel-anime-80s` | 叙事辅助 | 财经人物故事、时代产业、情绪叙事 | 原生 · `engine/cel.js` | webgl2 |
| [延时交响](city-symphony/STYLE.md) · `city-symphony` | 专项 | 城市经济、物流、产业观察 | 适配 · `engine/primitives.js` | licensed-timelapse |
| [实时倒计时分屏](countdown/STYLE.md) · `countdown` | 专项 | 政策发布、财报发布、事件同步 | 适配 · `engine/primitives.js` | synchronized-event-footage |
| [蜡笔儿童绘本](crayon-book/STYLE.md) · `crayon-book` | 叙事辅助 | 财经启蒙、生活成本、风险寓言 | 原生 · `engine/crayon.js` | webgl2 |
| [暗色科技发布](dark-keynote/STYLE.md) · `dark-keynote` | 专项 | 金融科技界面、产品功能、关键数字 | 原生 · `engine/engine.js` | Canvas 2D |
| [铜版画](engraving/STYLE.md) · `engraving` | 叙事辅助 | 货币史、商业制度、研究插图 | 原生 · `engine/engine/index.js` | Canvas 2D |
| [综艺节奏扁平](game-show/STYLE.md) · `game-show` | 叙事辅助 | 概念辨析、财经知识问答、互动栏目 | 适配 · `engine/primitives.js` | Canvas 2D |
| [玻璃质感产品](glass-product/STYLE.md) · `glass-product` | 叙事辅助 | 金融科技产品、品牌概念、栏目片头 | 原生 · `engine/studio.js` | three, webgl2 |
| [HD-2D](hd-2d/STYLE.md) · `hd-2d` | 叙事辅助 | 经济寓言、商业成长、人物旅程 | 原生 · `engine/px.js` | three, webgl2 |
| [科幻全息界面](hologram-hud/STYLE.md) · `hologram-hud` | 专项 | 科技产业结构、模型拆解、技术指标 | 原生 · `engine/engine/holo.js` | Canvas 2D |
| [油画厚涂](impasto/STYLE.md) · `impasto` | 叙事辅助 | 人物故事、财富情绪、产业场景 | 原生 · `engine/engine/impasto.js` | webgl2 |
| [中国水墨](ink-wash/STYLE.md) · `ink-wash` | 叙事辅助 | 周期隐喻、长期主义、东方商业叙事 | 原生 · `engine/ink.js` | webgl2 |
| [构成主义蒙太奇](kino-montage/STYLE.md) · `kino-montage` | 专项 | 财经历史、工业化、政策与社会变迁 | 适配 · `engine/primitives.js` | licensed-archive |
| [点云测绘](lidar-survey/STYLE.md) · `lidar-survey` | 专项 | 资源测绘、基建、空间资产研究 | 适配 · `engine/primitives.js` | three, webgl2, metric-point-cloud |
| [活体实机录屏](living-screencast/STYLE.md) · `living-screencast` | 专项 | 金融工具教学、财务软件、操作演示 | 适配 · `engine/primitives.js` | actual-product-ui |
| [低多边形等距](lowpoly-island/STYLE.md) · `lowpoly-island` | 叙事辅助 | 产业生态、城市发展、资产组合隐喻 | 原生 · `engine/sea.js` | three, webgl2 |
| [微游戏快闪](microgame/STYLE.md) · `microgame` | 叙事辅助 | 财经小测、风险识别、快节奏概念对比 | 原生 · `engine/toon.js` | webgl2 |
| [显微叙事](microscope/STYLE.md) · `microscope` | 专项 | 医药行业、检测成本、微观产业证据 | 适配 · `engine/primitives.js` | calibrated-scan |
| [50s 扁平卡通](midcentury-toon/STYLE.md) · `midcentury-toon` | 叙事辅助 | 家庭收支、消费选择、经济寓言 | 原生 · `engine/engine/toon.js` | Canvas 2D |
| [1920s 新闻影片](newsreel/STYLE.md) · `newsreel` | 专项 | 金融史、商业史、历史事件回顾 | 适配 · `engine/primitives.js` | licensed-archive |
| [一笔画](one-line/STYLE.md) · `one-line` | 叙事辅助 | 经济联系、人物轨迹、连续关系隐喻 | 原生 · `engine/geom.js` | Canvas 2D |
| [纸雕灯影](paper-lantern/STYLE.md) · `paper-lantern` | 叙事辅助 | 生活经济、商业文化、节庆消费 | 原生 · `engine/src/paper.js` | three, webgl2 |
| [纸片立体书](paper-popup/STYLE.md) · `paper-popup` | 叙事辅助 | 商业模式入门、公司故事、产业展开 | 原生 · `engine/book.js` | three, webgl2 |
| [红色窗花剪纸](papercut-red/STYLE.md) · `papercut-red` | 叙事辅助 | 节庆经济、消费文化、东方商业寓言 | 原生 · `engine/paper.js` | Canvas 2D |
| [象形运动图形](pictogram-motion/STYLE.md) · `pictogram-motion` | 叙事辅助 | 行为分类、消费人群、概念快解 | 原生 · `engine/engine.js` | Canvas 2D |
| [16-bit 像素 RPG](pixel-rpg/STYLE.md) · `pixel-rpg` | 叙事辅助 | 预算选择、复利旅程、风险决策寓言 | 原生 · `engine/px.js` | Canvas 2D |
| [Risograph 孔版印刷](risograph/STYLE.md) · `risograph` | 叙事辅助 | 财经编辑插图、消费案例、轻叙事 | 原生 · `engine/draw.js` | webgl2 |
| [1930s 橡皮管卡通](rubber-hose/STYLE.md) · `rubber-hose` | 叙事辅助 | 投资行为偏差、生活财经、风险寓言 | 原生 · `engine/toon.js` | Canvas 2D |
| [科幻情景喜剧卡通](scifi-toon/STYLE.md) · `scifi-toon` | 叙事辅助 | 科技经济寓言、激励冲突、行为偏差 | 原生 · `engine/toon.js` | Canvas 2D |
| [皮影戏](shadow-puppet/STYLE.md) · `shadow-puppet` | 叙事辅助 | 商业故事、传统产业、人物寓言 | 原生 · `engine/carve.js` | webgl2 |
| [1920s 默片](silent-film/STYLE.md) · `silent-film` | 叙事辅助 | 金融史、行为寓言、无旁白栏目 | 原生 · `engine/engine/ink.js` | webgl2 |
| [丝印旅行海报](silkscreen-poster/STYLE.md) · `silkscreen-poster` | 叙事辅助 | 地区产业、城市研究、文化消费 | 原生 · `engine/engine/silk.js` | Canvas 2D |
| [60s 间谍片头](spy-titles/STYLE.md) · `spy-titles` | 叙事辅助 | 资金追踪、商业悬疑、调查片头 | 原生 · `engine/paper.js` | Canvas 2D |
| [彩色玻璃窗](stained-glass/STYLE.md) · `stained-glass` | 叙事辅助 | 历史制度、文化财经、长期结构隐喻 | 原生 · `engine/glass.js` | webgl2 |
| [产品拆解](teardown/STYLE.md) · `teardown` | 专项 | 制造业成本、硬件产业、产品结构 | 原生 · `engine/src/parts.js` | three, webgl2, engineering-files |
| [体育战术板](telestrator/STYLE.md) · `telestrator` | 专项 | 赛事商业、空间行为分析、实拍解释 | 适配 · `engine/primitives.js` | licensed-footage-and-calibration |
| [移轴微缩](tilt-shift/STYLE.md) · `tilt-shift` | 叙事辅助 | 城市经济、物流、地产和产业场景 | 原生 · `engine/post.js` | three, webgl2 |
| [浮世绘](ukiyoe/STYLE.md) · `ukiyoe` | 叙事辅助 | 贸易史、东方商业、周期叙事 | 原生 · `engine/print.js` | Canvas 2D |
| [钢笔淡彩](urban-sketch/STYLE.md) · `urban-sketch` | 叙事辅助 | 城市商业、街区消费、生活观察 | 原生 · `engine/engine.js` | webgl2 |
| [水彩笔刷](watercolor/STYLE.md) · `watercolor` | 叙事辅助 | 生活财经、环境经济、人物故事 | 原生 · `engine/engine.js` | Canvas 2D |
| [白模投影](white-model/STYLE.md) · `white-model` | 专项 | 地产研究、城市更新、区域数据 | 原生 · `engine/studio.js` | three, webgl2, real-massing-model |
| [木刻版画](woodcut/STYLE.md) · `woodcut` | 叙事辅助 | 金融史、产业劳动、制度叙事 | 原生 · `engine/engine/index.js` | webgl2 |

技术验证和边界：[接入说明](../docs/FINANCE_STYLE_PACKS.md)。完整索引由 `scripts/expand_style_catalog.py` 维护。
