# 财经画面风格接入

已接入Lemo正式索引的全部59种风格，排除开发用`_template`。首批12种财经优先：数据叙事、瑞士动态排版、等距信息图、电视新闻包装、
蓝图、白板讲解、复古半调案卷、视觉调查、数据实物化、工程简报板、
档案灯台、卫星简报。新增47种扩展绘画、印刷、角色、像素、纸艺、3D与纪录技法。
它们是绘制库，沿用现有内容规划、pipeline、审批和渲染器。
完整名单、用途和依赖见[59种风格索引](../style-packs/CATALOG.md)。

## 使用入口

```sh
python -m lib.style_packs list
python -m lib.style_packs inspect lemo-dataviz
python -m lib.style_packs verify
```

生产通过 registry 中的 `style_pack` 工具查询和 materialize。
`inspect` 的 selection 包含 id、上游revision和当前引擎/规范digest。
在提案选定后贯穿 scene_plan、asset_manifest、edit_decisions、render_report。
传给 video_compose 的提案与剪辑选择不一致、版本漂移或已提供的下游产物
缺失选择时会在渲染前失败。旧项目没有 style_pack 时保持原行为。

材料化示例输入（selection 使用 inspect 实际返回值）：

```json
{
  "operation": "materialize",
  "pack_id": "lemo-dataviz",
  "output_path": "projects/<id>/composition/drawing-library",
  "selection": {"id":"lemo-dataviz","upstream_revision":"<inspect值>","digest":"<inspect值>"}
}
```

绘制库不自动创建整支影片；项目单独编写构图、镜头和时间轴。
详细协议见 [style-packs 技能](../skills/core/style-packs.md)。

## 已迁入什么

- 59份完整原始风格规范、59份财经适配、59份技法说明。
- 独立原引擎：数据叙事、等距图、蓝晒纸与制图、白板笔画、工程简报墙、卫星相机与shader；瑞士运动曲线。
- 拆分适配：瑞士网格/遮罩、新闻条/翻牌/擦除、半调/纸张/套印、证据框/时间读数、实体堆叠、档案台/放大镜。
- 原demo代码隔离于reference；素材、旁白、音乐及样片品牌不进入新片。
- Remotion和HyperFrames的时间驱动接入器，工具发现、版本绑定和契约检查。
- 新增47种中，37种保留独立原生模块与相对依赖闭包；10种从内联代码的视觉语法中抽取独立适配接口。完整原实现保留在reference/source，不能直接作为新片。
- 新增共享支持：Three后期、胶片门/计时/字幕块/蒙太奇窗口、界面与像素人物、点云扫描、校准切片与ROI。材料化时一并复制，纳入版本digest。
- 上游代码固定revision `ef1954e27faf9b5230f8492571b83c7c010e0748`，803个来源文件逐项记录SHA256。去除原立体书样片封面故事，修复经典脚本导出和DOM挂载耦合；原文仍在reference。

## 新增风格如何用于财经

首批12种仍是数据、机制、研究与新闻的默认候选。新增风格根据主题选择，
不能因为库里有59种，就把同一条财经解释混成59种画风。

| 用途 | 新增候选 | 使用边界 |
|---|---|---|
| 金融科技与工具讲解 | dark-keynote、hologram-hud、ascii-crt、living-screencast | 精确界面与数字原生排版；录屏使用实际产品 |
| 快讯、事件与实拍分析 | caption-news、countdown、city-symphony、telestrator | 授权片段、真实事件时间与坐标校准 |
| 商业史与制度叙事 | newsreel、kino-montage、art-deco、engraving、woodcut、silent-film | 档案须真实，装饰材质不作为证据 |
| 生活财经与情绪叙事 | watercolor、ink-wash、impasto、crayon-book、urban-sketch、one-line | 插画和隐喻明确标注，不用面积/物件数冒充数据 |
| 编辑插图与文化消费 | risograph、silkscreen-poster、ukiyoe、spy-titles、stained-glass | 保持文字可读和分色逻辑 |
| 财经启蒙与行为寓言 | brick-toy、pixel-rpg、pictogram-motion、microgame、game-show、midcentury-toon、rubber-hose、scifi-toon、cel-anime-80s | 角色与故事由新片创作，趣味不替代条件说明 |
| 空间、产业与工程 | white-model、lidar-survey、teardown、tilt-shift、lowpoly-island、hd-2d、backrooms | 测绘、体块、拆解需对应真实项目材料；隐喻场景不得暗示测量结论 |
| 纸艺与品牌叙事 | paper-popup、paper-lantern、papercut-red、shadow-puppet、glass-product | 迁入材质/折叠/灯光技法，镜头和对象重新设计 |
| 医药与检测产业 | microscope | 真实切片、扫描元数据和比例校准，不生成假组织影像 |

## 当前边界

**迁入并不等于每项原样片效果均已重现。**

| 风格 | 已有实现 | 仍需在具体制作中完成 |
|---|---|---|
| 数据叙事 | 原纸张、笔触、数据点、形状、相机 | 当前数据的图形设计、中文批注字体 |
| 瑞士排版 | 原曲线＋网格、遮罩、删除线 | 当前字体与光学对齐 |
| 等距信息图 | 原投影、深度排序、实体与数量图标 | 题材对应的对象与世界布局 |
| 新闻包装 | 通用标题条、翻牌、带状擦除、来源行 | 栏目品牌及所需地图/报道图形 |
| 蓝图 | 原制图引擎和WebGL纸张合成 | 当前结构和符号设计 |
| 白板 | 原笔画引擎、笔、擦除、釉面、EMS Tech字形 | 中文逐笔数据；目前测试含排印中文注释 |
| 半调案卷 | Canvas半调、纸张、套印、印章 | 题材所需人物/物件；不含原角色 |
| 视觉调查 | 原风格适配的证据框、高亮、时钟、不确定性 | 真实多源证据、片段预载、同步核对 |
| 数据实物化 | Three实体、真实单位计数、光照和阴影 | 原样片HDRI/景深尚未解耦迁入 |
| 工程简报板 | 原完整数据驱动白板引擎 | 真实物件照片与元数据；测试仅覆盖卡片/墨线 |
| 档案灯台 | 平面档案台、比例保留、放大镜 | 原负片转正/照片深度shader尚未解耦迁入 |
| 卫星简报 | 原地球、坐标、嵌套影像shader | 真实有日期影像及bbox；测试使用明确网格 |

浏览器技术测试验证接口，不认证事实或美术质量。真实证据类必须加真实
素材样片审核。适配状态不能被描述为59种原样片的完整功能等价。

新增风格的工程片段只覆盖代表性接口：例如积木组装、像素调色板、油彩高度场、
皮影透光、纸片折起、白模投影和点云截面。没有完整复刻原样片角色表演、
所有镜头、全部后期或真实素材处理链；详见各包TECHNIQUES.md。
竖屏夹具重新布置标题与说明，材质窗口保持原比例；它不证明整支影片已完成竖屏导演设计。

## 验证与预览

Python契约：

```sh
.venv/bin/python -m pytest tests/contracts/test_style_packs.py
```

浏览器依赖集中在 style-packs/package.json；开发环境可在该目录安装 npm
依赖和匹配的Playwright Chromium。QA也支持明确的 `--modules` 依赖目录
及 `--browser` 浏览器路径，不要求存在 Lemo 源仓库。

```sh
node scripts/qa_style_packs.mjs --out projects/style-pack-qa-all
node scripts/qa_style_packs.mjs --clips --out projects/style-pack-qa-all
```

QA启动临时本地服务，逐个验证横竖屏、三帧、乱序seek的像素确定性和
四种数据风格替换数据后的变化，结束后关闭服务和浏览器。输出report.json
和354张关键帧；`--clips` 另输出59段8秒、12fps、960×540的无声H264工程片段及本地index.html
预览页。`--new` 仅检查新增47种；`--pack slug1,slug2`选择风格，`--merge`将补测结果更新到已有报告；不加merge则为独立报告。
`--report-only` 可从已生成的report.json重建预览页。图片中明确标注合成夹具，不是财经事实。
对应画面逻辑在style-packs/examples/specimens.js与各类studies模块，可用于检查接口，禁止作为生产场景目录调用。

`shared/readability.js` 可验证作者提供的实际文字框和完整可读区间（中文
阅读时间、边界、竖屏字幕安全区）；没有测量数据时返回not_checked，不能当作通过。
运行时接口测试：`node --test tests/tools/style_pack_runtime.test.mjs`。

本机工程验证记录：118项横竖屏浏览器检查通过；354张关键帧与59段连续
片段已生成在[完整预览页](../projects/style-pack-qa-all/index.html)，通过ffprobe检查片段编码与时长。
Python相关回归203项、Node运行时接口2项通过；803个来源文件哈希校验通过，
首批12种的批准版本身份保持一致。首批预览projects/style-pack-qa/单独保留。
HyperFrames的GSAP绘制接入器通过真实timeline seek/rewind测试；Remotion
接入器通过实际独立Composition关键帧渲染（projects/style-pack-adapter-qa/）。
这不等于已完成每种风格的完整生产影片审核或HF完整片段渲染。

真实项目仍须用最终绘制代码、真实中文与素材，在其工作区完成关键帧、
6–10秒运动样片和最终全片审核；保留现有音色、无BGM默认值、字幕安全区、
财经尾句和封面合同。

## 更新上游

`scripts/import_lemo_styles.py <本地源仓库> --all` 导入正式索引全部59种，随后运行
`scripts/expand_style_catalog.py <本地源仓库>` 更新新增风格导引和完整索引。
它们是显式开发维护操作，记录源revision
和逐文件SHA256。上线和制作时无需源仓库。升级应审查差异、检查第三方
授权、重跑画面验证，不把新源代码静默覆盖到进行中的项目。
