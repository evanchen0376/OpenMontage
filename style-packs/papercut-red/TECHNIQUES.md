# 红色窗花剪纸 · 绘制接入

保留原独立绘制模块及其本地依赖闭包。 入口：`engine/paper.js`。

视觉合同：红纸镂空、纸边、剪口、对折和透光。

依赖：Canvas 2D。目录可发现不代表这些条件已就绪。

## 可用接口

- `engine/light.js`：`beginLight`, `pool`, `lightImage`, `lightRect`, `lightMasked`, `applyLight`, `glowWindow`, `bloom`, `rays`, `addMasked`。
- `engine/motifs.js`：`along`, `sawRow`, `sawEdge`, `crescentPts`, `crescent`, `crescentRows`, `swirl`, `doubleSwirl`, `cloudCut`, `plum`, `rosette`, `coin`, `dots`, `strands`, `taper`。
- `engine/paper.js`：`PAL`, `canvas`, `rnd`, `paperGrain`, `paperTile`, `fillPaper`, `curve`, `wob`, `trace`, `P`, `densify`, `Pl`, `ellipsePoly`, `fill`, `cut`, `cutLine`, `cutTaper`, `inset`, `within`, `SS`, `piece`, `finishPaper`, `drawPiece`, `paperShadow`, `noShadow`, `transmitOf`, `holesOf`。
- `engine/rig.js`：`mul`, `T`, `R`, `S`, `ap`, `scaleOf`, `I`, `put`, `solveRig`。
- `engine/tuanhua.js`：`TR`, `outerR`, `wedgeCuts`, `wedgeFlat`, `D4`, `tuanhua`, `tuanhuaHoles`。



## 集成边界

原始完整示例在reference/source，仅用于查技法，不能直接执行为新片。已提取的引擎按原相对结构保留，新增共享实现位于vendor/；材料化工具会一起复制。Three.js及addons由项目本地依赖或import map解析。字体、照片、工程模型、点云、扫描件和影片由项目另行准备，不能依赖Lemo源仓库。

本次验证覆盖本风格核心技法的独立工程片段；不等同于样片所有角色、全部镜头或完整高级效果均已复现。新片自行设计题材对象、角色和构图。

绘制入口实现create(canvas) -> {render(seconds), dispose?}，预载入素材，逐帧函数无时钟、无跨帧累积。沿用shared/RemotionDrawing.tsx或shared/hyperframes.js接到已批准运行时。
